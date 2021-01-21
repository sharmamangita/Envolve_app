import React, { Component } from 'react';
import { ScrollView, Image, TouchableOpacity, View, Text, Alert, StyleSheet, Button } from 'react-native';
import { ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';

import CheckBox from 'react-native-check-box'
// import School from '../School/index';
// import Activities from '../Activities/index';
// import Attendance from '../Attendance/index';
// import styles from '../../styles/index';
//import Environment from '../../../Components/Environment/index';
//import VideoPlayer from '../../screens/VideoPlayer/index';
import { API_URL } from '../constants/config';

class Students extends Component {

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
            checkedArr: [],
            check_arr: [],
            activity_id: '',
            statusVal: [],
            checked: false,

        };
    }


    componentWillUnMount() {
        rol();
    }

    goBack = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'ActivitiesScreen',
        });
        this.props.navigation.dispatch(navigateAction);
    }

    video = (playVideoUrl=null) => {
        if(playVideoUrl){
        const navigateAction = NavigationActions.navigate({
            routeName: 'VideoPlayer',
            params: {
              playVideoUrl: playVideoUrl,
              backTo:'Student'
            }
        });
        this.props.navigation.dispatch(navigateAction);
       }
    }

    mark_attendance = async (e, attendance_status, id) => {

        const { state } = this.props.navigation
        if (attendance_status == "1") {
            var idx = this.state.check_arr.indexOf(id);
            if (idx != -1) {
                this.state.check_arr.splice(idx, 1);
            }
            else {
                this.state.check_arr.push(id);
            }
        } else {
            var idx = this.state.check_arr.indexOf(id);
            if (idx != -1) {
                this.state.check_arr.splice(idx, 1);
            }
            else {
                this.state.check_arr.push(id);
            }
        }
        state.params.students.find((i) => {
            if (id == i.student_id) {
                if (attendance_status == '0') {
                    i.attendance_status = '1';
                    this.setState({ statusVal: state.params.students });
                }
                else {
                    i.attendance_status = '0';
                    this.setState({ statusVal: state.params.students });
                }
            }
        })
    }

    integer_to_roman(num) {
        if (typeof num !== 'number') 
        return false; 
        var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
        "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
        "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman_num = "",
        i = 3;
        while (i--)
        roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
        return Array(+digits.join("") + 1).join("M") + roman_num;
    }

    capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }

    select_all = () => {
        const { state, navigate } = this.props.navigation;
        this.setState({ checked: !this.state.checked });
        this.state.check_arr = [];
        state.params.students.map((t, i) => {
            t.attendance_status = this.state.checked ? 0 : 1;
            this.state.check_arr.push(t.student_id)
        });
        this.setState({ statusVal: state.params.students });
    }

    send_attendance = async () => {
        if (this.state.check_arr.length > 0) {
            await fetch(`${API_URL}/send-attendance/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id_arr: this.state.check_arr,
                    activity_id: this.state.activity_id,
                }),
            }).then(res => {
                if (res.status == '200') {
                    Alert.alert(
                        "Success",
                        "Attendance submitted successfully",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel" 
                            },
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                    this.setState({ check_arr: [] });
                }
                else {
                    Alert.alert(
                        "Error",
                        "Attendance not submit",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }
            })
                .catch((error) => {
                    //alert('Attendance marked successfully.');
                });
        } else {
            Alert.alert(
                "Error",
                "Please mark student attendance",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        }
    }

    componentWillMount() {
        const { state, navigate } = this.props.navigation;
        this.setState({
            activity_id: state.params.activityData.activity_id,
            statusVal: state.params.students
        });
    }


    render() {
        const { state, navigate } = this.props.navigation;
         var videoLink = null;
        var arr = [];
        var that = this;
        if (state.params.students != '') {
            console.log("============stateusVal============");
            console.log(this.state.statusVal);
            console.log("===================================")
            this.state.statusVal.map((t, i) => {
                let playFileName = state.params.students[0].videoUrl;
                videoLink=`${API_URL}/upload/${playFileName}`;
                if (t.student_id !== null && t.admission_number !== null) {
                    arr.push(
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: -36 }}>

                            <View style={[styleData.box, styleData.box2]}>
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>{t.admission_number}</Text>
                            </View>

                            <View style={[styleData.box, styleData.box2]}>
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>{t.student_name}</Text>
                            </View>

                            <View style={[styleData.box, styleData.box2]}>
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>
                               {isNaN(t.class)? that.capitalize(t.class) : that.integer_to_roman(parseInt(t.class))}
                                </Text>
                            </View>

                            <View style={[styleData.box, styleData.box2]}>
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>{t.section}</Text>
                            </View>


                            <View style={[styleData.box, styleData.box2]}>
                                <CheckBox data-id={t.student_id} style={{ flex: 1, padding: 10 }} checkedCheckBoxColor="green" checkedImage={<Image source={require('../assets/images/rsz_check_150.png')} />} onClick={() => this.mark_attendance(this, t.attendance_status, t.student_id)} isChecked={t.attendance_status == 1} />
                            </View>

                        </View>
                    );
                }
                else {
                    arr.push(
                        <ListItem
                            component={TouchableScale}
                            avatar={{ uri: 'https://react-native-training.github.io/react-native-elements/docs/0.19.1/lists.html' }}
                            title='No Student Found'
                        />
                    )
                }
            })

        } else {
            arr.push(
                <ListItem
                    component={TouchableScale}
                    avatar={{ uri: 'https://react-native-training.github.io/react-native-elements/docs/0.19.1/lists.html' }}
                    title='No Student Found'
                />
            )
        }


        return (
            <View style={styleData.screenContainer}>
                <ScrollView>
                    <View style={styleData.outercontainer}>
                        <Icon name="chevron-left" onPress={() => this.goBack()} style={{ fontSize: 22, color: '#23ABE2', marginTop: 8 }} />
                        <Text onPress={() => this.goBack()} style={{ fontSize: 25, fontColor: "#000", fontWeight: 'bold', marginLeft: 10 }}>Students</Text>
                    </View>
                    
                    <View style={{ backgroundColor: '#F7F7F7', marginTop: 50, marginBottom: 10, marginRight: 15, marginLeft: 15, padding: 6 }}>
                        <Text style={{ fontSize: 22, fontWeight: "bold", fontColor: "#4B4B4C", }}> {state.params.schoolData.school_name}
                            <Text style={{ fontSize: 18, fontColor: "#4B4B4C", }}>-{state.params.schoolData.school_address}</Text>
                        </Text>
                    </View>

                    <View style={{ flex: 5, flexDirection: 'column' }}>
                        <TouchableOpacity
                            onPress={() => this.video(videoLink)}>
                            <View style={styleData.activities}>
                                <Text style={{ color: "#337ab7", fontSize: 20 }}>{state.params.activityData.activity_name}</Text>
                                {videoLink?(<Icon name="video-camera" style={{ fontSize: 20, marginTop: 5, color: '#23ABE2' }} />):null}
                                
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styleData.row}>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Admission Number</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Student Name</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Class</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Section</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Attendance</Text><CheckBox style={{ flex: 1, padding: 10 }} onClick={() => { this.select_all() }} checkedCheckBoxColor="green" isChecked={this.state.checked} /></View>
                    </View>
                    <View style={{ marginBottom: 25 }}>
                        {arr}
                    </View>
                </ScrollView>
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                    <Button title="Send Attendance" onPress={() => this.send_attendance()} color="#23ABE2" marginTop="1000" />
                </View>
            </View>

        )
    }


}

const styleData = StyleSheet.create({
    screenContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        flex: 1,
    },
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
        marginBottom: 10
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
        fontSize: 12
    },
    buttonStyle: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 5,
        marginVertical: 10,
        width: 250,
    },
    spaceBetween: {
        marginTop: 10,
    }
})


export default Students;