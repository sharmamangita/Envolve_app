import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet,TouchableOpacity, SectionList, Image, Dimensions, FlatList} from "react-native";
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
    Toast,
    
} from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-community/async-storage';

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
      notificationData: [],
      principal_id: '',
      school_id: '',
      listChange: false
    };
    
  }

  async  componentDidMount() {
    this.setState({loading: true});
    await AsyncStorage.getItem("@userData").then(
      (user) =>{
        console.log(user)
        this.setState({ principal_id: user });
      }, (err) =>{
        console.log("error",err)
      });
    await AsyncStorage.getItem("@schoolId").then(
      (school) =>{
        console.log(school)
        this.setState({ school_id: school });
      }, (err) =>{
        console.log("error",err)
      });
    
    await fetch(`${API_URL}/get-all-notifications/${this.state.principal_id}`, {
        method: 'GET'
    }).then((res) => res.json()).then((response) => {
        this.setState({notificationData: response.reverse()});
        this.setState({loading: false});
    }).catch((err) => alert(err))
  }

  componentDidUpdate(){

    if(this.props.navigation.state.params.listupdated){
      this.props.navigation.state.params.listupdated = false;
        this.setState({notificationData: this.props.navigation.state.params.notificationData, listChange: false});
    }
  }

  goBack = () => {
    this.props.navigation.goBack(null)
    // const navigateAction = NavigationActions.navigate({
    //   routeName: "StudentListingActivitiesScreen",
    // });
    // this.props.navigation.dispatch(navigateAction);
  };

  showlist = (value) => {
    console.log(value.receiver_role)
    return(
        <Card style={{flex: 0, width: "95%", alignSelf:"center"}}>
          <CardItem>
            <Left>
              <Body>
                <Text style={ styleData.infoHeader }>{value.title}</Text>
                <Text style={ styleData.infoDate } note>{value.date.slice(8, 10)}{value.date.slice(4, 8)}{value.date.slice(0, 4)}</Text>
              </Body>
            </Left>
            <Right>
              <TouchableOpacity onPress={() => this.deleteOldNotification(value)}>
                <Icons name="trash" style={{ size: 18, color: "red"}} />
              </TouchableOpacity>
            </Right>
          </CardItem>
          <CardItem>
            <Body>
              <Text style={{ paddingStart: 10}}>
                {value.message}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Body>
                <Text style={ styleData.infoDate1} note>Sent to: {JSON.parse(value.receiver_role).toString().replace(/,/gi, ', ')}</Text>
              </Body>
            </Left>
          </CardItem>
        </Card>
    )
  }

  deleteOldNotification = async(value) => {
    /*let n = []
    
    n.push(value.id);
    let data = { "ids": n}*/
    console.log("deleting array list here",value.id)
    let filteredData = this.state.notificationData.filter(item => item.id !== value.id);
    this.setState({ notificationData: filteredData });
    await fetch(`${API_URL}/remove-messages/${value.id}`, {
      method: 'GET',
     }).then(response => response.json())
   .then(response => {
     console.log("deleted response is here ====>>>", response);
     if(response.status == "success"){
      
      alert(`"${value.title}" notification has been deleted`);
     } else {
      alert(`"${value.title}" deletion error`);
     }
    });
    }

  render() {
    // console.log(this.props.navigation.state.params.listupdated);

    this.set
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

                <SwipeRow
                    style={{width: "100%"}}
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
              <FlatList
                data={this.state.notificationData}
                keyExtractor={ (item, index) => item.id }
                renderItem={({item}) => this.showlist(item)}
                style={{width: "100%"}}
              />

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
  },
  infoDate1: {
    color: '#87838B'
  }
});

export default NotificationHistory;
