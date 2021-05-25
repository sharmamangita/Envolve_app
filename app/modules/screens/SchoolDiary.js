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
    SafeAreaView
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
import DocumentPicker from 'react-native-document-picker';

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            miniLoading: false,
            inbox: true,
            teacher_id: this.props.navigation.state.params.student.teacher_id,
            school_id: this.props.navigation.state.params.student.school_id,
            student_id: this.props.navigation.state.params.student.student_id,
            sentDate: [],
            inboxDate: [],
            sentBoxData: '',
            inboxData: '',
            secondtime:false,
            isModalVisible: false,
            message_id: '',
            message: '',
            sendingmsg: false,
            singleFile:''
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

            console.log(this.props.navigation.state.params.student)

        this.inbox();
        this.sent();
    }

    OpenHWAC = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: "HomeWorkAndComplaint",
            params: {
                teacher_id:this.props.navigation.state.params.teacher_id,
                school_Id:this.props.navigation.state.params.schoolId.school_id
              }
          });
          this.props.navigation.dispatch(navigateAction);
    }

    inbox = () => {
        this.setState({ inbox: true, miniLoading: true });
        fetch(`${API_URL}/get-parents-inbox-messages/${this.state.student_id}`, {
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

    sent = () => {
        this.setState({ inbox: false, miniLoading: true });
        fetch(`${API_URL}/get-parents-sent-messages/${this.state.student_id}`, {
            method: "GET",
            })
           .then(response => response.json())
           .then(response => {
            console.log("==== sentBox ====>>", response)
            console.log("==== sentBox ====>>", isEmpty(response))
            if(!isEmpty(response)){
                const d = this.getMsgDate(response)
                this.setState({ sentBoxData: response, sentDate: d, miniLoading: false});
            }else {
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
    
    sentDateWise = (data) => {
        console.log("sent Date wise ===========", data);
        const SentBoxData = this.state.sentBoxData
        const dataDayWise = SentBoxData.filter((values, index)=>{ if(values.date.slice(0, 10) === data.date){ return values } });
        return (
            <View style={{ width:"100%", alignItems:'center', marginBottom: 20}}>
                <Text>--------------- {data.d} ---------------</Text>
                <View style={{width:'100%', marginTop: 5, borderRadius: 5, borderColor: '#afafaf', borderWidth: 1, padding: 1}}>
                    {
                        dataDayWise.map((data, index) => { return this.sentTimeWise(data, index) })
                    }
                </View>
            </View>
        )
    }

    sentTimeWise = (data, index) => {
        console.log(data.date)
        // console.log(index)
        console.log("=============let's see ===========",data)

        return (
            <View>
                { index !== 0?
                    <View style={{ borderTopWidth: 1, width: '96%', alignSelf: 'center', borderColor: '#afafaf' }}></View>:null
                }
                <View>
                    <CardItem>
                        <Body>
                            <Text style={{ textDecorationLine: 'underline', color: '#1CAFF6'}}>{data.title}</Text>
                            <Text style={{ fontStyle: 'italic', color: '#1CAFF6'}}>{data.reply_from}, {this.formatAMPM(data.date)}</Text>
                        </Body>
                    </CardItem>
                    <CardItem style={{ paddingTop: 0, paddingBottom:0}}>
                        <Body>
                            <Text>
                                {data.reply}
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem footer>
                        <Left></Left>
                        <Right>
                            { data.file?
                            <TouchableOpacity onPress={()=> this.downloadLink(data.file) }>
                                <Text style={{ textDecorationLine: 'underline'}}><Icon name="paperclip"/>View attached file </Text>
                            </TouchableOpacity>
                            :null
                            }
                        </Right>
                    </CardItem>
                </View>
            </View>
        )
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

    openModal = (id) => {
        this.setState({isModalVisible: !this.state.isModalVisible, message_id: id})
    }

  // ====================== permission ============================

  requestExternalReadPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'External Storage Read Permission',
            message: 'App needs read permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Read permission err', err);
      }
      return false;
    } else return true;
  };


  chooseDocFromPhone = async () => {
    console.log("ues")

    console.log(this.state.singleFile)
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.images
        ],
      });
      // Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      this.setState({ singleFile: res });
    } catch (err) {
      this.setState({ singleFile: '' });
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('user canceled the document selection');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }

  // ====================== permission ============================

    createFormDataForReply = () => {
        var data = new FormData()
        data.append("message_id",this.state.message_id)
        data.append("reply",this.state.message)
        data.append("reply_from", 'parent')
        if(this.state.singleFile){
          data.append("file", this.state.singleFile);
        }
        console.log("============================= form data ==========================");
        console.log(data);
        console.log("============================= form data ==========================");
    
        return data;
    };

    sendmessage = async () => {
        console.log(this.state.message_id);
        console.log(this.state.message);
        this.setState({ sendingmsg: true });
			// var data = {
			// 	message_id:this.state.message_id,
			// 	reply:this.state.message,
			// 	reply_from: 'teacher'
			// }
            if(this.state.message_id && this.state.message)
            {
                await fetch(`${API_URL}/add-message-reply/`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                body: this.createFormDataForReply()
                })
                .then(response => response.json())
                .then(response => {
                    this.setState({ message_id: '', message: '', isModalVisible: false, sendingmsg: false});
                    alert(response.message);       
				});
            } else {
                this.setState({sendingmsg: false})
                alert("all fields are required")
        }
    }
    
    inboxTimeWise = (data, index) => {
        // console.log(data.date)
        // console.log(index)
        console.log("=============let's see ===========",data)

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
                                <Text style={{ fontStyle: 'italic', color: '#1CAFF6'}}>Teacher: {data.teacher_name}, {this.formatAMPM(data.date)}</Text>
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
                                <Text style={{ textDecorationLine: 'underline'}}>View attach file</Text>
                            </TouchableOpacity>
                            :null
                            }
                        </Right>
                    </CardItem>
                </View>
            </View>
        )
    }

    formatAMPM = (d) => {
        var hours = d.slice(11, 13);
        var minutes = d.slice(14, 16);
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
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
            const folderPath = '/storage/emulated/0/Download';
            RNFetchBlob.fs.isDir(folderPath).then((isDir) =>{
                // if(!isDir) {
                //     console.log("file didn't exist")
                //     RNFetchBlob.fs.mkdir(folderPath).then(()=> {
                //         console.log("new file created");
                //     })
                //     .catch(error => console.log(error));
                // }
                    // let docDir = RNFetchBlob.fs.dirs.DocumentDir + '/Envolve/' + URL
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
            <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <View style={styleData.body}>
             
                <View style={styleData.section1}>
                    
                    <View style={{flexDirection:'row', marginTop: 20}}>
                        <View style={{flex: 9, alignSelf:'flex-start'}}>
                            <Text style={{fontSize: 18, fontWeight:'bold'}}>School Dairy</Text>
                        <Text style={{fontSize: 14,}}>{this.props.navigation.state.params.student.school_name}</Text>
                        <Text style={{fontSize: 14,}}>{this.props.navigation.state.params.student.student_name}: {this.props.navigation.state.params.student.class} - {this.props.navigation.state.params.student.section}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                    <Button style={this.state.inbox?styleData.messagesBoxActive:styleData.messagesBoxInActive}
                        onPress={() => this.inbox()}
                    >
                        <Text style={this.state.inbox?{color:'#1CAFF6'}:{color:'#000'}}>Inbox</Text>
                    </Button>
                    <Button style={!this.state.inbox?styleData.messagesBoxActive:styleData.messagesBoxInActive}
                        onPress={() =>this.sent()}
                    >
                        <Text  style={!this.state.inbox?{color:'#1CAFF6'}:{color:'#000'}}>Sent</Text>
                    </Button>
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

                    this.state.inbox ?
                    this.state.inboxDate.map((date) => {
                        return this.inboxDateWise(date)
                    })
                    :
                    this.state.sentDate.map((date) => {
                        return this.sentDateWise(date);
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
{/* start model from here */}
<Modal isVisible={this.state.isModalVisible}>
                    <ScrollView>
                    <View style={{ flex: 1, backgroundColor:"white", borderRadius: 10, marginVertical: "20%"}}>
                        <View style={{flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 1, padding: 10}}>
                        <Text style={{flex: 10, fontWeight:'bold'}}>Send Message</Text>
                        <TouchableOpacity onPress={() => this.openModal('')} style={{ width: 20, alignContent: 'center'}}><Icon name="close" size={20} color="#1CAFF6" /></TouchableOpacity>
                        </View>
                        <View style={{paddingTop: 10}}>
                        <CardItem>
                            {
                            
                                !this.state.sendingmsg?
                                <Body>
                                    <View style={{width:'100%'}}>
                                        <Textarea
                                        bordered
                                        disabled={this.state.sendingmsg}
                                        rowSpan={5}
                                        placeholder="Enter Message"
                                        onChangeText={(value) => this.setState({message: value})}
                                        value={this.state.message}
                                        />
                                    </View>
                                    
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity disabled={this.state.sendingmsg} onPress={()=> this.chooseDocFromPhone() } style={{flex:10, alignItems: 'flex-start', marginTop:10}}>
                                            {
                                                this.state.singleFile?
                                                <Text style={{ textDecorationLine: 'underline'}}>{this.state.singleFile.name} attached</Text>
                                                :
                                                <Text style={{ textDecorationLine: 'underline'}}>Attach File</Text>  
                                            }
                                        </TouchableOpacity>
                                    
                                        <TouchableOpacity disabled={this.state.sendingmsg} style={{flexDirection: 'row', alignItems: 'flex-end', marginTop:10}} onPress={()=> this.sendmessage()}>
                                            <Icon name="send" color={'#1CAFF6'} size={18} />
                                            <Text style={{ color: '#1CAFF6'}}> Send</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Body> :
                                <Body>
                                    <View
                                    style={{
                                        alignContent:'center',
                                        justifyContent: "center",
                                        width:"100%",
                                        height: "100%"
                                    }}
                                    >
                                        <Spinner color="#1CAFF6" style={{ marginHorizontal: 'auto'}} />
                                        {this.state.singleFile.length? <Text style={{ alignSelf:'center' }}>File uploading...</Text>:<Text style={{ alignSelf:'center' }}>Sending Message</Text>}
                                    </View>
                                </Body>
                            }
                        </CardItem>
                        </View>
                    </View>
                    </ScrollView>
                </Modal>
{/* end model from here */}
            </View>
            </SafeAreaView>
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
        height: 130,
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

export default Messages;
