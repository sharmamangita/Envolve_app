import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet,TouchableOpacity } from "react-native";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";

class ActivitiesStatsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      value1: "",
      gotImage: 0,
      schoolData: [],
      navparams: [],
    };
  }


  goToClassActivities(activity=null){
    alert(activity);
    const navigateAction = NavigationActions.navigate({
      routeName: "ActivitiesClassesScreen",
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
    return (
      <ScrollView style={styleData.screenContainer}>
        <View style={styleData.container}>
        <TouchableOpacity onPress={() => this.goToClassActivities('Cricket')}>
          <Icon
            name="chevron-left"
            onPress={() => this.goBack()}
            style={{ fontSize: 22, color: "#23ABE2"}}
          />
          </TouchableOpacity>
          <Text
            onPress={() => this.goBack()}
            style={{ fontSize: 16, color: "#23ABE2", marginLeft: 15 }}
          >
            ACTIVITIES - Stats
          </Text>
          <Text
            style={{ fontSize: 12,textAlign:'right',marginLeft: 15 }}
          >
            School Name come here
          </Text>
        </View>
        <View>
        <TouchableOpacity onPress={() => this.goToClassActivities('Cricket')}>
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
              <Text style={{ paddingLeft: 10, color: "#23ABE2", fontSize: 14 }}>
                Cricket
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
                  30
                </Text>
                <Text style={{ paddingLeft: 10, color: "#000", fontSize: 14 }}>
                  Students
                </Text>
              </View>
            }
          />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.goToClassActivities('Table Tennis')}>
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
              <Text style={{ paddingLeft: 10, color: "#23ABE2", fontSize: 14 }}>
                Table Tennis
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
                  30
                </Text>
                <Text style={{ paddingLeft: 10, color: "#000", fontSize: 14 }}>
                  Students
                </Text>
              </View>
            }
          />
          </TouchableOpacity>
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
