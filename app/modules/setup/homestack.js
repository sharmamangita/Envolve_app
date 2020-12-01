import React from 'react';
import { createStackNavigator } from "react-navigation-stack";
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
import videoPlayer from '../screens/videoPlayer';
import CarouselScreen from '../screens/CarouselScreen';
import Header from '../shared/header';

const HomeStack = createStackNavigator({
    Start: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <></>,
                header: null,
                headerLeft: null
            }
        }
    },
    SignupScreen: {
        screen: SignupScreen,
        navigationOptions: ({ navigation }: any) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null
            }
        }
    },
    LoginScreen: {
        screen: LoginScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null
            }
        }
    },
    SchoolScreen: {
        screen: SchoolScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null
            }
        }
    },
    ActivitiesScreen: {
        screen: ActivitiesScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <></>,
                header: null,
                headerLeft: null
            }
        }
    },
    TrainerAttendance: {
        screen: TrainerAttendance,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <></>,
                header: null,
                headerLeft: null
            }
        }
    },
    Student: {
        screen: Student,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <></>,
                header: null,
                headerLeft: null
            }
        }
    },
    Parents: {
        screen: Parents,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null
            }
        }
    },
    StudentProfile: {
        screen: StudentProfile,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <></>,
                header: null,
                headerLeft: null
            }
        }
    },

    StudentAttendance: {
        screen: StudentAttendance,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <></>,
                header: null,
                headerLeft: null
            }
        }
    },

    videoPlayer: {
        screen: videoPlayer,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <></>,
                header: null,
                headerLeft: null
            }
        }
    },

    CarouselScreen: {
        screen: CarouselScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null
            }
        }
    },

}, { initialRouteName: "Start" });
export default HomeStack;