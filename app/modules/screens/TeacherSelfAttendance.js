import React, { Component } from "react";
import {
  ScrollView,
  View,
  ViewBase,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  FlatList,
  Platform,
  PermissionsAndroid
} from "react-native";
import { ListItem, Radio, Right, Left, CardItem, Body, Button} from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import { Bubbles } from "react-native-loader";
import AsyncStorage from "@react-native-community/async-storage";
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from 'react-native-geolocation-service';
import { checkNotifications, openSettings } from 'react-native-permissions';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import Modal from "react-native-modal";
import DatePicker from 'react-native-datepicker';

class TeacherSelfAttendance extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.activitiesStudentsCount = [];
    this.state = {
      data:[],
      fetchnewlist: false,
      date:'',
      selectedSchool:'',
      loading:false,
      miniLoading:false,
      schools: [],
      value: '',
      roleval: '',
      navparams: '',
      teacher_id: '',
      mobile_num:'',

      filePath: '',
      location: '',
      secondtime:false,
      trainerAttendance: true,
      gotlocation: false,
      isModalVisible: false,

      oneLeave: true,
      start_date:'',
      end_date:'',

      stopped:true,
      fetching: false,
    };
  }

  async componentDidMount() {
    let b = new Date();
    let Y = b.getFullYear();
    let M = b.getMonth()+1;
    let D = b.getDate();
    let FD = Y+"-"+(String(M).length == 1? "0"+M:M)+"-"+(String(D).length == 1?"0"+D:D)
    console.log(FD)
    
    this.setState({
        loading: true,
        date: FD,
        start_date: FD,
        end_date:FD
    })

    await AsyncStorage.getItem("@teacher_id").then(
        (teacher_id) =>{
          this.setState({ teacher_id });
        }, (err) =>{
          console.log("error",err)
    })

    await AsyncStorage.getItem("@mobile_num").then(
        (mobile_num) =>{
          this.setState({ mobile_num });
        }, (err) =>{
          console.log("error",err)
    })

    // =============================== 
    await fetch(`${API_URL}/get-user-data/${this.state.mobile_num}`).then((res) => res.json()).then((response) =>{
        if(response.role) {
            this.setState({roleval: response});
        } else {
            this.setState({
                loading: false
            });
        }
    }).catch((err) => {
        this.setState({
            loading: false
        });
        alert(err);
    })
    // ===============================

    var teacher_id = JSON.stringify(this.state.teacher_id)
    var users_id = JSON.stringify(this.state.roleval.user_id)
    var teacher = teacher_id.replace(/^"|"$/g, '');
    var users = users_id.replace(/^"|"$/g, '');
    await fetch(`${API_URL}/list-schools/${teacher}/${users}`).then((res) => res.json()).then((response) => {
        if (response.length > 0) {
            let b = []
            response.map((data) => b.push({ "label": data.school_name, "value": data.school_id }));
            this.setState({ schools: b,loading:false });
            console.log("schools =>", b)
        } else {
            this.setState({
                loading: false
            });
        }
    }).catch((err) => {
        this.setState({
            loading: false
        });
        alert(err);
    })

  }

    // ==============================================================================

    requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs camera permission',
            },
          );
          // If CAMERA Permission is granted
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      } else return true;
    };

    requestExternalWritePermission = async () => {
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

    requestGeoLocation = async () => {
      if(Platform.OS === 'android'){
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'App needs access to your location',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          alert("Location permission err", err);
          return false;
        }
      } else return true;
    };

  captureImage = async (type, start_date, end_date, status) => {
      let options = {
        mediaType: type,
        maxWidth: 300,
        maxHeight: 550,
        quality: 1,
        videoQuality: 'low',
        durationLimit: 30, //Video max duration in seconds
        saveToPhotos: true,
      };
      let isCameraPermitted = await this.requestCameraPermission();
      let isStoragePermitted = await this.requestExternalWritePermission();
      let isgeoLocation = await this.requestGeoLocation();
      console.log("==========>>>>>>>", isgeoLocation)
      if (isCameraPermitted && isStoragePermitted && isgeoLocation) {
          launchCamera(options, (response) => {
            console.log('Response = ', response);
    
            if (response.didCancel) {
              alert('User cancelled camera picker');
              return;
            } else if (response.errorCode == 'camera_unavailable') {
              alert('Camera not available on device');
              return;
            } else if (response.errorCode == 'permission') {
              alert('Permission not satisfied');
              return;
            } else if (response.errorCode == 'others') {
              alert(response.errorMessage);
              return;
            }
            this.setState({ filePath: response});

            this.sendTrainerAttendance(start_date, end_date, status);
          });
      } else {
        if(this.state.secondtime){
          openSettings();
        }else {
          alert("App need to access Location, Camera, and External Storage Write Permission");
        }
        this.setState({secondtime: true});
      }
    };

    createFormData = (photo, body, start_date, end_date, status) => {
      const data = new FormData();
      data.append("photo", {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
      });
    
      Object.keys(body).forEach(key => {

        data.append(key, body[key]);
      });

      console.log("============================= form data ==========================");
      console.log(start_date);
      console.log("============================= form data ==========================");
      data.append("school_id", this.state.selectedSchool);
      data.append("teacher_id", this.state.teacher_id);
      data.append("status", status);
      data.append("start_date", start_date);
      data.append("end_date", end_date); 

      console.log("============================= form data ==========================");
      console.log(data);
      console.log("============================= form data ==========================");

      return data;
    };

    sendTrainerAttendance = async (start_date, end_date, status) =>{
      let gotlocation = false;
      this.setState({ loading: true});
      console.log("=========== sendTrainerAttendance is called ==============")
      await Geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords);
          // this.setState({location: position.coords, gotlocation: true});
          fetch(`${API_URL}/mark-trainer-attendance/`, {
            method: "POST",
            headers: {
            'Content-Type': 'multipart/form-data',
          },
           body: this.createFormData(this.state.filePath, position.coords, start_date, end_date, status)
         })
           .then(response => response.json())
           .then(response => {
             console.log("Attendance has been Submitted", response);
             this.setState({ loading: false});
             alert("Attendance has been Submitted");
             this.setState({ photo: null, trainerAttendance: true });
           })
           .catch(error => {
             console.log("Attendance submission", error);
             this.setState({ loading: false, trainerAttendance: false});
             alert("Attendance submission error!");
           });
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
          Alert.alert(
            `Error code: ${error.code}`,
            `${error.message}`,
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
        );
          this.setState({ loading: false, gotlocation: false});
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
        console.log("============================ end ===========================");
      return null;
    }
  // ==============================================================================  

  checkAttendance = async () => {
    this.setState({
      fetching: true
  });
    console.log(`${API_URL}/check-trainer-attendance-status/${this.state.teacher_id}/${this.state.selectedSchool}/${this.state.date}`)
    await fetch(`${API_URL}/check-trainer-attendance-status/${this.state.teacher_id}/${this.state.selectedSchool}/${this.state.date}`)
    .then((res) => res.json()).then((response) => {

      console.log(response)
      if(response.status == 1){
        alert(response.message);
        this.setState({ stopped: true})
      } else if(response.status == 0){
        alert(response.message);
        this.setState({ stopped: true})
      } else if(response.status == 2){
        this.setState({ stopped: false})
      }
      this.setState({ loading:false, fetching: false});
  }).catch((err) => {
      this.setState({
          loading: false,
          stopped: true,
          fetching: false,
      });
      alert(err);
  })
  }

  modalScreen = () => {
    this.setState({isModalVisible: !this.state.isModalVisible})
  }

 goBack = () => {
    this.props.navigation.goBack(null)
  };


  render() {

    return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
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
            <Text style={{fontSize: 18, fontWeight: "bold", color:"#1CAFF6"}}>Mark Attendance</Text>
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
          ):
        <View>
            <View> 
                <View style={{ flex: 1, marginTop: -25, width: "95%", alignSelf: "center" }}>
                    <Text style={styleData.customParentStyle}>Filter school & Mark Attendance </Text>
                </View> 
                <View style={ Platform.OS == 'ios' ? {...styleData.customDropdown, zIndex:10 } : styleData.customDropdown}>
                    <View style={styleData.customDropdownChild1}>
                    <Text style={styleData.lableStyle}>Select School:</Text>
                    </View>
                    <View style={styleData.customDropdownChild2}>
                      <DropDownPicker
                        items={this.state.schools}
                        defaultValue=""
                        containerStyle={{ height: 50 }}
                        style={{ ...styleData.customDropdownDivider, paddingBottom: 10 }}
                        itemStyle={{
                          justifyContent: "flex-start"
                        }}
                        dropDownStyle={{ backgroundColor: "#fafafa" }}
                        onChangeItem={ async (item) => {
                          await this.setState({ selectedSchool: item.value, data:[]})
                          this.checkAttendance()
                        }}
                        placeholder=""
                      />
                    </View>
                </View>
            </View>
            <View style={styleData.cardContainer}>
              <View style={styleData.columnCard}>
                <TouchableOpacity onPress={() => {
                  if(this.state.selectedSchool){
                      if(!this.state.stopped){
                        this.captureImage('photo', this.state.date, this.state.date, 1)
                      }
                  }else {
                    alert("Please select school.")
                  }
                  
                  }} style={styleData.cardP}>

                  <Icon name='check-circle' size={48} color='#23ABE2' />
                  {
                    !this.state.fetching?
                    <Text style={styleData.styleText}>Mark Present</Text>
                    :
                    <Text style={styleData.styleText}>Getting Ready..</Text>
                  }
                  
                </TouchableOpacity>
              </View>
              <View style={{...styleData.columnCard, flex: 0.2}}>
              </View>
              <View style={styleData.columnCard}>
                <TouchableOpacity onPress={() =>{
                  if(this.state.selectedSchool){
                    if(!this.state.stopped){
                      this.modalScreen()
                    }
                  } else {
                    alert("Please select school.")
                  }
                
                }} style={styleData.cardA}>
                    <Icon name="close" size={48} color='#FF6347' style={{alignSelf:'center'}} />
                  {
                    !this.state.fetching?
                    <Text style={styleData.styleTextA}>Mark Absent</Text>
                    :
                    <Text style={styleData.styleTextA}>Getting Ready..</Text>
                  }
                  
                  <Modal isVisible={this.state.isModalVisible}>
                      <View style={{ flex: 1, backgroundColor:"white", borderRadius: 10, marginVertical: "20%"}}>
                        <View style={{flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 1, padding: 10}}>
                          <Text style={{flex: 10, fontWeight:'bold', color:'#23ABE2'}}>Mark Attendance</Text>
                          <TouchableOpacity onPress={() => this.modalScreen()} style={{ width: 20, alignContent: 'center'}}><Icon name="close" size={20} color="#1CAFF6" /></TouchableOpacity>
                        </View>
                        <View style={{paddingTop: 10}}>
                          <CardItem>
                            <Body style={{alignItems:'center', justifyContent:'center'}}>
                            
                            <View style={{ marginTop:-20, marginBottom:10, width: "100%", }}>
                              <Text style={styleData.customParentStyle}>Select Leave Type</Text>
                            </View> 
                            
                            <View style={{ width:'100%', height:40, borderBottomWidth:1, borderColor:'#eaeaea'}}>
                              <TouchableOpacity onPress={()=> this.setState({ oneLeave: true, start_date: this.state.date, end_date: this.state.date})} style={{ flex:1, flexDirection:'row', alignItems:'center'}}>
                                <Text style={this.state.oneLeave?{flex:11, fontSize:16,  color:'#23ABE2' }:{flex:11, fontSize:16, color:'gray'}}>Today on Leave</Text>
                                <Icon name="check" size={18} color='#23ABE2' style={this.state.oneLeave?{flex:1}:{flex:1, display:'none'}} />
                              </TouchableOpacity>
                            </View>

                            <View style={{ width:'100%', height:40, borderBottomWidth:1, borderColor:'#eaeaea'}}>
                              <TouchableOpacity onPress={() => this.setState({ oneLeave: false})} style={{ flex:1, flexDirection:'row', alignItems:'center'}}>
                                <Text style={!this.state.oneLeave?{flex:11, fontSize:16,  color:'#23ABE2' }:{flex:11, fontSize:16, color:'gray'}}>More Then One Leave</Text>
                                <Icon name="check" size={18} color='#23ABE2' style={!this.state.oneLeave?{flex:1}:{flex:1, display:'none'}} />
                              </TouchableOpacity>
                            </View>
                            
                            <View style={{width:'100%', marginTop:30}}>
                              <Text style={{fontSize:16,  color:'#23ABE2' }}>Start Date:</Text>
                              <DatePicker
                                disabled={this.state.oneLeave?true:false}
                                style={{paddingBottom: 10, width:"100%" }}
                                date={this.state.start_date}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
                                minDate={this.state.date}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                  dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                  },
                                  dateInput: {
                                    marginLeft: 36
                                  }
                                  // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => {
                                  this.setState({start_date: date, end_date: date, fetchnewlist: true})
                                }}
                              />
                            </View>
                            <View style={{width:'100%', marginTop:10}}>
                              <Text style={{fontSize:16,  color:'#23ABE2' }}>End Date:</Text>
                              <DatePicker
                                disabled={this.state.oneLeave?true:false}
                                style={{paddingBottom: 10, width:"100%" }}
                                date={this.state.end_date}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
                                minDate={this.state.start_date}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                  dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                  },
                                  dateInput: {
                                    marginLeft: 36
                                  }
                                  // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => {
                                  this.setState({end_date: date, fetchnewlist: true})
                                }}
                              />
                            </View>

                            <View style={styleData.box1}>
                                <TouchableOpacity 
                                style={styleData.loginButton}
                                onPress={() => {
                                  
                                  if(this.state.selectedSchool){
                                    this.captureImage('photo', this.state.start_date, this.state.end_date, 0)
                                  }else {
                                    alert("Please select school.")
                                  }
                                  this.modalScreen()
                                  }}
                                >
                                    <Text style={styleData.loginText} > send </Text>
                                </TouchableOpacity>
                            </View>

                            </Body>
                          </CardItem>
                        </View>
                      </View>
                  </Modal>

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

  loginButton: {
    backgroundColor: "#23ABE2",
    width: '100%',
    borderRadius:5,
    padding: 10
  },
  loginText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 18,
  },
  box1: {
    // paddingHorizontal: 10,
    paddingTop: 20,
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',

  },

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

    cardContainer:{
      flex:1,
      flexDirection:'column',
      paddingHorizontal:10,
      marginTop:40
    },
    columnCard:{
      flex:1,
      flexDirection:'column',
      paddingVertical:4
    },
    rowSearchCard:{
      flex:1,
      flexDirection:'row',
      paddingHorizontal:9
    },
    cardP: {
      height:150,
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
    cardA: {
      height:150,
      justifyContent:'center',
      alignItems:'center',
      borderWidth:1,
      borderColor:'#FF6347',
      padding:5,
      borderRadius:10,
      backgroundColor:'rgba(228, 35, 0, 0.2)',
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
      fontSize:18,
      fontWeight:'bold',
      color:'#23ABE2'
    },
    styleTextA:{
      textTransform:'uppercase',
      fontSize:18,
      fontWeight:'bold',
      color:'#FF6347'
    },

    customParentStyle:{
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#1CAFF6",
        marginTop: 20
      },
      customDropdown:{
        flex: 1,
        flexDirection: 'row',
        // marginTop: 10,
        width: "95%",
        alignSelf: "center",
        justifyContent: 'center',
      },
      customDropdownDivider:{
        borderBottomWidth: 0.8,
        borderColor: '#fff',
        borderBottomColor: '#e8e8e8',
      },
      customDropdownChild1:{
        // flex: 2
            borderBottomWidth: 0.8,
        borderColor: '#e8e8e8'
      },
      customDropdownChild2: {
        flex:9
      },
      lableStyle:{
        color: '#404040',
        paddingTop: 13
      }

});

export default TeacherSelfAttendance;
