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

class HomeWorkAndComplaint extends Component {
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
      teacher_id: '',
      school_id: '',
      selectedUserType: [],
      parents_list:[],
      trainer_list:[],
      classes:[],
      section:[],
      selectedTrainer: [],
      selectedClass:'',
      selectedSection:'',
      selectedParents:[],
      final_list: [],
      messageType: [
        { "label": "Home Work", "value": 'homework' },
        { "label": "Complaint", "value": 'complaint' }
      ],
      selectedType: ''
    };
      
  }

  async  componentDidMount() {
    // console.log("==================>",this.props.navigation.state.params.school_Id)
    //     console.log("================>",this.props.navigation.state.params.teacher_id)
    await this.setState({ teacher_id: this.props.navigation.state.params.teacher_id });
    await this.setState({ school_id: this.props.navigation.state.params.school_Id });
    
      await fetch(`${API_URL}/get-teacher-classes/${this.state.school_id}/${this.state.teacher_id}`, {
        method: "GET",
        })
       .then(response => response.json())
       .then(response => {
         let b =[{label: 'all', value: 'all' }];
         console.log("==== Class list ====>>",response)
        if(response.length){
          response.map((data) => b.push({ "label": data.class, "value": data.class }));
          this.setState({ classes: b });
        } else {
          this.setState({ classes: [], section: [], parents_list: []})
        }        
      }).catch((err) => alert(err))

  }

  goBack = () => {
    console.log("back")
    this.props.navigation.goBack(null)
  };

  onSelectedItemsChange = selectedUserType => {
    this.setState({ selectedUserType, selectedParents: [], selectedSection: '', parents_list: [], selectedClass: '',selectedTrainer: [] });
  };

  onSelectedParents = selectedParents =>{
    console.log(selectedParents)
    this.setState({selectedParents})
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

    if(this.state.selectedUserType.indexOf("parents") >= 0 && !this.state.selectedParents.length){
      alert("Please select parents");
      return
    }
    if(this.state.selectedUserType.indexOf("parents") < 0){
      this.setState({ selectedParents: []});
    }
      this.hitApi();
  }

  createlist = async () => {
    let phone_number = []
    let a =this.state.selectedParents.filter( findall => findall == "all")
    console.log(a);
      if(a.length){
        this.state.parents_list.map((data) => data.mobile_num != "all"?phone_number.push(data.mobile_num):null);
        console.log("P number added here ====>>",phone_number)
      } else {
        console.log("P selected one by one ====>>",this.state.selectedParents);
        phone_number = phone_number.concat(this.state.selectedParents);
      }

    console.log("======== all number ==========",phone_number);
    await this.setState({final_list: phone_number}) 
    return; 
  }

   hitApi = async() => {
      this.setState({loading: true})
      await this.createlist();
    if(this.state.headline && this.state.message && this.state.final_list.length){

			var data = {
				teacher_id:this.state.teacher_id,
				title:this.state.headline,
				message:this.state.message,
				school_id:this.state.school_id,
        receiver_num:this.state.final_list
			}
      console.log(data);
			// await fetch(`${API_URL}/teacher-send-notifications/`, {
			// 			method: "POST",
			// 			headers: {
      //       "Accept": "application/json",
			// 			"Content-Type": "application/json"
      //     },
      //      body: JSON.stringify(data)
      //    })
      //      .then(response => response.json())
      //      .then(response => {
      //        this.setState({ headline: '', message: '', selectedUserType: []});
      //        alert("Sent Successfully");
      //        this.getlistpriviuspage();        
			// 		 });
    } else {
      this.setState({loading: false})
      alert("all fields are required")
    }
  }

  getClassSections = async () => {
    await fetch(`${API_URL}/get-class-sections-for-teacher/${this.state.school_id}/${this.state.teacher_id}/${this.state.selectedClass}`, {
      method: "GET",
      })
     .then(response => response.json())
     .then(response => {
       let b =[{label: 'all', value: 'all' }];
       console.log("==== Class section list ====>>",response)
      if(response.length){
        response.map((data) => b.push({ "label": data.section, "value": data.section }));
        this.setState({ section: b, selectedSection: '' });
      } else {
        this.setState({ section: [], parents_list: []})
      }        
    }).catch((err) => alert(err))
  }

  getParentsList = async () => {
    await this.state.selectedClass == 'all'? this.setState({ selectedSection: 'all'}): null;
    console.log(`${API_URL}/get-parents-via-class-section/${this.state.school_id}/${this.state.selectedClass}/${this.state.selectedSection}`)
    await fetch(`${API_URL}/get-parents-via-class-section/${this.state.school_id}/${this.state.selectedClass}/${this.state.selectedSection}`, {
      method: "GET",
      })
     .then(response => response.json())
     .then(response => {
       console.log("==== parents list ====>>",response)
      if(response.length){
        response.unshift({mobile_num: 'all',student_name: 'all'});
        this.setState({ parents_list: response });
      } else {
        this.setState({parents_list: []})
      }        
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
				<Text style={{fontSize: 18, fontWeight: "bold", color:"#1CAFF6"}}></Text>
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

                <View>
                  <View style={{ flex: 1, width: "95%", alignSelf: "center" }}>
                  <Text style={styleData.customParentStyle}>Send Message</Text>
                  </View>   
                  <View style={styleData.customDropdown}>
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
                        onChangeItem={ async (item) => {
                          await this.setState({ selectedClass: item.value, selectedParents: [], selectedSection: [], parents_list: []})
                          await item.value == "all"? this.getParentsList():this.getClassSections();
                        }}
                        placeholderStyle={{color:'black'}}
                        placeholder="Select class"
                      />
                    </View>
                  </View>

                  <View style={styleData.customDropdown}>

                    <View style={styleData.customDropdownChild2}>
                    <DropDownPicker
                      disabled={ this.state.selectedClass == 'all'? true:false}
                      items={this.state.section}
                      defaultValue=""
                      containerStyle={{ height: 50, borderRadius: 0 }}
                      style={{ ...styleData.customDropdownDivider, paddingBottom: 10, }}
                      itemStyle={{
                        justifyContent: "flex-start",
                      }}
                      dropDownStyle={{ backgroundColor: "#fafafa" }}
                      onChangeItem={ async (item) => {
                        await this.setState({ selectedSection: item.value, selectedParents: []});
                        this.getParentsList();
                      }}
                      placeholderStyle={{color:'black'}}
                      placeholder="Select section"
                    />
                    </View>
                  </View>

                  <View style={{marginTop: 10, paddingHorizontal: 10, width: "100%"}}>
                    <MultiSelect
                      // hideTags
                      items={this.state.parents_list}
                      uniqueKey="mobile_num"
                      // styleMainWrapper={{paddingLeft: 10, borderBottomColor: 'red', borderWidth:1}}
                      // styleDropdownMenu={{borderColor: 'red'}}
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
                      displayKey="student_name"
                      searchInputStyle={{ color: '#CCC' }}
                      submitButtonColor="#CCC"
                      submitButtonText="Selected"
                    />
                  </View>
                </View>
            <Form>
              
                    <Input 
                      onChangeText={ headline => this.setState({ headline, emptyheader: false })}
                      autoCorrect={false}
                      placeholder="Subject"
                      keyboardType="default"
                      autoCapitalize="sentences"
                      style={{borderWidth: 0.5, borderRadius:5, marginVertical: 10, marginHorizontal:8, borderColor:"#afafaf"}}
                      value={this.state.headline}
                    />
                    {this.state.emptyheader?<Icons name='close-circle' />:null}
                    <Textarea 
                      rowSpan={5} 
                      bordered 
                      placeholder="Message"
                      onChangeText={ message => this.setState({message, emptymsg:false})}
                      keyboardType="default"
                      autoCapitalize="sentences"
                      value={this.state.message}
                      style={this.state.emptymsg?{ borderColor: "red", width: "95%", alignSelf: "center"}:{width: "95%", alignSelf: "center"}}
                      />
                </Form>
              {/* ======================================================================= */}

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
    // marginTop: 15,
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
    marginTop: 10
  },
  customDropdown:{
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    width: "96%",
    alignSelf: "center",
    justifyContent: 'center',
  },
  customDropdownDivider:{
    // borderBottomWidth: 0.8,
    // borderColor: '#fff',
    // borderBottomColor: '#e8e8e8',
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

export default HomeWorkAndComplaint;
