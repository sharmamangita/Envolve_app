import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  Alert,
} from "react-native";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import Icon from "react-native-vector-icons/FontAwesome";
import { Header, Colors } from "react-native/Libraries/NewAppScreen";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import AwesomeAlert from "react-native-awesome-alerts";

class VideoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.videos = [];
    this.state = {
      videos: [],
      playVideoUrl: null,
      loading: false,
      showAlert: false,
      video_id: 0,
    };
  }

  componentDidMount() {
    this.getActivitesVideos();
  }

  componentWillReceiveProps(newProps) {
    const { params } = newProps.navigation.state;
    if (params.getActivitesVideos != undefined && params.getActivitesVideos) {
      this.videos = [];
      this.getActivitesVideos();
    }
  }
  getActivitesVideos() {
    let that = this;
    that.videos = [];
    that.setState({
      videos: that.videos,
      loading: true,
    });
    fetch(`${API_URL}/get-activites-videos/`)
      .then((res) => res.json())
      .then((responsed) => {
        if (responsed != undefined && responsed.length) {
          responsed.forEach(function (item) {
            that.videos.push(item);
          });
          that.setState({
            videos: that.videos,
            loading: false,
          });
        } else {
          that.setState({
            loading: false,
          });
        }
      });
  }

  showAlert = (videoId) => {
    this.setState({
      showAlert: true,
      video_id: videoId,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  goBack = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "SchoolScreen",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  uploadvideo = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "VideoUploadScreen",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  playVideo = (videoUrl = null) => {
    if (videoUrl != null) {
      let playVideoUrl = `${API_URL}/upload/${videoUrl}`;
      this.props.navigation.navigate("VideoPlayer", {
        playVideoUrl: playVideoUrl,
        backTo: "VideoScreen",
      });
    }
  };

  deleteVideo = () => {
    let that = this;
    const { video_id } = this.state;
    fetch(`${API_URL}/delete-video/${video_id}`, {
      method: "DELETE",
    }).then((res) => {
      that.getActivitesVideos();
    });
    that.hideAlert();
  };

  render() {
    var arr = [];
    var { playVideoUrl, loading, showAlert } = this.state;
    var { endVideo } = this.props;
    var that = this;
    if (this.videos.length) {
      this.videos.map((video) => {
        arr.push(
          <ListItem
            containerStyle={{
              marginBottom: 15,
              borderRadius: 5,
              borderWidth: 1,
            }}
            component={TouchableScale}
            title={
              <Text style={{ paddingLeft: 5, fontSize: 14 }}>
                {video.activity_name}
              </Text>
            }
            rightIcon={
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => that.playVideo(video.videoUrl)}
                >
                  <Icon
                    onPress={() => this.playVideo(video.videoUrl)}
                    name="video-camera"
                    style={{ fontSize: 22, color: "#23ABE2" }}
                  />
                </TouchableOpacity>
                {video.studentUsingActivity == null ? (
                  <TouchableOpacity
                    onPress={() => that.playVideo(video.videoUrl)}
                  >
                    <Icon
                      onPress={() => this.showAlert(video.video_id)}
                      name="trash"
                      style={{
                        fontSize: 22,
                        color: "#F93B11",
                        paddingLeft: 15,
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            }
          />
        );
      });
    }

    return (
      <View>
        <ScrollView style={styleData.screenContainer}>
          <View style={{ flexDirection: "column" }}>
            <View style={styleData.activities}>
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
                    fontSize: 14,
                    fontColor: "#000",
                    fontWeight: "bold",
                    marginLeft: 10,
                  }}
                >
                  Upload Videos For Activities
                </Text>
              </Text>
              <Icon
                onPress={() => this.uploadvideo()}
                name="plus-circle"
                style={{ fontSize: 28, marginTop: 5, color: "#23ABE2" }}
              />
            </View>
          </View>
          <View style={styleData.body}>
            <View style={styleData.sectionContainer}>
              {loading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "40%",
                  }}
                >
                  <Bubbles size={20} color="#1CAFF6" />
                </View>
              ) : null}

              <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Confirm to delete"
                message="Are you sure to delete this video "
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText="Yes, delete it"
                confirmButtonColor="#F9370C"
                cancelButtonColor="#24C50D"
                onCancelPressed={() => {
                  this.hideAlert();
                }}
                onConfirmPressed={() => {
                  this.deleteVideo();
                }}
              />

              <View>{arr}</View>
            </View>
          </View>
        </ScrollView>
      </View>
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
  body: {
    backgroundColor: Colors.white,
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
  activities: {
    flex: 5,
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default VideoScreen;
