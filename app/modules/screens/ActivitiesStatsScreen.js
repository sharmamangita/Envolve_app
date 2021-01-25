import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
class ActivitiesStatsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.activitiesStudentsCount = [];
    this.state = {
      activitiesStudentsCount: [],
      value1: "",
      gotImage: 0,
      schoolName: null,
      navparams: [],
      schoolId:null,
      loading:true
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    let that = this;
    if (params.schoolData != undefined && params.schoolData) {
      let schoolData = params.schoolData;

      if (schoolData.school_id != undefined && schoolData.school_id) {
        fetch(
          `${API_URL}/count-activities-totoalStudents/${schoolData.school_id}`
        )
          .then((res) => res.json())
          .then((responsed) => {
            console.log("=============school===============");
            console.log(schoolData.school_id);
            console.log(responsed);
            console.log("============================");
            if (responsed != undefined && responsed.length) {
              let schoolName = null;
              let schoolId=null;
              responsed.forEach(function (item, index) {
                schoolName = item.school_name;
                schoolId=item.school_id;
                that.activitiesStudentsCount.push(item);
              });
              if (schoolName && schoolId) {
                this.setState({
                  schoolName: schoolName,
                  activitiesStudentsCount: that.activitiesStudentsCount,
                  schoolId:schoolId,
                  loading:false
                });
              }
            }
          });
      }
    }
  }

  goToClassActivities(activity_id = null,activity_name = null) {
    const {schoolName,schoolId}=this.state;
    const navigateAction = NavigationActions.navigate({
      routeName: "ActivitiesClassesScreen",
     params: {
        activity_id:activity_id,
        activity_name:activity_name,
        schoolName:schoolName,
        schoolId:schoolId
      }
    });
    this.props.navigation.dispatch(navigateAction);
  }

  goBack = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "HomeScreen",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  render() {
    const { state, navigate } = this.props.navigation;
    const { schoolName, activitiesStudentsCount,loading } = this.state;
    var array = [];
    var that = this;
    activitiesStudentsCount.length &&
      activitiesStudentsCount.forEach(function (item, index) {
        
        array.push(
          <TouchableOpacity
            onPress={() => that.goToClassActivities(item.activity_id,item.activity_name)}
          >
            <ListItem
              containerStyle={{
                backgroundColor: "#F5F1F0",
                marginLeft: 15,
                marginRight: 15,
                marginTop: 15,
                borderRadius: 7,
              }}
              component={TouchableScale}
              title={
                <Text
                  style={{ paddingLeft: 10, color: "#23ABE2", fontSize: 14 }}
                >
                  {item.activity_name}
                </Text>
              }
              rightIcon={
                <View>
                  <Text
                    style={{
                      paddingLeft: 10,
                      color: "#000",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    {item.students}
                  </Text>
                  <Text
                    style={{ paddingLeft: 10, color: "#000", fontSize: 14 }}
                  >
                    Students
                  </Text>
                </View>
              }
            />
          </TouchableOpacity>
        );
      });
    return (
      <ScrollView style={styleData.screenContainer}>
        <View style={styleData.container}>
          <TouchableOpacity onPress={() => this.goToClassActivities("Cricket")}>
            <Icon
              name="chevron-left"
              onPress={() => this.goBack()}
              style={{ fontSize: 22, color: "#23ABE2" }}
            />
          </TouchableOpacity>
          <Text
            onPress={() => this.goBack()}
            style={{ fontSize: 16, color: "#23ABE2", marginLeft: 15 }}
          >
            ACTIVITIES - Stats
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            {schoolName}
          </Text>
        </View>
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
        <View>{array}</View>
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
    marginLeft: 10,
    marginTop: 15,
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

export default ActivitiesStatsScreen;
