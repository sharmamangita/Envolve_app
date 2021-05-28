import React, { Component } from 'react';

import { StyleSheet, View, Text, Image, SafeAreaView } from 'react-native';

import AppIntroSlider from 'react-native-app-intro-slider';
import { NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

const slides = [
  {
    key: 1,
    image: require('../assets/images/slide-1.png'),
  },
  {
    key: 2,
    image: require('../assets/images/slide-2.png'),
  },
  {
    key: 3,
    image: require('../assets/images/slide-3.png'),
  },
];

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
    /* No more header config here! */
  };
  constructor(props) {
    super(props);
    AsyncStorage.getItem("@userRoll").then((userRole) => {
      if (userRole == "trainer") {
        this.props.navigation.replace({ routeName: "TeacherDashboard"})     
      } else if (userRole == "admin") {
        this.props.navigation.replace({ routeName:"SchoolScreen"});
      } else if (userRole == "principal") {
        this.props.navigation.replace({ routeName:"PrincipalDashboard"});
      } else if (userRole == "parent") {
        this.props.navigation.replace({ routeName:"ParentsDashboard"});
      }
    }, (err) => {
      console.log("error", err);
    });
  }

  getLoginPage = () => {
    this.props.navigation.replace({ routeName: "SignupScreen"})
    // const navigateAction = NavigationActions.navigate({
    //   routeName: 'SignupScreen',
    // });
    // this.props.navigation.dispatch(navigateAction);
  };

  _getstarted = () => {
    return (
      <View style={styles.button}>
        <Text style={styles.getbutton}>Get Started</Text>
      </View>
    );
  };

  _renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: 'center',
          // justifyContent: 'space-around',
          // paddingBottom:40,
          height:'100%',
          width:'100%'
        }}>
        <Image style={styles.image} source={item.image} resizeMode="cover"/>
      </View>
    );
  };

  render() {
    return <AppIntroSlider
      renderItem={this._renderItem}
      data={slides}
      activeDotStyle={{ backgroundColor: '#3399CC',marginBottom:40 }}
      dotStyle={{ backgroundColor: 'rgba(0, 0, 0, .2)',marginBottom:40 }}
      showNextButton={false}
      showSkipButton={true}
      showDoneButton={true}
      onDone={this.getLoginPage}
      onSkip={this.getLoginPage}
      renderDoneButton={this._getstarted}
      renderSkipButton={this._getstarted}
      bottomButton
    />;
  }
}

const styles = StyleSheet.create({
  getbutton: {
    fontSize: 20,
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',
    
  },
  button: {

    height: 45,
    backgroundColor: '#CCCC33',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom: 25
  },
  image: {

    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
