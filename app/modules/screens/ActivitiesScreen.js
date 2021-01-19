import React, { Component } from 'react';
import { ScrollView, Image, TouchableOpacity, View, Text, Alert, StyleSheet, Button, Platform, PermissionsAndroid } from 'react-native';
import { ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import { API_URL } from '../constants/config';
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import GetLocation from 'react-native-get-location'

import {
    launchCamera,
    launchImageLibrary
  } from 'react-native-image-picker';

class ActivitiesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            // title: `Activities`,
            // headerLeft: <HeaderBackButton onPress={() => navigation.pop(1)} />,
            //headerLeft: <Attendance navigation={navigation} activities={navigation.state.activities} />,
            headerStyle: { height: 80 }
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            value1: '',
            gotImage: 0,
            schoolData: [],
            navparams: [],
            loading: false,
            filePath: '',
            location: '',
            trainerAttendance: false
        }
    }

    getStudents = (school, teacher, item) => {
        var activititid = JSON.stringify(item.activity_id);
        var activitity_id = activititid.replace(/^"|"$/g, '');
        let url = `${API_URL}/get-students/${school}/${teacher}/${activitity_id}`;
        this.setState({loading:true});
        fetch(`${API_URL}/get-students/${school}/${teacher}/${activitity_id}`, {
            method: 'GET'
        }).then((res) => res.json()).then((response) => {
            this.setState({ value1: response,loading:false })
            const navigateAction = NavigationActions.navigate({
                routeName: 'Student',
                params: {
                    students: this.state.value1,
                    schoolData: this.state.schoolData,
                    activityData: item,
                    gotImage: this.state.gotImage,
                    imagePath: this.state.filePath,
                    location: this.state.location
                }
            });
            this.props.navigation.dispatch(navigateAction);
        }).catch((err) => alert(err))
    }

    componentWillMount() {
        const { state, navigate } = this.props.navigation;
        this.setState({ schoolData: state.params.schoolData });
    }

    goBack = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'SchoolScreen',
        });
        this.props.navigation.dispatch(navigateAction);
    }

    // ==============================================================================

    requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: 'Camera Permission',
                message: 'App needs camera permission',
              },
            );
            // If CAMERA Permission is granted
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } catch (err) {
            console.warn(err);
            return false;
          }
        } else return true;
      };

    requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'External Storage Write Permission',
                message: 'App needs write permission',
              },
            );
            // If WRITE_EXTERNAL_STORAGE Permission is granted
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } catch (err) {
            console.warn(err);
            alert('Write permission err', err);
          }
          return false;
        } else return true;
      };
    requestGeoLocation = async () => {
      try{
        await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
        .then(location => {
          this.setState({location});
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
        })
      } catch(err){
        console.warn(err);
        alert('Write permission err', err);
      }
    };

    captureImage = async (type) => {
        let options = {
          mediaType: type,
          maxWidth: 300,
          maxHeight: 550,
          quality: 1,
          videoQuality: 'low',
          durationLimit: 30, //Video max duration in seconds
          saveToPhotos: true,
        };
        let isCameraPermitted = await this.requestCameraPermission();
        let isStoragePermitted = await this.requestExternalWritePermission();
        let isgeoLocation = await this.requestGeoLocation();
        if (isCameraPermitted && isStoragePermitted) {
          launchCamera(options, (response) => {
            console.log('Response = ', response);
    
            if (response.didCancel) {
              alert('User cancelled camera picker');
              return;
            } else if (response.errorCode == 'camera_unavailable') {
              alert('Camera not available on device');
              return;
            } else if (response.errorCode == 'permission') {
              alert('Permission not satisfied');
              return;
            } else if (response.errorCode == 'others') {
              alert(response.errorMessage);
              return;
            }
            // console.log('base64 -> ', response.base64);
            // console.log('uri -> ', response.uri);
            // console.log('width -> ', response.width);
            // console.log('height -> ', response.height);
            // console.log('fileSize -> ', response.fileSize);
            // console.log('type -> ', response.type);
            // console.log('fileName -> ', response.fileName);
            this.setState({ filePath: response});
            console.log("==================");
            console.log(this.state.filePath);
            console.log(this.state.location);
            console.log("==================");
            this.sendTrainerAttendance();
          });
        }
      };

      createFormData = (photo, body) => {
        const data = new FormData();
      
        data.append("photo", {
          name: photo.fileName,
          type: photo.type,
          uri:
            Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        });
      
        Object.keys(body).forEach(key => {
          data.append(key, body[key]);
        });

        data.append("school_id", this.props.navigation.state.params.schoolData.school_id)
        data.append("teacher_id", this.props.navigation.state.params.navparams.rolval.teacher_id)
      
        return data;
      };

      sendTrainerAttendance = async () =>{
        console.log("===========================================================");
        console.log(this.createFormData(this.state.filePath, this.state.location));
        console.log("===========================================================");
         await fetch(`${API_URL}/mark-trainer-attendance/`, {
						method: "POST",
						headers: {
            'Content-Type': 'multipart/form-data',
          },
           body: this.createFormData(this.state.filePath, this.state.location)
         })
           .then(response => response.json())
           .then(response => {
             console.log("Attendance has Sumited", response);
             alert("Attendance has Sumited");
             this.setState({ photo: null });
           })
           .catch(error => {
             console.log("Attendance submition error", error);
             alert("Upload failed!");
           });
      }


    // ==============================================================================

    render() {
        const { state, navigate } = this.props.navigation;
        var arr = [];
        if (state.params.activities != '') {
            var teacher_id = JSON.stringify(state.params.navparams.rolval.teacher_id);
            var school = state.params.schoolData.school_id;
            var teacher = teacher_id.replace(/^"|"$/g, '');
          //  var school = school_id.replace(/^"|"$/g, '');
            state.params.activities.map((item) => {
                arr.push(
                    <ListItem onPress={() => this.getStudents(school, teacher, item)}
                        component={TouchableScale}
                        style={{ borderTop: 0 }}
                        title={<Text style={{ paddingLeft: 10, color: '#23ABE2', fontSize: 20 }}>{item.activity_name ? item.activity_name : 'not found'}</Text>}
                        rightIcon={<Icon name="users" style={{ fontSize: 20, color: "#23ABE2", paddingRight: 20, }} />}
                        subtitle={
                            <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 5 }}>
                            </View>
                        }
                    />
                )
            })
        } else {
            arr.push(
                <ListItem
                    component={TouchableScale}
                    title={<Text style={{ paddingLeft: 10, color: '#23ABE2', fontSize: 20 }}>No Activity Found</Text>}
                    rightIcon={<Icon name="users" style={{ fontSize: 20, color: "#23ABE2" }} />}

                />
            )
        }

        return (
            <ScrollView style={styleData.screenContainer}>
            <View style={this.state.loading?{opacity:0.1}:{opacity:1}}>
                <View style={styleData.container}>
                    <Icon name="chevron-left" onPress={() => this.goBack()} style={{ fontSize: 22, color: '#23ABE2', marginTop: 8 }} />
                    <Text onPress={() => this.goBack()} style={{ fontSize: 25, fontColor: "#000", fontWeight: 'bold', marginLeft: 10 }}>Activities</Text>
                    {/* ============================================================== */}    
                    <Icon name="camera" onPress={() => this.captureImage('photo')} style={{ fontSize: 22, color: '#23ABE2', marginTop: 8, marginRight: 8, position: 'absolute', right: 0 }} />
                    {/* =============================================================== */}
                </View>
                <View style={styleData.activityText}>
                    <Text style={{ fontSize: 22, fontWeight: "bold", fontColor: "#4B4B4C", borderRadius: 10, }}> {state.params.schoolData.school_name}
                        <Text style={{ fontSize: 18, fontColor: "#4B4B4C", }}>-{state.params.schoolData.school_address}</Text>
                    </Text>
                </View>

                <View>
                    {arr}
                </View>
                
                </View>
                 {this.state.loading ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        position:'absolute',
                        marginTop:'40%',
                        left:'35%',
                        zIndex:999
                      }}
                    >
                      <Bubbles size={20} color="#1CAFF6" />
                    </View>
                  ) : null} 

            </ScrollView>
        )
    }
}

const styleData = StyleSheet.create({
    screenContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginLeft: 10,
        marginTop: 15
    },
    activityText: {
        backgroundColor: '#F7F7F7',
        marginTop: 50,
        marginBottom: 10,
        marginRight: 15,
        marginLeft: 15,
        padding: 6,
    },
    listData: {
        marginTop: 0,
        padding: 0
    },
    activityHeader: {
        marginTop: 10
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
        borderStyle: 'solid',
        borderColor: "#B0C043",
    }
})


export default ActivitiesScreen;
