import React, { Component } from "react";

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from "react-native";

import Video from "react-native-video";
import MediaControls, { PLAYER_STATES } from "react-native-media-controls";
import { NavigationActions } from "react-navigation";
class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
      isFullScreen: true,
      isLoading: true,
      paused: false,
      playerState: PLAYER_STATES.PLAYING,
      screenType: "cover",
    };
    this.videoPlayer = React.createRef();
  }

  onSeek = (seek) => {
    //Handler for change in seekbar
    this.VideoPlayer.seek(seek);
  };

  onPaused = (playerState) => {
    //Handler for Video Pause
    this.setState({
      paused: !this.state.paused,
      playerState,
    });
  };

  onReplay = () => {
    //Handler for Replay
    this.videoPlayer?.current.seek(0);
    this.setState({ currentTime: 0 });
    if (Platform.OS === "android") {
      setPlayerState(PLAYER_STATES.PAUSED);
      setPaused(true);
      this.setState({ playerState: PLAYER_STATES.PAUSED, Paused: true });
    } else {
      this.setState({ playerState: PLAYER_STATES.PLAYING, Paused: false });
    }
  };

  onProgress = (data) => {
    const { isLoading, playerState } = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({ currentTime: data.currentTime });
    }
  };

  onLoad = (data) =>
    this.setState({ duration: data.duration, isLoading: false });

  onLoadStart = (data) => this.setState({ isLoading: true });

  onEnd = () => {
    this.setState({ playerState: PLAYER_STATES.ENDED });
    const { params } = this.props.navigation.state;
    let backTo=null;
    if (params.backTo != undefined && params.backTo) {
      backTo = params.backTo;
    }
    this.props.navigation.navigate(backTo);
  };

  onError = () => alert("Oh! ", error);

  exitFullScreen = () => {
    alert("Exit full screen");
  };

  enterFullScreen = () => {};

  onFullScreen = () => {
    if (this.state.screenType == "content")
      this.setState({ screenType: "cover" });
    else this.setState({ screenType: "content" });
  };
  renderToolbar = () => (
    <View>
      <Text> toolbar </Text>
    </View>
  );
  onSeeking = (currentTime) => this.setState({ currentTime });
  render() {
    let playVideoUrl = "";
    const { params } = this.props.navigation.state;
    if (params.playVideoUrl != undefined && params.playVideoUrl) {
      playVideoUrl = params.playVideoUrl;
    }
    return (
      <View>
        <Video
          onEnd={this.onEnd}
          onLoad={this.onLoad}
          onLoadStart={this.onLoadStart}
          onProgress={this.onProgress}
          paused={this.state.paused}
          ref={(videoPlayer) => (this.videoPlayer = videoPlayer)}
          resizeMode={this.state.screenType}
          onFullScreen={this.state.isFullScreen}
          source={{ uri: playVideoUrl }}
          volume={10}
          style={styles.backgroundVideo}
        />
        <MediaControls
          duration={this.state.duration}
          isLoading={this.state.isLoading}
          mainColor="#333"
          onFullScreen={this.onFullScreen}
          onPaused={this.onPaused}
          onReplay={this.onReplay}
          onSeek={this.onSeek}
          onSeeking={this.onSeeking}
          playerState={this.state.playerState}
          progress={this.state.currentTime}
          toolbar={this.renderToolbar()}
        />
        <View style={styles.logo} >
          <Image source={require('../assets/images/Envolve-logo_25.png')} />
        </View>
      </View>
    );
  }
}
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  backgroundVideo: {
    height: windowHeight,
    width: "100%",
  },
  mediaControls: {
    height: "100%",
    flex: 1,
    alignSelf: "center",
  },
  logo:{
    position: 'absolute',
    top:0,
    flex: 1,
    justifyContent: 'flex-start',
    right:0
  }
});
export default VideoPlayer;
