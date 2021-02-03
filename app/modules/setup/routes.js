import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';

import React, { useEffect, useState } from 'react';
//import {createStackNavigator,createDrawerNavigator, createMaterialTopTabNavigator, createAppContainer} from 'react-navigation';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

import { TouchableItem } from 'react-native-tab-view';
import HomeStack from './homestack';
import AsyncStorage from '@react-native-community/async-storage';
import Sidemenu from './sidemenu';
import { Icon } from 'react-native-elements';

import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import SchoolScreen from '../screens/SchoolScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import TrainerAttendance from '../screens/TrainerAttendance';
import Student from '../screens/Student';
import Parents from '../screens/Parents';
import StudentProfile from '../screens/StudentProfile';
import StudentAttendance from '../screens/StudentAttendance';
import CarouselScreen from '../screens/CarouselScreen';
import VideoUploadScreen from '../screens/VideoUploadScreen';
import ActivitiesStatsScreen from '../screens/ActivitiesStatsScreen';
import ActivitiesClassesScreen from '../screens/ActivitiesClassesScreen';
import StudentListingActivitiesScreen from '../screens/StudentListingActivitiesScreen';
import VideoScreen from '../screens/VideoScreen';
import SendNotification from '../screens/SendNotification';
import {Icon as Icons} from 'native-base';
import Video from 'react-native-vector-icons/FontAwesome';
const items = [
  {
    navOptionThumb: 'circle',
    navOptionName: 'Cricket',
    screenToNavigate: "Home",
  },
  {
    navOptionThumb: 'circle',
    navOptionName: 'Dance',
    screenToNavigate: "Home",
  },
  {
    navOptionThumb: 'circle',
    navOptionName: 'Cricket',
    screenToNavigate: "Home",
  },
  {
    navOptionThumb: 'circle',
    navOptionName: 'Dance',
    screenToNavigate: "Home",
  },
  {
    navOptionThumb: 'circle',
    navOptionName: 'Football',
    screenToNavigate: "Home",
  },
  {
    navOptionThumb: 'circle',
    navOptionName: 'French',
    screenToNavigate: "Home",
  },

];

const renderMenu = (navigation) => {

  let [user, setUser] = useState();
  let [userrole, setUserrole] = useState();

  AsyncStorage.getItem("@userRoll").then((userRole) => {
    if (userRole) {
        setUserrole(userRole)
    }
  }, (err) => {
    console.log("error", err);
  });

  AsyncStorage.getItem("@userData").then((user) => {
    if (user) {
      let profle = JSON.parse(user);
      setUser(profle);
      //user(profle);
      user.ImageUrl = profle;
      // if (!user.EmployeeFirstName && profle) {
      //   setUser(profle);
      //   user.ImageUrl = profle.ImageUrl;
      //   console.log("ProfilePic ", Config.ResourceServerUrl + "" + profle.ImageUrl);
      //   console.log("USER",user);
      // }
    }
  }, (err) => {
    console.log("error", err);
  });


  console.log("rendering the menu");
  const toggleClose = () => {
    navigation.closeDrawer();
  }

  const LogOut = () => {
    AsyncStorage.removeItem('@userData');
		AsyncStorage.removeItem('@userRoll');
    navigation.closeDrawer();
    navigation.navigate("SignupScreen");
    setUser();
  }

  const ShowAllVideo =() =>{
    navigation.navigate("VideoScreen");
  }

  //// let [user, setUser] = useState({ UserFirstName: "", UserLastName: "", ImageUrl: ""});

  if (user != "" && user != null && user != undefined) {
    var data = "Sign Out"
  } else {
    var data = "Sign In"
  }


  return (
    <View style={styles.sideMenuContainer}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => toggleClose()}>
          <Text style={styles.toggleClose} >
            <Icon name={"close"} size={30} color="#4B4B4C" />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} >
      </View> 
      {user != "" && user != null && user != undefined
      && (userrole=='trainer'|| userrole=='admin') ? 
      <View style={styles.menuItemsActivities}>
        <View style={styles.menuActivities}>
         <TouchableOpacity
          onPress={() => ShowAllVideo()}>
          <>
          <View style={styles.menuItemIcon}>
          <Text style={{color: '#23ABE2',fontSize: 18, marginTop: 5}}>
          <Video name="video-camera" style={{fontSize: 20}} />
            {"  "}
            Upload Video
          </Text>
          </View>
         </>
        </TouchableOpacity>

        </View>
      </View>: null }

      {user != "" && user != null && user != undefined
      && (userrole=='principal') ? 
      <View style={styles.menuItemsActivities}>
        <View style={styles.menuActivities}>
         <TouchableOpacity
          onPress={() => navigation.navigate("NotificationHistory", { listupdated: false })}>
          <>
          <View style={styles.menuItemIcon}>
          <Text style={{color: '#23ABE2',fontSize: 18, marginTop: 5}}>
            <Icons name="paper-plane" style={{ size: 25, color:"#23ABE2"}} />
          {"  "}
            Notifications
          </Text>
          </View>
         </>
        </TouchableOpacity>

        </View>
      </View>: null }

      <View style={styles.menuItemsActivities}>
        <View style={styles.menuActivities}>
          <View style={styles.menuItemIcon}>
            <Icon name={"description"} size={25} color="#23ABE2" />
          </View>
          <Text style={styles.menuActivitiesText} >
            Our Activities
        </Text>
        </View>
      </View>
      {/*Setting up Navigation Options from option array using loop*/}
      <View style={styles.menuItemsContainer}>
      <Sidemenu navigation={navigation}/>
      </View>

      <View style={styles.signOutMenuItemContainer}>
        <TouchableItem
          style={styles.signOutMenuItem}
          onPress={() => LogOut()}>
          <>
            <View style={styles.signInIcon}>
              <Icon name={"west"} size={25} color="#fff" />
            </View>
            <Text style={styles.signIn} >
              {data}
            </Text></>
        </TouchableItem>
      </View>
    </View>
  );
}


let MenuNavigator = createDrawerNavigator({
  HomeStack: {
    screen: HomeStack
  }, drawerBackgroundColor: "red",

},
  {
    contentComponent: ({ navigation }) => {
      return <>
        {
          renderMenu(navigation)
        }
      </>
    },
    drawerBackgroundColor: '#0000FF',
  }
);


export default createAppContainer(MenuNavigator);

const styles = StyleSheet.create({
  sideMenuContainer: {
    backgroundColor: '#fff',
    //alignItems: 'center',
    paddingTop: 7,
    flex: 1
  },
  profileContainer: {
    marginBottom: 8,
    marginLeft: 20

  },
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    marginTop: 0,
    borderRadius: 50,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e2e2e2',
    //marginTop: 5,
  },
  menuItemsContainer: {
    width: '100%',
    flex: 0.9,
  },
  menuItemsActivities: {
    width: '100%',
    flexDirection: "column"
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    marginLeft: 18
  },
  menuActivities: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff'
  },
  menuItemIcon: {
    marginRight: 10,
    marginLeft: 20,
    //marginTop:10
  },
  signInIcon: {
    marginRight: 8,
    marginLeft: 17,
    //position:"absolute",
    //zIndex:99,
    //left:0
  },
  menuItemText: {
    fontSize: 15, color: '#23ABE2',
  },
  signIn: {
    fontSize: 17, color: '#fff',
  },
  signOutMenuItemContainer: {
    width: "100%",
    alignItems: 'center',
  },
  signOutMenuItem: {
    flexDirection: 'row',
    width: '50%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#23ABE2'
  },
   videoMenuItem: {
    flexDirection: 'row',
    width: '50%',
    padding: 10,
    borderRadius: 10,
   
  },
  toggleClose: {
    fontSize: 25,
    backgroundColor: '#ffffff',
    color: '#23ABE2',
  },
  menuActivitiesText: {
    fontSize: 20,
    color: '#23ABE2',

  }

});
