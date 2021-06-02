import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Spinner} from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import { Bubbles } from "react-native-loader";
import AsyncStorage from "@react-native-community/async-storage";
import DropDownPicker from 'react-native-dropdown-picker';

class ShowSchoolAttendanceForPrincipal extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.activitiesStudentsCount = [];
    this.state = {
      school_id:null,
      data:[],
      fetchnewlist: false,
      loading:false,
      miniLoading:false
    };
  }

  async componentDidMount() {
      this.setState({loading:true})
    await AsyncStorage.getItem("@schoolId").then(
      (school_id) =>{
        this.setState({ school_id });
      }, (err) =>{
        console.log("error",err)
    });

    await fetch(`${API_URL}/list-school-teachers/${this.state.school_id}`, {
        method: "GET",
        })
       .then(response => response.json())
       .then(response => {
         console.log("==== teacher list ====>>",response)
        if(response.length){
          this.setState({ data: response, loading: false });
        } else {
          this.setState({ data:[], loading: false})
        }        
      }).catch((err) => alert(err));
  
  }

 goBack = () => {
    this.props.navigation.goBack(null)
  };

  openTrainerData = (teacher_id, teacherName) => {
    const navigateAction = NavigationActions.navigate({
      routeName: "TrainerAttendanceChart",
      params: {
        trainer_id: teacher_id,
        trainerName: teacherName
    }
    });
    this.props.navigation.dispatch(navigateAction);
  }

  renderItem = ({item}) =>{
      console.log(item)
      if(item.attendance_status == 'Present'){
        return(
            <TouchableOpacity onPress={() => this.openTrainerData(item.teacher_id, item.teacher_name)} style={styleData.stdutentPresentColumn}>
                <Text style={styleData.columnTest2P}>{item.teacher_name}</Text>
                <Text style={styleData.columnTestP}>{item.attendance_status}</Text>
                <Text style={styleData.columnTestP}>More..</Text>
            </TouchableOpacity>
        )
      } else {
        return (
            <TouchableOpacity onPress={() => this.openTrainerData(item.teacher_id, item.teacher_name)} style={styleData.studentAbsentColumn}>
                <Text style={styleData.columnTest2A}>{item.teacher_name}</Text>
                <Text style={styleData.columnTestA}>{item.attendance_status}</Text>
                <Text style={styleData.columnTestA}>More..</Text>
            </TouchableOpacity>
        )
      }
  }

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
            <Text style={{fontSize: 18, fontWeight: "bold", color:"#1CAFF6"}}>Teacher Attendance</Text>
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

            <View style={{ flex: 1, marginTop: -20, width: "95%", alignSelf: "center", zIndex:-1 }}>
                </View> 

            <View style={styleData.tableBody}>
                <View style={styleData.tableheader}>
                    <Text style={styleData.tableHeaderText2}>Name</Text>
                    <Text style={styleData.tableHeaderText}>P/A</Text>
                    <Text style={styleData.tableHeaderText}></Text>
                </View>
                <FlatList 
                 data={this.state.data}
                 keyExtractor={(item) => item.student_id}
                 renderItem={this.renderItem}
                />
                
                <View style={{flex:1, flexDirection:'row', height:150, alignItems:'center', justifyContent:'center'}}>
                    {
                        !this.state.data.length && !this.state.miniLoading?(<Text style={styleData.noData}>No Data</Text>):null
                    }
                    {
                        this.state.miniLoading?<Spinner color="#1CAFF6" />:null
                    }
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

  tableBody:{ 
    marginTop: 10,
    width: "95%",
    alignSelf: "center",
    backgroundColor:'rgba(35, 171, 226, 0.2)',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width:4, height:4},
    borderColor:'#23ABE2',
    borderWidth:1,
    borderRadius:5,
    zIndex:-1
  },

  tableheader: {
      flex:1,
      flexDirection:'row',
      height:40,
      borderColor:'#23ABE2',
      // backgroundColor:'#d3d3d3',
      paddingHorizontal:4,
      borderBottomWidth:2
  },

  tableHeaderText: {
      flex:1,
      alignSelf:'center',
      fontSize:16,
      fontWeight:'bold'
  },
  tableHeaderText2: {
      flex:2,
      alignSelf:'center',
      fontSize:16,
      fontWeight:'bold'
  },
  studentAbsentColumn:{
      flex:1,
      flexDirection:'row',
      height:40,
      borderColor:'#23ABE2',
      // backgroundColor:'#FF6347', 
      paddingHorizontal:4,
      borderBottomWidth:2,
  },

  stdutentPresentColumn:{
      flex:1,
      flexDirection:'row', 
      height:40,
      borderColor:'#23ABE2',
      paddingHorizontal:4,
      borderBottomWidth:2
  },
  columnTestA: {
    flex:1,
    alignSelf:'center',
    color:'#FF6347',
    fontWeight:'bold',
  },
  columnTest2A: {
    flex:2,
    alignSelf:'center',
    color:'#FF6347',
    fontWeight:'bold',
  },

  columnTestP: {
  flex:1,
  alignSelf:'center',
  fontWeight:'bold',
  },
  columnTest2P: {
  flex:2,
  alignSelf:'center',
  fontWeight:'bold',
  },

    noData:{
        flex:1, 
        fontSize:16, 
        fontWeight:'bold', 
        textAlign:'center'
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

export default ShowSchoolAttendanceForPrincipal;
