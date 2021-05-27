import React, { Component } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Platform,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Dimensions,
  PermissionsAndroid,
  NativeEventEmitter,
  NativeModules,
} from "react-native";
import { ListItem, CheckBox, Body } from 'native-base';
import AsyncStorage from "@react-native-community/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { Header, Colors } from "react-native/Libraries/NewAppScreen";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import * as Progress from "react-native-progress";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import AwesomeAlert from "react-native-awesome-alerts";
import { size } from "lodash";

class VideoUploadScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.activityType = [];
    this.activities = [];
    this.state = {
      videoFileName: "",
      videoUri: null,
      activityType: [],
      activities: [],
      school: [],
      activity_id: 0,
      teacher_id: 0,
      school_id: 0,
      teacherId:'',
      isProgressBar: false,
      progressRuning: 0,
      loading: true,
      showAlert: false,
      alertMsg:'',
      alertTitle:'',
      userRoll: '',
      videoC: '',
      secondtime: false,
      selected: false
    };
  }

  async componentDidMount() {
    //get-new-activites
    await AsyncStorage.getItem("@userData").then(
      (user) => {
        console.log("==================video screen=================");
        console.log(user)
        console.log("==================video screen=====================");
        this.setState({ teacher_id: user });
      },
      (err) => {
        console.log("error", err);
      }
    );

    await AsyncStorage.getItem("@teacher_id").then(
      (teacher) =>{
        console.log(teacher);
        this.setState({ teacherId: teacher });
      }, (err) =>{
        console.log("error",err)
      })

    await AsyncStorage.getItem("@userRoll").then(
      (roll) =>{
        console.log(roll);
        this.setState({ userRoll: roll });
      }, (err) =>{
        console.log("error",err)
      });


    let that = this;
    console.log("================================ teacher id ==========================");
    console.log("teacher =====>>>",this.state.teacherId);
    await fetch(`${API_URL}/get-new-activites-types/${this.state.teacherId}/${this.state.userRoll}`)
      .then((res) => res.json())
      .then((responsed) => {
        // alert(JSON.stringify(responsed))
        if (responsed != undefined && responsed.length) {
          responsed.forEach(function (item, index) {
            let dropDownObj = {};
            dropDownObj.label = item.activity_type;
            dropDownObj.value = item.activity_type;
            that.activityType.push(dropDownObj);
          });
          that.setState({
            activityType: responsed,
            loading: false,
          });
        } else {
          alert("No activities assigned");
          const navigateAction = NavigationActions.navigate({
            routeName: "VideoScreen",
          });
          this.props.navigation.dispatch(navigateAction);
        }
      });

    // await fetch(`${API_URL}/get-trainer-schools/${this.state.teacherId}/${this.state.userRoll}`)
    //       .then((res)=>res.json())
    //       .then((responsed) => {
    //         if(responsed != undefined && responsed.length){
    //           let schoolData = []
    //           responsed.forEach(function(item, index){
    //             let dropDownObj = {};
    //             dropDownObj.label = item.school_name;
    //             dropDownObj.value = item.school_id;
    //             schoolData.push(dropDownObj);
    //           });
    //           this.setState({ school: schoolData})
    //         } else {
    //           alert("No School found");
    //           const navigateAction = NavigationActions.navigate({
    //             routeName: "VideoScreen",
    //           });
    //           this.props.navigation.dispatch(navigateAction);
    //         }
    //       });
    // console.log(" ======>>>",this.state.school)

  }

  goBack = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "VideoScreen",
    });
    this.props.navigation.dispatch(navigateAction);
  };


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

  // ================================== start recording ==============================


  // =================================== end recording ===============================

  // ================================== video compresser =============================
  
  successCall = (fileName, size, path, message) => {
    console.log("is working ===========>>>>>>",message);
  }

  errorCall = (errorMessage) => { 
    // Do your work
    console.log("is not working ===========>>>>>>", errorMessage);
  };

  videoCompress = async () => {
    console.log("---------------++++++++++++++++++++++--------------++++++++++++++-----------");
    console.log(this.state.videoUri);
    let isStoragePermitted = await this.requestExternalWritePermission();
    let v = '/storage/emulated/0/Screenshot/0A.mp4';
    // let v = this.state.videoUri;
    console.log("=========--------========", v);
    if(isStoragePermitted){
      console.log("---------------++++++++++++++++++++++22--------------++++++++++++++-----------");
      
      // const EVENT_NAME = new NativeEventEmitter(NativeModules.CompressModule);
      // this.subscription = EVENT_NAME.addListener(
      //   CompressModule.VIDEO_COMPRESS_PROGRESS_EMITTER,
      //   (value)=> console.log(value));
      // CompressModule.compressVideoWithQuality(v, 0.5, 0.5, this.errorCall, this.successCall);
      // CompressModule.compressVideo(v,CompressModule.LOW, this.errorCall, this.successCall);
      // this.subscription.remove();
    } else {
      console.log("hahhahhahhaahahhahahahahahahahhaha")
    }

  }
  
  // ================================= /video compresser/ ============================

  uploadvideo = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "VideoUploadScreen",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  selectVideoSubmit = async () => {
    const { videoFileName, videoUri, activity_id, teacher_id} = this.state;
    if (teacher_id && activity_id) {
      RNFetchBlob.fetch(
        "POST",
        `${API_URL}/upload-video/`,
        {
          "content-type": "multipart/form-data",
          Accept: "multipart/form-data",
          activity_id: activity_id,
          teacher_id: teacher_id,
          school_id: 0
        },
        [
          //the value of name depends on the key from server
          {
            name: "video",
            filename: videoFileName,
            data: RNFetchBlob.wrap(videoUri),
          },
        ]
      )
        .uploadProgress({ interval: 250 }, (written, total) => {
          console.log("uploaded", written / total);
          let progressRuning = written / total;
          this.setState({
            isProgressBar: true,
            progressRuning: progressRuning,
          });
        })
      .then((res) => res.json())
       .then((responsed) => {
         console.log(responsed);
          if(responsed.status=='existed'){
            this.setState({
              alertTitle:'Thank You',
              alertMsg:'Your video updated successfully',
              isProgressBar: false,
              progressRuning: 0, 
              showAlert:true
            });
          } else {
             this.setState({
              isProgressBar: false,
              progressRuning: 0, 
              showAlert:true,
              alertTitle:'Thank You',
              alertMsg:'Your video is uploaded successfully.',
            });
           }
        })
        .catch((err) => {
          Alert.alert("Error", JSON.stringify(err));
        });
    }
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
    this.props.navigation.navigate("VideoScreen", {
      getActivitesVideos: true,
    });
  };

  getActivites(activity_type = null) {
    let that = this;
    if (activity_type != null) {
      fetch(`${API_URL}/get-new-activites/${activity_type}/${this.state.teacherId}/${this.state.userRoll}`)
        .then((res) => res.json())
        .then((responsed) => {
          // this.setState({activities: emptyarray})
          that.activities = [];
          // alert(JSON.stringify(responsed));
          if (responsed != undefined && responsed.length) {
            console.log("respons ==========>>>>>>>>>", responsed)
            responsed.forEach(function (item, index) {
              let dropDownObj = {};
              dropDownObj.label = item.activity_name;
              dropDownObj.value = item.activity_id;
              that.activities.push(dropDownObj);
            });

            that.setState({
              activities: responsed,
              activity_id: 0
            });
            console.log("==========>>>>>>>>>>>",this.state.activities)
          }
        });
    }
  }
  selectPhotoTapped = async () => {
    let that = this;

    let options = {
      mediaType: 'video',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 240, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await this.requestCameraPermission();
    let isStoragePermitted = await this.requestExternalWritePermission();
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

          this.setState({ videoUri: response.uri, videoFileName: response.fileName});

        });
    } else {
      if(this.state.secondtime){
        openSettings();
      }else {
        alert("App need to access Loacation, Camera, and External Storage Write Permission");
      }
      this.setState({secondtime: true});
    }
    
  }
  
  
  selectVideoFromGallery = () => {
    launchImageLibrary(
     {
        mediaType: "video",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
        
      },
      async (videoResponse) => {
        console.log(videoResponse)
        if(videoResponse.fileSize > 100000000){
          Alert.alert("Over Size", "video file limit is 100MB")
        } else {
          if (videoResponse.fileName && videoResponse.uri) {
            this.setState({
              videoFileName: videoResponse.fileName,
              videoUri: videoResponse.uri,
              videoC: videoResponse
            });
          } else {
            Alert.alert("Error", "This file is not supported");
          }
        }
      }
    );
  }
  render() {
    const { videoFileName, videoUri, loading,showAlert,alertMsg,alertTitle } = this.state;
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
    return (
      <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
      <>
        <ScrollView style={styles.screenContainer}>
          <View style={{ flexDirection: "column" }}>
            <View style={styles.activities}>
              <Text>
                {" "}
                <Icon
                  name="chevron-left"
                  onPress={() => this.goBack()}
                  style={{ fontSize: 20, color: "#23ABE2", marginTop: 8 }}
                />
                {"   "}
                <Text
                  onPress={() => this.goBack()}
                  style={{
                    fontSize: 16,
                    fontColor: "#000",
                    fontWeight: "bold",
                    marginLeft: 10,
                  }}
                >
                  Upload Video
                </Text>
              </Text>
            </View>
          </View>

          <View
            style={
              loading
                ? { opacity: 0.1, backgroundColor: Colors.white }
                : { opacity: 1, backgroundColor: Colors.white }
            }
          >
            <View style={styles.sectionContainer}>
              <View style={{ marginBottom: 30 }}>
                <DropDownPicker
                  items={this.activityType}
                  defaultValue=""
                  containerStyle={{ height: 40 }}
                  style={{ paddingBottom: 10 }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  dropDownStyle={{ backgroundColor: "#fafafa" }}
                  onChangeItem={(item) => this.getActivites(item.value)}
                  placeholder="Select Activity Type"
                />
              </View>
                  
              <View style={{ marginBottom: 30 }}>
                <DropDownPicker
                  items={this.activities}
                  defaultValue=""
                  containerStyle={{ height: 40 }}
                  style={{ paddingBottom: 10 }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  dropDownStyle={{ backgroundColor: "#fafafa" }}
                  onChangeItem={(item) =>
                    this.setState({
                      activity_id: item.value,
                    })
                  }
                  placeholder="Select an activitie"
                />
              </View>

              {/* <View style={{ marginBottom: 30 }}>
                <DropDownPicker
                  items={this.state.school}
                  defaultValue=""
                  containerStyle={{ height: 40 }}
                  style={{ paddingBottom: 10 }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  dropDownStyle={{ backgroundColor: "#fafafa" }}
                  onChangeItem={(item) =>
                    this.setState({
                      school_id: item.value,
                    })
                  }
                  placeholder="Select School"
                />
              </View> */}

              <View
                style={{
                  flexDirection: "row",
                  width: window.width,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "#ddd",
                  borderWidth: 1,
                  borderRadius: 4,
                }}
              >
                <View style={{ flex: 4 }}>
                  <TextInput
                    style={{ backgroundColor: "transparent" }}
                    value={videoFileName}
                  />
                </View>
                <View style={{ backgroundColor: "#fff" }}>
                  { this.state.selected? 
                  <Button
                  title="Gallery"
                  onPress={this.selectVideoFromGallery.bind(this)}
                  />                 
                  : 
                  <Button
                  title="Record"
                  onPress={this.selectPhotoTapped.bind(this)}
                  />
                  }
                </View>
              </View>
              <View style={{marginBottom: 20}}>
              { this.state.selected?
                <Text style={{ fontSize: 10, color: "gray", alignSelf:"flex-end"}}>Video file size limit is 100MB</Text>:null
              }
              </View>
              <TouchableOpacity style={styles.checkboxContainer} 
               onPress={() => this.setState({selected: !this.state.selected, videoUri:'', videoFileName:''})}
              >
                <CheckBox
                  checked={this.state.selected}
                  onPress={() => this.setState({selected: !this.state.selected, videoUri:'', videoFileName:''})}
                  style={styles.checkbox}
                />
                  <Text style={styles.checkboxLabel}>Choose video file from gallery!</Text>
              </TouchableOpacity>

              {this.state.isProgressBar ? (
                <View style={{ marginBottom: 30 }}>
                  <Progress.Bar
                    progress={this.state.progressRuning}
                    width={windowWidth - 50}
                    height={12}
                  />
                </View>
              ) : null}
              <View>
                <TouchableOpacity>
                  <Button
                    title="Upload"
                    onPress={this.selectVideoSubmit.bind(this)}
                    disabled={!this.state.activity_id || !this.state.videoUri}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
            <AwesomeAlert
              show={showAlert}
              showProgress={false}
              title={alertTitle}
              message={alertMsg}
              closeOnTouchOutside={false}
              closeOnHardwareBackPress={false}
              showCancelButton={false}
              showConfirmButton={true}
              confirmText="Ok"
              confirmButtonColor="#F9370C"
              onConfirmPressed={() => {
                this.hideAlert();
              }}
            />
          {loading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                marginTop: "40%",
                left: "38%",
              }}
            >
              <Bubbles size={20} color="#1CAFF6" />
            </View>
          ) : null}
        </ScrollView>
      </>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: "absolute",
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
    color: Colors.dark,
  },
  highlight: {
    fontWeight: "700",
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: "600",
    padding: 4,
    paddingRight: 12,
    textAlign: "right",
  },
  activities: {
    padding: 6,
    backgroundColor: "#fff",
    margin: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: 10
  },
  checkboxLabel: {
    margin: 8,
  },
});
export default VideoUploadScreen;
