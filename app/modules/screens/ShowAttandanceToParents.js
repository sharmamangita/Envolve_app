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
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

class ShowAttandanceToParents extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.activitiesStudentsCount = [];
    this.state = {
        student_info:this.props.navigation.state.params.student,
        attendance:[],
        loading:false,
    };
  }


  async componentDidMount() {
    
        console.log(this.state.student_info.student_id);

        this.setState({loading: true});
        await fetch(`${API_URL}/get-student-anual-attendance/${this.state.student_info.student_id}`)
        .then((res) => res.json()).then((response) => {
          if (response.length > 0) {
              console.log(" student info ========>>>", response)
              let attendance = response.reduce((o, key) =>({ ...o, [key.attendance_date.slice(0,10)]: { selected: true, marked: true, selectedColor: key.attendance_status == '1'?"green":"red"}}),{})
              this.setState({ attendance, loading:false});
          } else {
              this.setState({ attendance: '', loading: false});
          }
        }).catch((err) =>{
            this.setState({loading:false });
            alert(err);
    
        })
        console.log(this.state.attendance)
    }

  goBack = () => {
    this.props.navigation.goBack(null)
  };

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
                    <Text style={{fontSize: 18, fontWeight: "bold", color:"#1CAFF6"}}>Attendance</Text>
                        </TouchableOpacity>
                        <View style={styleData.headerView}>
                    <TouchableOpacity>
                            <Image source={require('../assets/images/sm-logo.png')} />
                        </TouchableOpacity>
                    </View>
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

                <View style={{marginTop: -20}}>

                    <View style={styleData.cardContainer}>
                        <View style={styleData.columnCard}>
                        <Calendar
  // Collection of dates that have to be marked. Default = {}
  markedDates={this.state.attendance}
/>
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

export default ShowAttandanceToParents;
