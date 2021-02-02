import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet,TouchableOpacity, SectionList, Image, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { API_URL } from "../constants/config";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import DropDownPicker from 'react-native-dropdown-picker';
import { sample } from "lodash";
import {
    Content,
    Textarea,
    Form,
    Input,
    Label, 
    Item,
    Button,
    Icon as Icons,
    SwipeRow,
    Card,
    CardItem,
    Left,
    Body,
    Right,
    List,
    ListItem
} from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-community/async-storage';

// import {  } from '';
import { auth } from "react-native-firebase";

class NotificationHistory extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      emptyheader: false,
      emptymsg: false,
      emptyusertype: false,
      headline: '',
      message: '',
      userType: [
        {
          id: 'trainer',
          name: 'trainer'
        },
        {
          id: 'admin',
          name: 'admin'
        },
        {
          id: 'parents',
          name: 'parents'
        }
      ],
      principal_id: '',
      school_id: '',
      selectedUserType: [],
    };
    
  }

  async  componentDidMount() {
    await AsyncStorage.getItem("@userData").then(
      (user) =>{
        console.log(user)
        this.setState({ principal_id: user });
      }, (err) =>{
        console.log("error",err)
      })
    await AsyncStorage.getItem("@schoolId").then(
      (school) =>{
        console.log(school)
        this.setState({ school_id: school });
      }, (err) =>{
        console.log("error",err)
      })
  }

  goBack = () => {
    this.props.navigation.goBack(null)
    // const navigateAction = NavigationActions.navigate({
    //   routeName: "StudentListingActivitiesScreen",
    // });
    // this.props.navigation.dispatch(navigateAction);
  };

  showlist = () => {
    return(
        <ListItem style={{ borderBottomWidth: 0}}>
            <Body>
                <Card style={{flex: 0}}>
                    <CardItem>
                        <Left>
                            <Body>
                                <Text style={ styleData.infoHeader }>NativeBase</Text>
                                <Text style={ styleData.infoDate } note>April 15, 2016</Text>
                            </Body>
                        </Left>
                        <Right>
                            <TouchableOpacity onPress={() => alert("Are You sure want to delete ")}>
                            <Icons name="trash" style={{ size: 18, color: "red"}} />
                            </TouchableOpacity>
                        </Right>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>
                            Begins with the Card List component, which is similar to our List Avatar.
                            Make use of Left, Body and Right components to align the content of your Card header.
                            To mixup Image with other NativeBase components in a single CardItem, include the content within Body component.
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            </Body>
        </ListItem>   
    )
  }


  render() {
      let w = Dimensions.get('window').width;
    return (
      <ScrollView style={styleData.screenContainer}>
        <View style={styleData.container}>
            <TouchableOpacity onPress={() =>  this.goBack()}>
                <Icon
                    name="arrow-left"
                    onPress={() => this.goBack()}
                    style={{ fontSize: 18,padding:5, color:"#1CAFF6"}}
            />
            </TouchableOpacity>
            <TouchableOpacity style={styleData.headerView1} onPress={() =>  this.goBack()}>
				<Text style={{fontSize: 18, fontWeight: "bold", color:"#1CAFF6"}}>Notifications</Text>
            </TouchableOpacity>
            <View style={styleData.headerView}>
				<TouchableOpacity>
					<Image source={require('../assets/images/sm-logo.png')} />
				</TouchableOpacity>
            </View>
        </View>

        <View>
          {!this.state.loading ? (
            
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >

            <Content scrollEnabled={false} style={{width:w}}>
                <SwipeRow
                    rightOpenValue={-75}
                    body={
                    <View style={styleData.sendnote}>
                        <Text>Swipe Right for Send Notification</Text>
                    </View>
                    }
                    right={
                    <Button success onPress={() => this.props.navigation.navigate("SendNotification")}>
                        <Icons active name="paper-plane" />
                    </Button>
                    
                    }
                />
            </Content>
                <Content  style={{width:w}}>
                <List>
                    {this.showlist()}
                    {this.showlist()}
                </List>
                </Content>
            </View>
          ) : 
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
          }
        </View>
      </ScrollView>
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
    paddingLeft: 10,
    marginTop: 15,
    height:40,
    borderBottomWidth:2,
    borderColor:'#ddd',
  },
  headerView1:{
    flex:1, 
    // flexDirection: 'row-reverse',
    marginLeft: 10
  },
  sendnote: {
    flex: 1,
    flexDirection: 'row-reverse'
  },
  headerView:{
    flex:1, 
    flexDirection: 'row-reverse',
    marginLeft: 10
  },
  infoHeader: {
    fontWeight: "bold",
    fontSize: 18
  },
  infoDate: {
    color: "gray",
  }
});

export default NotificationHistory;
