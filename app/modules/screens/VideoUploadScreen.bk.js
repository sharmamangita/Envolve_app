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
} from "react-native";
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
      userRoll: ''
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

    await fetch(`${API_URL}/get-trainer-schools/${this.state.teacherId}/${this.state.userRoll}`)
          .then((res)=>res.json())
          .then((responsed) => {
            if(responsed != undefined && responsed.length){
              let schoolData = []
              responsed.forEach(function(item, index){
                let dropDownObj = {};
                dropDownObj.label = item.school_name;
                dropDownObj.value = item.school_id;
                schoolData.push(dropDownObj);
              });
              this.setState({ school: schoolData})
            } else {
              alert("No School found");
              const navigateAction = NavigationActions.navigate({
                routeName: "VideoScreen",
              });
              this.props.navigation.dispatch(navigateAction);
            }
          });
          console.log(" ======>>>",this.state.school)

  }

  goBack = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "VideoScreen",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  uploadvideo = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "VideoUploadScreen",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  selectVideoSubmit = () => {
    const { videoFileName, videoUri, activity_id, teacher_id, school_id } = this.state;
    if (teacher_id && activity_id && school_id) {
      RNFetchBlob.fetch(
        "POST",
        `${API_URL}/upload-video/`,
        {
          "content-type": "multipart/form-data",
          Accept: "multipart/form-data",
          activity_id: activity_id,
          teacher_id: teacher_id,
          school_id: school_id
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
				 console.log('response>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',responsed);
          if(responsed.status=='existed'){
            this.setState({
              alertTitle:'Sorry',
              alertMsg:'This video already exits for this Activity.',
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
  selectPhotoTapped() {
    let that = this;
    launchImageLibrary(
      {
        mediaType: "video",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      async (videoResponse) => {
        if (videoResponse.fileName && videoResponse.uri) {
          that.setState({
            videoFileName: videoResponse.fileName,
            videoUri: videoResponse.uri,
          });
        } else {
          Alert.alert("Error", "This file is not supported");
        }
      }
    );
  }
  render() {
    const { videoFileName, videoUri, loading,showAlert,alertMsg,alertTitle } = this.state;
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
    return (
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
                  placeholder="Select an activities"
                />
              </View>

              <View style={{ marginBottom: 30 }}>
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
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 30,
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
                <View style={{ flex: 1.5, backgroundColor: "#fff" }}>
                  <Button
                    title="Browise"
                    onPress={this.selectPhotoTapped.bind(this)}
                  />
                </View>
              </View>
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
});
export default VideoUploadScreen;
