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
  Platform
} from "react-native";
import { Spinner} from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import { Bubbles } from "react-native-loader";
import AsyncStorage from "@react-native-community/async-storage";
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-datepicker';
import { isEmpty } from "lodash";

class ShowStudentAttendanceToTeacher extends Component {
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
      date:'2021-01-01',
      selectedSchool:'1',
      loading:false,
      miniLoading:false,
      schools: [],
      value: '',
      roleval: '',
      navparams: '',
      teacher_id: '',
      mobile_num:'',
      loading: false,
    };
  }

  async componentDidMount() {
    this.setState({
        loading: true
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
   console.log(this.state.data);
}

  getAttendance = async () => {
    this.setState({ miniLoading: true})
    console.log(this.state.selectedDate)
      if(this.state.data && this.state.selectedSchool){
        console.log(`${API_URL}/get-students-attendances-for-teacher-via-date/${this.state.selectedSchool}/${this.state.teacher_id}/${this.state.date}`)
        await fetch(`${API_URL}/get-students-attendances-for-teacher-via-date/${this.state.selectedSchool}/${this.state.teacher_id}/${this.state.date}`, {
            method: "GET",
            })
           .then(response => response.json())
           .then(response => {
             console.log("==== attendance list ====>>",response)
            if(response){
              
              this.setState({ data: response, miniLoading: false });
            } else {
              this.setState({ data: [], miniLoading: false})
            }        
          }).catch((err) => alert(err)); 
      } else {
        this.setState({ data: [], miniLoading: false})
          alert('Please select date and school.');
      } 
  }

 goBack = () => {
    this.props.navigation.goBack(null)
  };

  renderItem = ({item}) =>{
      if(item.attendance_status == 1){
        return(
            <View style={styleData.stdutentPresentColumn}>
                <Text style={styleData.columnTest}>{item.admission_number}</Text>
                <Text style={styleData.columnTest2}>{item.student_name}</Text>
                <Text style={styleData.columnTest}>present</Text>
            </View>
        )
      } else {
        return (
            <View style={styleData.studentAbsentColumn}>
                <Text style={styleData.columnTest}>{item.admission_number}</Text>
                <Text style={styleData.columnTest2}>{item.student_name}</Text>
                <Text style={styleData.columnTest}>absent</Text>
            </View>
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
            <Text style={{fontSize: 18, fontWeight: "bold", color:"#1CAFF6"}}>Student Attendance</Text>
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
                <View style={{ flex: 1, marginTop: -20, width: "95%", alignSelf: "center" }}>
                    <Text style={styleData.customParentStyle}>Filter school & date</Text>
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
                        }}
                        placeholder=""
                      />
                    </View>
                  </View>

                <View style={{...styleData.customDropdown, zIndex:9, marginTop: 10}}>
                    <View  style={styleData.customDropdownChild1}>
                      <Text style={ this.state.selectedClass == "all"?{...styleData.lableStyle, color: "#E6E6E6"}:styleData.lableStyle}>Select Date:</Text>
                    </View>
                    <View style={styleData.customDropdownChild2}>
                    <DatePicker
                      style={{ ...styleData.customDropdownDivider, paddingBottom: 10, width:"100%" }}
                      date={this.state.date}
                      mode="date"
                      placeholder="select date"
                      format="YYYY-MM-DD"
                      minDate="2016-05-01"
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
                        this.setState({date: date})
                        this.getAttendance()
                      }}
                    />
                    </View>
                  </View>
            </View>

            <View style={{ flex: 1, marginTop: 10, width: "95%", alignSelf: "center", zIndex:-1 }}>
                    <Text style={styleData.customParentStyle}>Student Attendance Table                 {this.state.data.total}/{this.state.data.present}</Text>
                </View> 

            <View style={styleData.tableBody}>
                <View style={styleData.tableheader}>
                    <Text style={styleData.tableHeaderText}>Rg_no.</Text>
                    <Text style={styleData.tableHeaderText2}>Name</Text>
                    <Text style={styleData.tableHeaderText}>P/A</Text>
                </View>
                <FlatList 
                 data={this.state.data.students}
                 keyExtractor={(item) => item.student_id}
                 renderItem={this.renderItem}
                />
                
                <View style={{flex:1, flexDirection:'row', height:150, alignItems:'center', justifyContent:'center'}}>
                    {
                        isEmpty(this.state.data.students) && !this.state.miniLoading?(<Text style={styleData.noData}>No Data</Text>):null
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
        zIndex:-1
    },

    tableheader: {
        flex:1,
        flexDirection:'row',
        height:40,
        borderColor:'black',
        backgroundColor:'#d3d3d3',
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
        borderColor:'black',
        backgroundColor:'#FF6347', 
        paddingHorizontal:4,
        borderBottomWidth:2
    },

    stdutentPresentColumn:{
        flex:1,
        flexDirection:'row', 
        height:40,
        borderColor:'black',
        backgroundColor:'#00FF00',
        paddingHorizontal:4,
        borderBottomWidth:2
    },

    columnTest: {
        flex:1,
        alignSelf:'center'
    },
    columnTest2: {
        flex:2,
        alignSelf:'center'
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

export default ShowStudentAttendanceToTeacher;