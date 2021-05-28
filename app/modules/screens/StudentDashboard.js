import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView
} from "react-native";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import AsyncStorage from "@react-native-community/async-storage";
import { Directions } from "react-native-gesture-handler";

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
        loading:false
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
                        }}>
                        <View style={{flex:1, height:'100%', alignItems:'center', justifyContent:'center'}}>
                            <TouchableOpacity style={{borderRadius:50}}>
                                <Image source={require('../assets/images/studentLogo.png')} style={{height:80, width:80}} />
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
                        <TouchableOpacity style={styleData.card}>
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
    padding:5
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
