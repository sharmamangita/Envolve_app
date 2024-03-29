import React, { Component } from 'react';
import { ScrollView, Image, TouchableOpacity, View, Text, StyleSheet, Platform, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from "moment";
import { NavigationActions } from 'react-navigation';
import { API_URL } from '../constants/config'
//import VideoPlayer from '../../screens/VideoPlayer/index';
class StudentAttendance extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <View style={{ marginLeft: 10 }}>
                <Image source={require('../assets/images/Envolve-logo_25.png')} /></View>,
            headerStyle: { height: 80 }
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            activity_id: '',
            statusVal: [],
            videoUrl:''
        };

    }

    goBack = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'Parents',
        });
        this.props.navigation.dispatch(navigateAction);
    }

    video = (playVideoUrl=null) => {
        if(playVideoUrl){
        const navigateAction = NavigationActions.navigate({
            routeName: 'VideoPlayer',
            params: {
              playVideoUrl: playVideoUrl,
              backTo:'StudentAttendance'
            }
        });
        this.props.navigation.dispatch(navigateAction);
        }
    }

    createdDate(createdOn) {
        var created = moment(createdOn).format("DD-MM-YYYY");
        return created;
    }

    componentWillMount() {
        const { state, navigate } = this.props.navigation;
        this.setState({
            activity_id: state.params.activityData.activity_id,
            statusVal: state.params.students
        });
        this.getVideoUrl();
    }

    getVideoUrl(){
        const { state, navigate } = this.props.navigation;
        let activity_id =state.params.activityData.activity_id;
        if(activity_id!=undefined && activity_id){
        fetch(`${API_URL}/get-video/${activity_id}`, {
            method: 'GET'
        }).then((res) => res.json()).then((response) => {
            if(response.length){
                console.log("==================== video url =======================");
                console.log(response);
                console.log("==================== video url =======================");
                let video_Url = response[0].videoUrl;
                this.setState({
                    videoUrl:video_Url
                })
            }
        }).catch((err) => alert(err))
     } 
    }

    render() {
        const Present = <Text style={{ textAlign: 'center', marginTop: 10 }}>Present</Text>;
        const Absent = <Text style={{ textAlign: 'center', marginTop: 10, color: '#FF0000' }}>Absent</Text>;
           
        const { state, navigate } = this.props.navigation;
        var arr = [];
        var videoLink = null;
        let playFileName = this.state.videoUrl;
        if(playFileName){
          videoLink = `${API_URL}/upload/${playFileName}`;  
        }
        
        //alert(JSON.stringify(state));
        if (state.params.students != '') {
            this.state.statusVal.map((t, i) => {
                if (t.student_id !== null) {
                    arr.push(
                        <View style={{
                            flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: -36, marginLeft: 10,
                            marginRight: 10
                        }}>

                            <View style={[styleData.box, styleData.box2]}>
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>{t.activity_name}</Text>
                            </View>

                            <View style={[styleData.box, styleData.box2]}>
                                {t.attendance_status == "1" ? Present : Absent}
                            </View>

                            <View style={[styleData.box, styleData.box2]}>
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>{this.createdDate(t.updated_at)}</Text>
                            </View>
                        </View>
                    );
                }
            })

        } else {
            arr.push(
                <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 5 }}>
                    <Text style={{ paddingLeft: 10, color: 'grey', fontSize: 20, color: '#23ABE2' }}>No Attendance</Text>
                </View>
            )
        }


        return (
            <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: '#fff', paddingTop:(Platform.OS === 'ios')?46:0 }}>
                <ScrollView>
                    <View style={styleData.outercontainer}>
                        <Icon name="chevron-left" onPress={() => this.goBack()} style={{ fontSize: 22, color: '#23ABE2', marginTop: 8 }} />
                        <Text onPress={() => this.goBack()} style={{ fontSize: 25, fontColor: "#000", fontWeight: 'bold', marginLeft: 10 }}>{state.params.activityData.student_name}</Text>
                    </View>
                    <View style={{ backgroundColor: '#F7F7F7', marginTop: 50, marginBottom: 10, marginRight: 15, marginLeft: 15, padding: 6 }}>
                        <Text style={{ fontSize: 22, fontWeight: "bold", fontColor: "#4B4B4C", }}> {state.params.activityData.school_name}
                        </Text>
                    </View>

                    <View style={{ flex: 5, flexDirection: 'column' }}>

                        <TouchableOpacity
                            onPress={() => this.video(videoLink)}>
                            <View style={styleData.activities}>
                                <Text style={{ color: "#337ab7", fontSize: 20 }}>{state.params.activityData.activity_name} </Text>
                                {videoLink?(<Icon name="video-camera" style={{ fontSize: 20, marginTop: 5, color: '#23ABE2' }} />):null}
                            </View>
                        </TouchableOpacity>


                    </View>

                    <View style={styleData.row}>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Activity Name</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Attendance</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Date</Text></View>
                    </View>

                    <View style={{ marginBottom: 25 }}>
                        {arr}
                    </View>
                </ScrollView>
            </View >
            </SafeAreaView>
        )
    }
}



const styleData = StyleSheet.create({
    outercontainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginLeft: 10,
        marginTop: 15
    },
    activities: {
        flex: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
        backgroundColor: "#fff",
        margin: 15,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: "#B0C043",
    },
    referenceText: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 80,
        marginBottom: 0,
        padding: 0,
    },
    listData: {
        marginTop: 0,
        padding: 0
    },
    containerData: {
        flex: 5,
        backgroundColor: '#fff',
        marginTop: 5
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    input: {
        width: 250,
        height: 44,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#ecf0f1'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    rowContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    box: {
        flex: 1,
        height: 65,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: "#B0C043",
        marginTop: 30,
    },
    box2: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: "#B0C043",
    },
    box3: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: "#B0C043",
    },
    two: {
        flex: 2
    },
    tableTextData: {
        textAlign: 'center',
        fontWeight: '600',
        color: '#23ABE2',
        fontSize: 15,
        marginTop: 10

    },
    spaceBetween: {
        marginTop: 10,
    }
})


export default StudentAttendance;