import React,{Component} from 'react';
import Navigator from './modules/setup/routes';
import {Platform} from 'react-native'
import messaging from '@react-native-firebase/messaging';
import firebase from 'react-native-firebase';

export default class App extends Component{

    constructor() {
        super();
        // console.log("===================================didmount1======================");
        // const channel = firebase.notifications.Android.Channel(
        //     'channelId',
        //     'channelName',
        //     firebase.notifications.Android.Importance.Max,
        //   ).setDescription('Description');
        //   firebase.notifications().android.createChannel(channel);
        //   console.log("===================================didmount2======================");
        //   notificationListener();
        //   console.log("===================================didmount3======================");

    }

    componentDidMount() {

        const unsubscribe = messaging().onMessage( async remoteMessage => {
            console.log(remoteMessage)
        })
        console.log("=======================================checking checking ===============================");
        this.createChannel()
        this.notificationListener()
        console.log(unsubscribe)
    }

    createChannel = () => {
        const channel = new firebase.notifications.Android.Channel(
            'channelId',
            'channelName',
            firebase.notifications.Android.Importance.Max
        ).setDescription('Description');

        firebase.notifications().android.createChannel(channel);
    }

    notificationListener = () => {
        
        firebase.notifications().onNotification((notification)=>{
            if(Platform.OS === 'android'){
                const localNotification = new firebase.notifications.Notification({
                  sound: 'default',
                  show_in_foreground: true,
                })
                .setNotificationId(notification.notificationId)
                .setTitle(notification.title)
                .setSubtitle(notification.subtitle)
                .setBody(notification.body)
                // .setBody(notification.data)
                .android.setChannelId('channelId')
                .android.setPriority(firebase.notifications.Android.Priority.High);
        
                firebase.notifications().displayNotification(localNotification)
                .catch((err) => {
                  console.log("================================== checking for ground data =====================");
                  console.log(err);
                  console.log("================================== checking for ground data =====================");
                })
        
            }
        })
    }


    render(){
        return(
            <Navigator/>
        )
    }
}