import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet,TouchableOpacity, SectionList, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { API_URL } from "../constants/config";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import DropDownPicker from 'react-native-dropdown-picker';
import { sample } from "lodash";
import {Container, Header, Content, Textarea, Form, Input, Label, Item, Button, Icon as Icons} from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';
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
      loading: false,
      emptyheader: false,
      emptymsg: false,
      emptyusertype: false,
      headline: '',
      message: '',
      userType: [
        {
          id: 'admin',
          name: 'admin'
        },
        {
          id: 'trainer',
          name: 'trainer'
        },
        {
          id: 'parents',
          name: 'parents'
        }
      ],
      principal_id: '',
      school_id: '',
      selectedUserType: [],
      parents_list:[
        {
          id: 'all',
          name: 'all'
        },
      ],
      trainer_list:[
        {
          id: 'all',
          name: 'all'
        },
      ],
      classes:[
        {
          label: 'all',
          value: 'all'
        },
        {
          label: 'class-I',
          value: '1'
        }
      ],
      section:[
        {
          label: 'all',
          value: 'all'
        },
        {
          label: '1A',
          value: '1A'
        }
      ],
      selectedTrainer: [],
      selectedClass:'',
      selectedSection:'',
      selectedParents:[]
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
    const navigateAction = NavigationActions.navigate({
      routeName: "NotificationHistory",
    });
    this.props.navigation.dispatch(navigateAction);
  };

  onSelectedItemsChange = selectedUserType => {
    this.setState({ selectedUserType });
  };

  onSelectedParents = selectedParents =>{
    this.setState({selectedParents})
  }
  onSelectedTrainer = selectedTrainer =>{
    this.setState({selectedTrainer})
  }

  checkAndSubmit = async () => {

    if(!this.state.headline){
      this.setState({ emptyheader: true});
      return
    }
    if(!this.state.message){
      this.setState({ emptymsg: true});
      return
    }
    if(!this.state.selectedUserType.length) {
      this.setState({ emptyusertype: true});
      alert("Please select user type");
      return
    }
    if(this.state.selectedUserType.indexOf("trainer") >= 0 && !this.state.selectedTrainer.length){
      alert("Please select trainer");
      return
    }
    if(this.state.selectedUserType.indexOf("parents") >= 0 && !this.state.selectedParents.length){
      alert("Please select parents");
      return
    }
    if(this.state.selectedUserType.indexOf("trainer") < 0){
      this.setState({ selectedTrainer: []});
    }
    if(this.state.selectedUserType.indexOf("parents") < 0){
      this.setState({ selectedParents: []});
    }
      this.hitApi();
  }

   hitApi = async() => {
      this.setState({loading: true})
    if(this.state.headline && this.state.message && this.state.selectedUserType.length){
			var data = {
				principal_id:this.state.principal_id,
				title:this.state.headline,
				message:this.state.message,
				school_id:this.state.school_id,
				receiver_type:this.state.selectedUserType,
        trainer_list: this.state.selectedTrainer,
        parents_list: this.state.selectedParents
			}
			await fetch(`${API_URL}/principal-send-notifications/`, {
						method: "POST",
						headers: {
            "Accept": "application/json",
						"Content-Type": "application/json"
          },
           body: JSON.stringify(data)
         })
           .then(response => response.json())
           .then(response => {
             this.setState({ headline: '', message: '', selectedUserType: []});
             alert("Notification Sent Successfully");
             this.getlistpriviuspage();        
					 });
    } else {
      alert("all fields are required")
    }
  }

  getlistpriviuspage = () => {

    fetch(`${API_URL}/get-all-notifications/${this.state.principal_id}`, {
      method: 'GET'
  }).then((res) => res.json()).then((response) => {
      this.setState({loading: false});
      const navigateAction = NavigationActions.navigate({
        routeName: "NotificationHistory",
        params: { listupdated: true, notificationData: response.reverse() }
      });
      this.props.navigation.dispatch(navigateAction);

  }).catch((err) => alert(err))
  }

  render() {
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
          <View
            style={{
            marginTop: "10%",
            width: "100%"
            }}
          >
            {/* ============================================================== */}
                <View style={styleData.announce}>
                  <Text style={styleData.announceText}>ANNOUNCE</Text>
                </View>
                <Form>
                  <Item style={styleData.headline} error={this.state.emptyheader}>
                    <Label>Heading:</Label>
                    <Input 
                      onChangeText={ headline => this.setState({ headline, emptyheader: false })}
                      autoCorrect={false}
                      keyboardType="default"
                      autoCapitalize="sentences"
                      value={this.state.headline}
                    />
                    {this.state.emptyheader?<Icons name='close-circle' />:null}
                  </Item>
                    <Textarea 
                      rowSpan={5} 
                      bordered 
                      placeholder="Announcement"
                      onChangeText={ message => this.setState({message, emptymsg:false})}
                      keyboardType="default"
                      autoCapitalize="sentences"
                      value={this.state.message}
                      style={this.state.emptymsg?{ borderColor: "red", width: "95%", alignSelf: "center"}:{width: "95%", alignSelf: "center"}}
                      />
                </Form>
              {/* ======================================================================= */}

              <View style={{ flex: 1, marginTop: 20, width: "95%", alignSelf: "center" }}>
                <MultiSelect
                  // hideTags
                  items={this.state.userType}
                  uniqueKey="id"
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onSelectedItemsChange}
                  selectedItems={this.state.selectedUserType}
                  selectText="Send to: "
                  onChangeInput={ (text)=> console.log(text)}
                  altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor="red"
                  tagBorderColor="#1CAFF6"
                  tagTextColor="#1CAFF6"
                  selectedItemTextColor="#1CAFF6"
                  selectedItemIconColor="#1CAFF6"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{ color: '#CCC' }}
                  submitButtonColor="#CCC"
                  submitButtonText="Selected"
                />
              </View>

              {
                this.state.selectedUserType.indexOf("trainer") >= 0?
                <View style={{ flex: 1, marginTop: 20, width: "95%", alignSelf: "center" }}>
                <View>
                  <Text style={styleData.customParentStyle}>Trainer</Text>
                </View>
                <MultiSelect
                  // hideTags
                  items={this.state.trainer_list}
                  uniqueKey="id"
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onSelectedTrainer}
                  selectedItems={this.state.selectedTrainer}
                  selectText="Select Trainer: "
                  onChangeInput={ (text)=> console.log(text)}
                  altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor="red"
                  tagBorderColor="#1CAFF6"
                  tagTextColor="#1CAFF6"
                  selectedItemTextColor="#1CAFF6"
                  selectedItemIconColor="#1CAFF6"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{ color: '#CCC' }}
                  submitButtonColor="#CCC"
                  submitButtonText="Selected"
                />
              </View>
                :null
              }
              {
                this.state.selectedUserType.indexOf("parents") >= 0?
                <View>
                  <View style={{ flex: 1, marginTop: 20, width: "95%", alignSelf: "center" }}>
                  <Text style={styleData.customParentStyle}>Parent</Text>
                  </View>   
                  <View style={styleData.customDropdown}>
                    <View style={styleData.customDropdownChild1}>
                    <Text style={styleData.lableStyle}>Select class:</Text>
                    </View>
                    <View style={styleData.customDropdownChild2}>
                      <DropDownPicker
                        items={this.state.classes}
                        defaultValue=""
                        containerStyle={{ height: 50 }}
                        style={{ ...styleData.customDropdownDivider, paddingBottom: 10, }}
                        itemStyle={{
                          justifyContent: "flex-start",
                        }}
                        dropDownStyle={{ backgroundColor: "#fafafa" }}
                        onChangeItem={(item) => this.setState({ selectedClass: item.value})}
                        placeholder=""
                      />
                    </View>
                  </View>

                  <View style={styleData.customDropdown}>
                    <View  style={styleData.customDropdownChild1}>
                      <Text style={styleData.lableStyle}>Select section:</Text>
                    </View>
                    <View style={styleData.customDropdownChild2}>
                    <DropDownPicker
                      items={this.state.section}
                      defaultValue=""
                      containerStyle={{ height: 50, borderRadius: 0 }}
                      style={{ ...styleData.customDropdownDivider, paddingBottom: 10, }}
                      itemStyle={{
                        justifyContent: "flex-start",
                      }}
                      dropDownStyle={{ backgroundColor: "#fafafa" }}
                      onChangeItem={(item) => this.setState({ selectedSection: item.value})}
                      placeholder=""
                    />
                    </View>
                  </View>

                  <View style={{ flex: 1, marginTop: 20, width: "95%", alignSelf: "center" }}>
                    <MultiSelect
                      // hideTags
                      items={this.state.parents_list}
                      uniqueKey="id"
                      ref={(component) => { this.multiSelect = component }}
                      onSelectedItemsChange={this.onSelectedParents}
                      selectedItems={this.state.selectedParents}
                      selectText="Select Parents: "
                      onChangeInput={ (text)=> console.log(text)}
                      altFontFamily="ProximaNova-Light"
                      tagRemoveIconColor="red"
                      tagBorderColor="#1CAFF6"
                      tagTextColor="#1CAFF6"
                      selectedItemTextColor="#1CAFF6"
                      selectedItemIconColor="#1CAFF6"
                      itemTextColor="#000"
                      displayKey="name"
                      searchInputStyle={{ color: '#CCC' }}
                      submitButtonColor="#CCC"
                      submitButtonText="Selected"
                    />
                  </View>
                </View>
                :null
              }

              {/* ======================================================================= */}
                <Button 
                style={styleData.button}
                full
                onPress={()=>{
                  this.checkAndSubmit();
                }}
              >
                <Text style={styleData.buttonText}>Send</Text>
                
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
  headerView1:{
    flex:1, 
    // flexDirection: 'row-reverse',
    marginLeft: 10
  },
  headline:{
    width: "95%",
    margin: 10
  },
  button: {
    backgroundColor: "#23ABE2",
    marginTop: 50,
    marginBottom: 50,
    width: "95%",
    alignSelf: "center"
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
  },

  customParentStyle:{
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#1CAFF6",
    marginTop: 20
  },
  customDropdown:{
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    width: "95%",
    alignSelf: "center",
    justifyContent: 'center',
  },
  customDropdownDivider:{
    borderBottomWidth: 0.8,
    borderColor: '#fff',
    borderBottomColor: '#e8e8e8',
  },
  customDropdownChild1:{
    // flex: 2
        borderBottomWidth: 0.8,
    borderColor: '#e8e8e8'
  },
  customDropdownChild2: {
    flex:9
  },
  lableStyle:{
    color: '#404040',
    paddingTop: 13
  }
});

export default SendNotification;
