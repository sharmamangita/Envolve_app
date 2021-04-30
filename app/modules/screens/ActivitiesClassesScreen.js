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

class ActivitiesClassesScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.classNames = [];
    this;
    this.state = {
      classNames: [],
      activityName: null,
      activityId: null,
      schoolId: null,
      emptyMsg: null,
      progress: 0,
      indeterminate: true,
      loading: true,
    };
  }



  componentDidMount() {
    const { params } = this.props.navigation.state;
    let that = this;
    console.log("checking params for list-class-activities ===>>", params);
    console.log(params.schoolId);
    console.log(params.activity_id);
    console.log(params.activity_name)
    if (params.activity_id != undefined && params.activity_name) {
        console.log("activity_id in componentDidMount ===>>>", params.activity_id);
        console.log("schoolId in componentDidMount ===>>>", params.schoolId);

      fetch(`${API_URL}/list-class-activities/${params.activity_id}/${params.schoolId}`)
        .then((res) => res.json())
        .then((responsed) => {
          console.log("list-class-activites response ==>>", responsed);
          if (responsed != undefined && responsed.length) {
            let activityName = null;
            let activityId = null;
            responsed.forEach(function (item, index) {
              activityName = item.activity_name;
              activityId = item.activity_id;
              that.classNames.push(item);
            });
            if (activityName) {
              that.setState({
                activityName: activityName,
                activityId: activityId,
                classNames: that.classNames,
                schoolId: params.schoolId,
                loading: false,
              });
              console.log("list-class-activites ===>>>", activityName, ", ", activityId, ", ", that.classNames)
            }
          } else {
            that.setState({
              emptyMsg: "No Record Found",
              loading: false,
            });
          }
        });
    }
  }

  goBack = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "ActivitiesStatsScreen",
    });
    this.props.navigation.dispatch(navigateAction);
  };

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

  goToStudentActivities(activityClass = null) {
    const { params } = this.props.navigation.state;
    const { activityId, activityName } = this.state;
    const navigateAction = NavigationActions.navigate({
      routeName: "StudentListingActivitiesScreen",
      params: {
        activityId: activityId,
        activityName: activityName,
        activityClass: activityClass,
        schoolName: params.schoolName,
        schoolId: this.state.schoolId
      },
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    const { params } = this.props.navigation.state;
    const { classNames, activityName, emptyMsg, loading } = this.state;
    var array = [];
    var that = this;
    if (classNames.length) {
      classNames.forEach(function (item, index) {
        array.push(
          <TouchableOpacity
            onPress={() => that.goToStudentActivities(item.class)}
          >
            <ListItem
              containerStyle={{
                marginLeft: 15,
                marginRight: 15,
                marginTop: 15,
                borderRadius: 5,
                borderWidth: 1,
              }}
              component={TouchableScale}
              title={
                <Text style={{ paddingLeft: 5, fontSize: 14 }}>
                  {isNaN(item.class)? that.capitalize(item.class) : that.integer_to_roman(parseInt(item.class))}
                </Text>
              }
              rightIcon={
                <Icon
                  name="users"
                  style={{ fontSize: 22, color: "#23ABE2" }}
                />
              }
            />
          </TouchableOpacity>
        );
      });
    }
    return (
      <ScrollView style={styleData.screenContainer}>
        <View style={styleData.container}>
          <TouchableOpacity onPress={() => this.goBack()}>
            <Icon
              name="arrow-left"
              onPress={() => this.goBack()}
              style={{ fontSize: 18, padding: 5 }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                textAlign: "right",
                fontWeight: "bold",
                marginRight: 15,
              }}
            >
              {params.schoolName != undefined && params.schoolName
                ? params.schoolName
                : null}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              paddingLeft: 20,
              marginTop: 15,
              marginBottom: 10,
              color: "#23ABE2",
            }}
          >
            {params.activity_name != undefined && params.activity_name
              ? params.activity_name
              : null}
          </Text>
        </View>
        <View>
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

          {array}
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
    height: 40,
    borderBottomWidth: 2,
    borderColor: "#ddd",
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
  progress: {
    margin: 10,
  },
});

export default ActivitiesClassesScreen;
