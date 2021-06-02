import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import AsyncStorage from "@react-native-community/async-storage";
import { Directions } from "react-native-gesture-handler";
import DocumentPicker from 'react-native-document-picker';
import { openSettings } from 'react-native-permissions';

class StudentDashboard extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.activitiesStudentsCount = [];
    this.state = {
        student_id:this.props.navigation.state.params.student_id,
        student_info:'',
        secondtime:false,
        loading:false,
        singleFile:''
    };
  }


  async componentDidMount() {
    
    this.setState({loading: true});
        await fetch(`${API_URL}/get-student-basic-info/${this.state.student_id}`)
        .then((res) => res.json()).then((response) => {
          if (response.length > 0) {
              console.log(" student info ========>>>", response)
              this.setState({ student_info: response[0], loading:false});
          } else {
              this.setState({ student_info: '', loading: false});
          }
        }).catch((err) =>{
            this.setState({loading:false });
            alert(err);
    
        })
    }

  goBack = () => {
    this.props.navigation.goBack(null)
  };

    openSchoolDiary = (x) => {
        console.log(x)
        const navigateAction = NavigationActions.navigate({
            routeName: 'SchoolDiary',
            params: {
                student: x
            }
        });
        this.props.navigation.dispatch(navigateAction);
    }

    openAttendanceScreen = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'ShowAttandanceToParents',
            params: {
                student: this.state.student_info
            }
        });
        this.props.navigation.dispatch(navigateAction);
    }

  // ====================== permission ============================

  requestExternalReadPermission = async () => {
    if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'External Storage Write Permission',
              message: 'App needs write permission',
            },
          );
          // If WRITE_EXTERNAL_STORAGE Permission is granted
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          alert('Write permission err', err);
        }
        return false;
      } else return true;
  };


  chooseImageFromPhone = async () => {
    console.log("ues")

    console.log(this.state.singleFile)
    // Opening Document Picker to select one file
    let checkPermission = await this.requestExternalReadPermission();

    if(checkPermission){
        try {
            const res = await DocumentPicker.pick({
              // Provide which type of file you want user to pick
              type: [
                DocumentPicker.types.images
              ],
            });
            // Printing the log realted to the file
            console.log('res : ' + JSON.stringify(res));
            // Setting the state to show single file attributes
            await this.setState({ singleFile: res });
            this.UploadProfileImage()
          } catch (err) {
            this.setState({ singleFile: '' });
            // Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
              // If user canceled the document selection
              alert('user canceled the Image selection');
            } else {
              // For Unknown Error
              alert('Unknown Error: ' + JSON.stringify(err));
              throw err;
            }
          }
    } else {
        if(this.state.secondtime){
            openSettings();
          }else {
            alert("App need to access Location, Camera, and External Storage Write Permission");
          }
          this.setState({secondtime: true});
    }
  }

  UploadProfileImage = async () => {
    console.log(this.state.student_id);
    console.log(this.state.singleFile);
    this.setState({ loading: true });

        if(this.state.student_id && this.state.singleFile)
        {
            await fetch(`${API_URL}/upload-student-photo/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            body:  this.createForm()
            })
            .then(response => response.json())
            .then(response => {
                this.setState({ singleFile:'', loading: false});
                alert(response.status);       
            });
            this.setState({loading: false})
        } else {
            this.setState({ loading: false})
            alert("all fields are required")
    }
  }

  createForm = () => {
        var data = new FormData()
        data.append("student_id",this.state.student_id)
        data.append("photo", this.state.singleFile);

        console.log("============================= form data ==========================");
        console.log(data);
        console.log("============================= form data ==========================");
    
        return data;
  }

  // ====================== permission ============================
  render() {
    return (
        <SafeAreaView  style={{flex:1, backgroundColor:'white'}}>
            <ScrollView style={styleData.screenContainer}>
                <View style={styleData.container}>
                    <TouchableOpacity onPress={() =>  this.goBack()}>
                        <Icon
                            name="arrow-left"
                            onPress={() => this.goBack()}
                            style={{ fontSize: 18,padding:5, color:"#1CAFF6"}}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity style={styleData.headerView1} onPress={() =>  this.goBack()}>
                    <Text style={{fontSize: 18, fontWeight: "bold", color:"#1CAFF6"}}>Student Info</Text>
                        </TouchableOpacity>
                        <View style={styleData.headerView}>
                    <TouchableOpacity>
                            <Image source={require('../assets/images/sm-logo.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                <Text
                    style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    marginTop: 15,
                    textAlign: "center",
                    }}
                >
                    {this.stateschoolName}
                </Text>
                </View>
                {this.state.loading ? (
                    <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "40%",
                    }}
                    >
                    <Bubbles size={20} color="#1CAFF6" />
                    </View>
                ) : 

                <View>

                    <View style={{
                            flex:1,
                            paddingHorizontal:10,
                            flexDirection:'row',
                            height: 100,
                            marginTop:-20,
                            borderBottomWidth:2,
                            borderTopWidth:2,
                            borderColor:'#23ABE2',
                            backgroundColor:'rgba(35, 171, 226, 0.2)',
                            shadowColor: 'black',
                            shadowOpacity: 0.5,
                            shadowOffset: {width:4, height:4}
                        }}>
                        <View style={{flex:1, height:'100%', alignItems:'center', justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=> this.chooseImageFromPhone()} style={{borderRadius:50}}>
                           { console.log(`${API_URL}/upload/student/${this.state.student_info.student_photo}`)}
                                {
                                    
                                    this.state.student_info.student_photo?
                                    <Image source={{uri:`${API_URL}/upload/student/${this.state.student_info.student_photo}`}} style={{height:80, width:80, borderRadius:50}} />:
                                    <Image source={require('../assets/images/studentLogo.png')} style={{height:80, width:80, borderRadius:50}} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:2, height:'100%',justifyContent:'center'}}>
                            <Text>Name: {this.state.student_info.student_name}</Text>
                            <Text>class: {this.state.student_info.class} - {this.state.student_info.section}</Text>
                            <Text>Roll No.: {this.state.student_info.admission_number} </Text>
                        </View>
                    </View>

                    <View style={styleData.cardContainer}>
                        <View style={styleData.columnCard}>
                        <TouchableOpacity style={styleData.card}>
                            <Text style={styleData.styleText}>performance</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={{...styleData.columnCard, flex: 0.2}}>
                        </View>
                        <View style={styleData.columnCard}>
                        <TouchableOpacity onPress={() => this.openAttendanceScreen()} style={styleData.card}>
                            <Text style={styleData.styleText}>Attendance</Text>
                        </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styleData.cardContainer}>
                        <View style={styleData.columnCard}>
                        <TouchableOpacity style={styleData.card}>
                            <Text style={styleData.styleText}>bus tracking</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={{...styleData.columnCard, flex: 0.2}}>
                        </View>
                        <View style={styleData.columnCard}>
                        <TouchableOpacity style={styleData.card}>
                            <Text style={{...styleData.styleText, textDecorationLine:'underline'}}>Activity</Text>
                            <Text style={{...styleData.styleText, fontSize:11}}>French</Text>
                            <Text style={{...styleData.styleText, fontSize:11}}>English</Text>
                            <Text style={{...styleData.styleText, fontSize:11}}>Japanese</Text>
                        </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styleData.cardContainer}>
                        <View style={styleData.columnCard}>
                        <TouchableOpacity style={styleData.card}>
                            <Text style={styleData.styleText}>Ativity time lapse video</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={{...styleData.columnCard, flex: 0.2}}>
                        </View>
                        <View style={styleData.columnCard}>
                        <TouchableOpacity style={styleData.card}>
                            <Text style={styleData.styleText}>Important topic videos</Text>
                        </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styleData.cardContainer}>
                        <View style={styleData.columnCard}>
                            <TouchableOpacity style={styleData.card}>
                                <Text style={styleData.styleText}>Pay Fees</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styleData.columnCard}>
                            <TouchableOpacity style={styleData.card}>
                                <Text style={styleData.styleText}>Buy Uniforms</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styleData.columnCard}>
                            <TouchableOpacity style={styleData.card}>
                                <Text style={styleData.styleText}>Buy Stationary</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styleData.cardContainer}>
                        <View style={styleData.columnCard}>
                            <TouchableOpacity 
                            onPress={() => this.openSchoolDiary(this.state.student_info)}
                            style={styleData.card}>
                                <Text style={styleData.styleText}>What happeing in school</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                }
            </ScrollView>
        </SafeAreaView>
    );
  }
}

const styleData = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingHorizontal: 5,
        marginTop: 5,
        height:40,
        borderBottomWidth:2,
        borderColor:'#ddd',
    },
    headerView1:{
        flex:1, 
        // flexDirection: 'row-reverse',
        marginLeft: 8,
        marginTop:4
    },
    headerView:{
        flex:1, 
        flexDirection: 'row-reverse',
        marginLeft: 10
      },
  screenContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  cardContainer:{
    flex:1,
    flexDirection:'row',
    paddingHorizontal:10,
    marginTop:40
  },
  columnCard:{
    flex:1,
    flexDirection:'column',
    paddingHorizontal:9
  },
  rowSearchCard:{
    flex:1,
    flexDirection:'row',
    paddingHorizontal:9
  },
  card: {
    height:60,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    borderColor:'#23ABE2',
    padding:5,
    borderRadius:10,
    backgroundColor:'rgba(35, 171, 226, 0.2)',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width:4, height:4}
  },
  SearchCard:{
    flex:1,
    flexDirection:'row',
    height:40,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    borderColor:'#c3c3c3',
    paddingStart:10,
    borderRadius:5,  
  },

  columnCardSearch:{
    flex:0.2,
    flexDirection:'column',
    paddingHorizontal:9
  },

  styleText:{
    textTransform:'uppercase',
    fontSize:12
  }

});

export default StudentDashboard;
