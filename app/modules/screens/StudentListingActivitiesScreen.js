import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet,TouchableOpacity } from "react-native";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
class StudentListingActivitiesScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.studentsNames = [];
    this.state = {
      studentsNames:[],
      teacherName:null,
      teacher_id:null,
      actClassName:null,
      activityName:null,
      emptyMsg:null,
      loading:true
    };
  }

 componentDidMount() {
    const { params } = this.props.navigation.state;
    let that = this;
    if (params.activityId != undefined && params.activityName && params.activityClass) {
      fetch(`${API_URL}/student-attendance-by-activity/${params.activityClass}/${params.activityId}`)
        .then((res) => res.json())
        .then((responsed) => {
          if (responsed != undefined && responsed.length) {
            let teacherName = null;
            let teacherId = null
            console.log("=========================");
            console.log(responsed);
            console.log("==========================");
            responsed.forEach(function (item, index) {
              teacherName = item.teacher_name;
              teacherId = item.teacher_id;
              that.studentsNames.push(item);
            });
            if (teacherName) {
              that.setState({
                teacher_id: teacherId,
                teacherName: teacherName,
                studentsNames: that.studentsNames,
                activityName:params.activityName,
                actClassName:params.activityClass,
                loading:false
              });
            }
          } else {
            that.setState({
              emptyMsg: "No Record Found",
              loading:false
            });
          }
        });
    }
  }

  integer_to_roman(num) {
      if (typeof num !== 'number') 
      return false; 
      var digits = String(+num).split(""),
      key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
      "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
      "","I","II","III","IV","V","VI","VII","VIII","IX"],
      roman_num = "",
      i = 3;
      while (i--)
      roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
      return Array(+digits.join("") + 1).join("M") + roman_num;
  }

  capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  goBack = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "ActivitiesClassesScreen",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  openTrainerData = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "TrainerAttendanceChart",
      params: {
        trainer_id: this.state.teacher_id,
        trainerName: this.state.teacherName
    }
    });
    this.props.navigation.dispatch(navigateAction);
  }


  render() {
    const { state, navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    const { teacherName,activityName,actClassName,studentsNames,emptyMsg,loading } = this.state;
    var array = [];
    var that = this;
    studentsNames.length &&
      studentsNames.forEach(function (item, index) {
        array.push(
          <ListItem
            containerStyle={{
              marginLeft: 15,
              marginRight: 15, 
              marginTop: 15,
              borderRadius:5,
              borderWidth:1,
            }}
            component={TouchableScale}
            title={
              <Text style={{ paddingLeft: 5, fontSize: 14 }}>
                {item.student_name}
              </Text>
            }
            rightIcon={
              <Text
                style={{ fontSize: 12,color: "#23ABE2" }}
              >
               {item.student_attendance} attendence   
              </Text>
            }
          />
        );
      });
    return (
      <ScrollView style={styleData.screenContainer}>
        <View style={styleData.container}>
        <TouchableOpacity onPress={() =>  this.goBack()}>
          <Icon
            name="arrow-left"
            onPress={() => this.goBack()}
            style={{ fontSize: 18,padding:5}}
          />
          </TouchableOpacity>
          <View style={{flex: 1}}>
          <Text
            style={{ fontSize: 15,textAlign: 'right',fontWeight:'bold',marginRight: 15 }}
          >
            {params.schoolName != undefined && params.schoolName
                ? params.schoolName
                : null}
          </Text>
          </View>
        </View>
        {loading==false ?
        (<View>
          <Text
            style={{ fontSize: 18,fontWeight:'bold',paddingLeft: 20,marginTop:15,color: "#23ABE2" }}
          >
            {activityName} - Class - {isNaN(actClassName)? that.capitalize(actClassName) : that.integer_to_roman(parseInt(actClassName))}
          </Text>
          <Text
            style={{ fontSize: 14,paddingLeft: 20,marginTop:5,marginBottom:10,color: "#23ABE2" }}
          >
            Trainer - {teacherName}
          </Text>
          <TouchableOpacity 
            onPress={() =>  this.openTrainerData()}
            style={{ fontSize: 22, marginTop: 18, marginRight: 18, position: 'absolute', right: 0,alignItems: 'center'}}
            >
            <Icon
              name="bar-chart"
              style={{ fontSize: 18,padding:5, color: '#23ABE2'}}
            />
            <Text
              style={{color: '#23ABE2'}}
            >attendence</Text>
          </TouchableOpacity>
        </View>
        ):null}

        <View>
        {array}
          {loading ? (
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
          ) : null}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 65,
              marginBottom: 10,
            }}
          >
            {emptyMsg}
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styleData = StyleSheet.create({
  screenContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingLeft: 10,
    marginTop: 15,
    height:40,
    borderBottomWidth:2,
    borderColor:'#ddd',
  },
  activityText: {
    backgroundColor: "#F7F7F7",
    marginTop: 50,
    marginBottom: 10,
    marginRight: 15,
    marginLeft: 15,
    padding: 6,
  },
  listData: {
    marginTop: 0,
    padding: 0,
  },
  activityHeader: {
    marginTop: 10,
  },
  stretch: {
    width: 200,
    height: 50,
  },
  captureImageData: {
    textAlign: "center",
  },
  activities: {
    padding: 6,
    backgroundColor: "#fff",
    margin: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#B0C043",
  },
});

export default StudentListingActivitiesScreen;
