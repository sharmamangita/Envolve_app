import React, { Component } from 'react';
import { 
    ScrollView,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity, 
    Platform,
    PermissionsAndroid,
    Alert,
} from 'react-native';
import { Button, Spinner, Card, CardItem, Body, Left, Right, Textarea } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { API_URL } from '../constants/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import RNFetchBlob from 'rn-fetch-blob';
import { isEmpty } from 'lodash';
import { openSettings } from 'react-native-permissions';
import AsyncStorage from "@react-native-community/async-storage";
import Modal from "react-native-modal";

class SchoolDiary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            miniLoading: false,
            inbox: true,
            teacher_id: this.props.navigation.state.params.student.teacher_id,
            school_id: this.props.navigation.state.params.student.school_id,
            sentDate: [],
            inboxDate: [],
            sentBoxData: '',
            inboxData: '',
            parent_id: '',
            secondtime:false,
            isModalVisible: false,
            message_id: '',
            message: ''
        }
    }

    async componentDidMount() {
        await AsyncStorage.getItem("@userData").then(
            (parent) =>{
              console.log(parent);
              this.setState({ parent_id: parent });
            }, (err) =>{
              console.log("error",err)
        });
        console.log("parent id ====>>",this.state.parent_id)
      this.inbox();
    }

    inbox = () => {
        this.setState({ miniLoading: true });
        fetch(`${API_URL}/get-parents-inbox-messages/${this.state.parent_id}`, {
            method: "GET",
            })
           .then(response => response.json())
           .then(response => {
            console.log("==== InBox ====>>",response)
            console.log("==== InBox ====>>", isEmpty(response))
            if(!isEmpty(response)){
                const d = this.getMsgDate(response)
                this.setState({inboxData: response, inboxDate: d, miniLoading: false});

            } else {
                this.setState({miniLoading: false});
            }
          }).catch((err) => {
                this.setState({miniLoading: false});
                alert(err)
            })
    }

    getMsgDate = (d) => {
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const date = d.map(data => data.date.slice(0,10))
        const uniqDate = date.filter((values, index) => date.indexOf(values) === index);
        const presentableDate = uniqDate.map(
            (date) =>{
                var newDate = new Date(date);
                return({
                    date: date,
                    d: `${newDate.getDate()} ${months[newDate.getMonth()]}, ${days[newDate.getDay()]}`
                })
            }
        )
        return presentableDate
    }
    
   
    inboxDateWise = (data) => {
        console.log("sent Date wise ===========", data);
        const inboxData = this.state.inboxData
        const dataDayWise = inboxData.filter((values, index)=>{ if(values.date.slice(0, 10) === data.date){ return values } });
        return (
            <View style={{ width:"100%", alignItems:'center', marginBottom: 20}}>
                <Text>--------------- {data.d} ---------------</Text>
                <View style={{width:'100%', marginTop: 5, borderRadius: 5, borderColor: '#afafaf', borderWidth: 1, padding: 1}}>
                    {
                        dataDayWise.map((data, index) => { return this.inboxTimeWise(data, index) })
                    }
                </View>
            </View>
        )
    }

    formatAMPM = (d) => {
        const dd = d;
        const date = new Date(dd);
        console.log("date........",date)
        console.log("date........",dd)
        var hours = date.getHours()
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    openModal = (id) => {
        this.setState({isModalVisible: !this.state.isModalVisible, message_id: id})
    }

    inboxTimeWise = (data, index) => {
        console.log(data.date)
        console.log(index)
        // var time = this.formatAMPM(data.date)
        console.log("=============let's see ===========",index)

        return (
            <View>
                {}
                { index !== 0?
                    <View style={{ borderTopWidth: 1, width: '96%', alignSelf: 'center', borderColor: '#afafaf' }}></View>:null
                }
                <View>
                    <CardItem>
                        <Left>
                            <View>
                                <Text style={{ textDecorationLine: 'underline', color: '#1CAFF6'}}>{data.title}</Text>
                                <Text style={{ fontStyle: 'italic', color: '#1CAFF6'}}>Class {this.props.navigation.state.params.student.class}-{this.props.navigation.state.params.student.section}, 10:00am</Text>
                            </View>
                        </Left>
                        <Right>
                            <TouchableOpacity style={{flex:1, flexDirection: 'row'}} onPress={()=> this.openModal(data.id)} >
                            <Icon name="reply" color={'#1CAFF6'} size={18} />
                            <Text style={{ fontStyle: 'italic', color: '#1CAFF6'}}> Reply</Text>
                            </TouchableOpacity>
                        </Right>
                    </CardItem>
                    <CardItem style={{ paddingTop: 0, paddingBottom:0}}>
                        <Body>
                            <Text>
                                {data.message}
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left></Left>
                        <Right>
                            { data.file?
                            <TouchableOpacity onPress={()=> this.downloadLink(data.file) }>
                                <Text style={{ textDecorationLine: 'underline'}}><Icon name="paperclip"/>attached file </Text>
                            </TouchableOpacity>
                            :null
                            }
                        </Right>
                    </CardItem>
                </View>
            </View>
        )
    }

    sendmessage = async () => {
        console.log(this.state.message_id);
        console.log(this.state.message);
        this.setState({ isModalVisible: false});
			var data = {
				message_id:this.state.message_id,
				reply:this.state.message,
				reply_from: 'parent'
			}
            console.log(data);
            if(this.state.message_id && this.state.message)
            {
                await fetch(`${API_URL}/add-message-reply/`, {
                    method: "POST",
                    headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(response => {
                    this.setState({ message_id: '', message: '', isModalVisible: false});
                    alert("Message Sent Successfully");
                    this.getlistpriviuspage();        
				});
            } else {
                alert("all fields are required")
            }
    }

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

    downloadLink = async (URL) =>{
        const pdf_url = `https://api.envolve.in/upload/trainer-sent/${URL}`;
        console.log(pdf_url);

        let isStoragePermitted = await this.requestExternalWritePermission();

        if(isStoragePermitted){
            let Dir = RNFetchBlob.fs.dirs
            const folderPath = '/storage/emulated/0/Envolve';
            RNFetchBlob.fs.isDir(folderPath).then((isDir) =>{
                if(!isDir) {
                    console.log("file didn't exist")
                    RNFetchBlob.fs.mkdir(folderPath).then(()=> {
                        console.log("new file created");
                    })
                    .catch(error => console.log(error));
                } else {
                    let docDir = RNFetchBlob.fs.dirs.DocumentDir + '/Envolve/' + URL
                    const { dirs } = RNFetchBlob.fs;
                    RNFetchBlob.config({
                        fileCache: true,
                        addAndroidDownloads: {
                        useDownloadManager: true,
                        notification: true,
                        mediaScannable: true,
                        title: URL,
                        path: `${folderPath}/` + URL,
                        },
                    })
                    .fetch('GET', pdf_url, {})
                    .then(res => {
                        //Showing alert after successful downloading
                        console.log('res -> ', JSON.stringify(res));
                        Alert.alert("Downloaded Successfully.", URL+" File is downloaded");
                    })
                    .catch(error => console.log(error))
                }
            })
        } else {
            if(this.state.secondtime){
              openSettings();
            }else {
              alert("App need to access External Storage Write Permission");
            }
            this.setState({secondtime: true});
        }
    }

    render() {
        return (
            <View style={styleData.body}>
             
                <View style={styleData.section1}>
                    
                    <View style={{flexDirection:'row', marginTop: 20}}>
                        <View style={{flex: 9, alignSelf:'flex-start'}}>
                            <Text style={{fontSize: 18, fontWeight:'bold'}}>School Dairy</Text>
                        <Text style={{fontSize: 14,}}>{this.props.navigation.state.params.student.school_name}</Text>
                        <Text style={{fontSize: 14,}}>{this.props.navigation.state.params.student.student_name}: {this.props.navigation.state.params.student.class} - {this.props.navigation.state.params.student.section}</Text>
                        </View>
                    </View>

                </View>

                <ScrollView style={this.state.loading?{...styleData.section2,opacity:0.1}:{...styleData.section2,opacity:1}}>
                

                {this.state.miniLoading ? (
                    <View
                      style={{
                        alignContent:'center',
                        justifyContent: "center"
                      }}
                    >
                        <Spinner color="#1CAFF6" style={{ marginTop: '50%'}} />
                    </View>
                  ) : (
                    this.state.inboxDate.map((date) => {
                        return this.inboxDateWise(date);
                    })
                  )}                  
                </ScrollView>

                 {this.state.loading ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        position:'absolute',
                        marginTop:'40%',
                        left:'35%',
                        zIndex:999
                      }}
                    >
                      <Bubbles size={20} color="#1CAFF6" />
                    </View>
                  ) : null} 

                <Modal isVisible={this.state.isModalVisible}>
                    <ScrollView>
                    <View style={{ flex: 1, backgroundColor:"white", borderRadius: 10, marginVertical: "20%"}}>
                        <View style={{flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 1, padding: 10}}>
                        <Text style={{flex: 10, fontWeight:'bold'}}>Send Message</Text>
                        <TouchableOpacity onPress={() => this.openModal('')} style={{ width: 20, alignContent: 'center'}}><Icon name="close" size={20} color="#1CAFF6" /></TouchableOpacity>
                        </View>
                        <View style={{paddingTop: 10}}>
                        <CardItem>
                            <Body>
                                <View style={{width:'100%'}}>
                                    <Textarea
                                    bordered
                                    rowSpan={5}
                                    placeholder="Enter Message"
                                    onChangeText={(value) => this.setState({message: value})}
                                    value={this.state.message}
                                    />
                                </View>
                                
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={()=> console.log("hello") } style={{flex:10, alignItems: 'flex-start', marginTop:10}}>
                                        <Text style={{ textDecorationLine: 'underline'}}><Icon name="paperclip"/>attach File </Text>
                                    </TouchableOpacity>
                                
                                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'flex-end', marginTop:10}} onPress={()=> this.sendmessage()}>
                                        <Icon name="send" color={'#1CAFF6'} size={18} />
                                        <Text style={{ color: '#1CAFF6'}}> Send</Text>
                                    </TouchableOpacity>
                                </View>
                            </Body>
                        </CardItem>
                        </View>
                    </View>
                    </ScrollView>
                </Modal>

            </View>
        );
    }
}

const styleData = StyleSheet.create({
    body: {
        flex: 1,
        flexDirection: "column",
        height:'100%',
        width:'100%',
        paddingHorizontal: 12,
        backgroundColor:'#fff' 
    },
    section1:{
        height: 100,
        width: '100%',
    },
    section2:{
        width: '100%',
    },
    addButton: {
        height: 50,
        width: 50,
        borderRadius: 100,
        justifyContent: 'center',
        backgroundColor: '#1CAFF6'
    },
    messagesBoxActive:{
        backgroundColor: '#fff',
        width: 70,
        height: 30,
        borderRadius: 4,
        marginHorizontal:5,
        marginTop: 10,
        borderWidth: 2, 
        justifyContent: 'center',
        borderColor:'#1CAFF6'
    },
    messagesBoxInActive:{
        backgroundColor: '#fff',
        width: 70,
        height: 30,
        borderRadius: 4,
        marginHorizontal:5,
        marginTop: 10,
        borderWidth: 2, 
        justifyContent: 'center',
        borderColor:'#afafaf',
        backgroundColor:'#efefef'
    },
    referenceText: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 15,
        padding: 0,
    },
    listData: {
        marginTop: 0,
        padding: 0
    },
})

export default SchoolDiary;
