import React from 'react';
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import SchoolScreen from '../screens/SchoolScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import VideoUploadScreen from '../screens/VideoUploadScreen';
import VideoScreen from '../screens/VideoScreen';
import TrainerAttendance from '../screens/TrainerAttendance';
import Student from '../screens/Student';
import Parents from '../screens/Parents';
import StudentProfile from '../screens/StudentProfile';
import StudentAttendance from '../screens/StudentAttendance';
import ActivitiesStatsScreen from '../screens/ActivitiesStatsScreen';
import ActivitiesClassesScreen from '../screens/ActivitiesClassesScreen';
import StudentListingActivitiesScreen from '../screens/StudentListingActivitiesScreen';
import VideoPlayer from '../screens/VideoPlayer';
import CarouselScreen from '../screens/CarouselScreen';
import Header from '../shared/header';
import TrainerAttendanceChart from '../screens/TrainerAttendanceChart';
import SendNotification from '../screens/SendNotification';
import NotificationHistory from '../screens/NotificationHistory';

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
    VideoUploadScreen: {
        screen: VideoUploadScreen, 
        navigationOptions: ({ navigation }: any) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null
            }
        }
    },
    VideoScreen: {
        screen: VideoScreen, 
        navigationOptions: ({ navigation }: any) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null
            }
        }
    },
    VideoPlayer: {
        screen: VideoPlayer,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null,
                header: null
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
    ActivitiesStatsScreen:{
        screen: ActivitiesStatsScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null
            }
        }
    },
    ActivitiesClassesScreen:{
        screen: ActivitiesClassesScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null,
                header: null,
            }
        }
    },
    StudentListingActivitiesScreen:{
        screen: StudentListingActivitiesScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null,
                header: null,
            }
        }   
    },
    TrainerAttendanceChart:{
        screen: TrainerAttendanceChart,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null,
                header: null,
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

    CarouselScreen: {
        screen: CarouselScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null
            }
        }
    },

    SendNotification: {
        screen: SendNotification,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null,
                header: null,
            }
        }
    },

    NotificationHistory: {
        screen: NotificationHistory,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} />,
                headerLeft: null,
                header: null,
            }
        }
    }

}, { initialRouteName: "Start" });
export default HomeStack;