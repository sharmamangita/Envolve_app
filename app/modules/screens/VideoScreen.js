import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
} from "react-native";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import Icon from "react-native-vector-icons/FontAwesome";
import { Header, Colors } from "react-native/Libraries/NewAppScreen";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
//import Videoplayer from "./VideoPlayer"; 
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
      videos:[],
      playVideoUrl:null
    };
  } 

  componentDidMount() {
    this.getActivitesVideos();
  }

  componentWillReceiveProps(newProps){
    const {params} = newProps.navigation.state;
      if(params.getActivitesVideos!=undefined && params.getActivitesVideos){
        this.videos=[];
        this.getActivitesVideos();
      }
  }
  getActivitesVideos(){
    let that = this;
    fetch(`${API_URL}/get-activites-videos/`)
      .then((res) => res.json())
      .then((responsed) => {
       // alert(JSON.stringify(responsed));
        if (responsed != undefined && responsed.length) {
            responsed.forEach(function(item){
               that.videos.push(item);
            })
            that.setState({
                videos:that.videos
            })
        }
      });
  }



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

  playVideo=(videoUrl=null)=>{
    if(videoUrl!=null){
      let playVideoUrl= `${API_URL}/upload/${videoUrl}`;
      this.props.navigation.navigate("VideoPlayer",{playVideoUrl:playVideoUrl,backTo:'VideoScreen'});
    }
  }

  render() {
    var arr = [];
    var {playVideoUrl} = this.state;
    var {endVideo} = this.props;

    if (this.videos.length) {
      this.videos.map((video) => {
        arr.push(
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
                  value={video.activity_name}
                />
              </View>
              <View style={{ flex: 0.5, backgroundColor: "#fff" }}>
                <Icon
                  onPress={() => this.playVideo(video.videoUrl)}
                  name="video-camera"
                  style={{ fontSize: 20, marginTop: 5, color: "#23ABE2" }}
                />
              </View>
            </View>
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
