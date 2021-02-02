import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet,TouchableOpacity, SectionList, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { API_URL } from "../constants/config";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import DropDownPicker from 'react-native-dropdown-picker';
import { sample } from "lodash";
import {Container, Header, Content, Textarea, Form, Input, Label, Item, Button} from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-community/async-storage';

// import {  } from '';
import { auth } from "react-native-firebase";

class SendNotification extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);

    this.state = {
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
          id: 'Parents',
          name: 'Parents'
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

  onSelectedItemsChange = selectedUserType => {
    this.setState({ selectedUserType });
  };

  hitApi = () => {
    if(this.state.headline && this.state.message && this.state.selectedUserType.length){
      console.log(this.state.headline);
      console.log(this.state.message);
      console.log(this.state.principal_id);
      console.log(this.state.school_id);
      console.log(this.state.selectedUserType);
    } else {
      console.log("all fields are required")
    }
  }

  render() {
    return (
      <ScrollView style={styleData.screenContainer}>
        <View style={styleData.container}>
        <TouchableOpacity onPress={() =>  this.goBack()}>
          <Icon
            name="arrow-left"
            onPress={() => this.goBack()}
            style={{ fontSize: 18,padding:5}}
          />
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
          <View
            style={{
            marginTop: "10%"
            }}
          >
            {/* ============================================================== */}
                <View style={styleData.announce}>
                  <Text style={styleData.announceText}>ANNOUNCE</Text>
                </View>
                <Form>
                  <Item style={styleData.headline}>
                    <Label>Heading:</Label>
                    <Input 
                      onChangeText={ headline => this.setState({ headline })}
                      autoCorrect={false}
                      keyboardType="default"
                      autoCapitalize="sentences"
                      value={this.state.headline}
                    />
                  </Item>
                    <Textarea 
                      rowSpan={5} 
                      bordered 
                      placeholder="Announcement"
                      onChangeText={ message => this.setState({message})}
                      keyboardType="default"
                      autoCapitalize="sentences"
                      value={this.state.message}
                      />
                </Form>
              {/* ======================================================================= */}

              <View style={{ flex: 1, marginTop: 20 }}>
                      <MultiSelect
                        hideTags
                        items={this.state.userType}
                        uniqueKey="id"
                        ref={(component) => { this.multiSelect = component }}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectedItems={this.state.selectedUserType}
                        selectText="User Role"
                        searchInputPlaceholderText="Search Items..."
                        onChangeInput={ (text)=> console.log(text)}
                        altFontFamily="ProximaNova-Light"
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{ color: '#CCC' }}
                        submitButtonColor="#CCC"
                        submitButtonText="Selected"
                      />
                    </View>

              {/* ======================================================================= */}
                <Button 
                style={styleData.button}
                full
                onPress={()=>{
                  this.hitApi();
                }}
              >
                <Text style={styleData.buttonText}> Send</Text>
              </Button>

            {/* ============================================================== */}
          </View>

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
  headerView:{
    flex:1, 
    flexDirection: 'row-reverse',
    marginLeft: 10
  },
  headline:{
    width: 300,
    margin: 10
  },
  button: {
    backgroundColor: "#23ABE2",
    marginTop: 40
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  announce: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  announceText: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1CAFF6"
  }
});

export default SendNotification;
