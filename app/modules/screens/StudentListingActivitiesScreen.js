import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet,TouchableOpacity } from "react-native";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";

class StudentListingActivitiesScreen extends Component {
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

  goBack = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "ActivitiesClassesScreen",
    });
    this.props.navigation.dispatch(navigateAction);
  };


  render() {
    const { state, navigate } = this.props.navigation;
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
            School Name come here
          </Text>
          </View>
        </View>
        <View>
          <Text
            style={{ fontSize: 18,fontWeight:'bold',paddingLeft: 20,marginTop:15,color: "#23ABE2" }}
          >
            LAWN TENNIS - Class-IV 
          </Text>
          <Text
            style={{ fontSize: 14,paddingLeft: 20,marginTop:5,marginBottom:10,color: "#23ABE2" }}
          >
            Trainer - Sunil Sharma - 90% attendence 
          </Text>
        </View>
        <View>
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
                Ryan
              </Text>
            }
            rightIcon={
              <Text
                style={{ fontSize: 12,color: "#23ABE2" }}
              >
               90% attendence   
              </Text>
            }
          />
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
              <Text style={{ paddingLeft: 5,  fontSize: 14 }}>
                Jassi Gill
              </Text>
            }
            rightIcon={
              <Text
                style={{ fontSize: 12,color: "#23ABE2" }}
              >
               90% attendence   
              </Text>
            }
          />
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
              <Text style={{ paddingLeft: 5,  fontSize: 14 }}>
                Noor Singh
              </Text>
            }
            rightIcon={
              <Text
                style={{ fontSize: 12,color: "#23ABE2" }}
              >
               80% attendence   
              </Text>
            }
          />
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
