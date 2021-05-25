import React, { Component } from 'react';
import { ScrollView, Image, View, Text, StyleSheet, TouchableOpacity,Platform, SafeAreaView } from 'react-native';
import { ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_URL } from '../constants/config';
import { NavigationActions } from 'react-navigation';


class TrainerAttendance extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <View style={{ marginLeft: 10 }}>
                <Image
                    source={require('../assets/images/Envolve-logo_25.png')}
                /></View>,
            headerStyle: { height: 80 }
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            value1: ''
        }
    }

    componentDidMount() {
        fetch(`${API_URL}/get-trainer-attendance/`).then((res) => res.json()).then((response) => {
            if (response.length > 0) {
                this.setState({ students: response });
                console.log("====>", response);
            }
        }).catch((err) => alert(err))
    }

    goBack = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'SchoolScreen',
        });
        this.props.navigation.dispatch(navigateAction);
    }

    openTrainerData = (teacher_id, teacherName) => {
        const navigateAction = NavigationActions.navigate({
          routeName: "TrainerAttendanceChart",
          params: {
            trainer_id: teacher_id,
            trainerName: teacherName
        }
        });
        this.props.navigation.dispatch(navigateAction);
      }


    render() {
        // alert(this.state.activity_id);
        const { state, navigate } = this.props.navigation;
        var arr = [];
        if (this.state.students != '') {
            console.log("================= student name =======================");
            console.log(this.state.students);
            console.log("===================== student name ===============");
            this.state.students.map((t) => {
                arr.push(
                    <TouchableOpacity onPress={ () => this.openTrainerData(t.teacher_id, t.teacher_name)} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: -36 }}>
                        <View style={[styleData.box, styleData.box2]}>
                            <Text style={{ color: '#23ABE2', textAlign: 'center', marginTop: 10 }}>{t.teacher_name}</Text>
                        </View>

                        <View style={[styleData.box, styleData.box2]}>
                            <Text style={{ textAlign: 'center', marginTop: 10 }}>{t.mobile_num}</Text>
                        </View>

                        <View style={[styleData.box, styleData.box2]}>
                            <Text style={{ textAlign: 'center', marginTop: 10 }}>{t.school_name}</Text>
                        </View>

                        <View style={[styleData.box, styleData.box2]}>
                            <Text style={{ textAlign: 'center', marginTop: 10 }}>{t.update_at}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })
        } else {
            arr.push(
                <ListItem
                    component={TouchableScale}
                    avatar={{ uri: 'https://react-native-training.github.io/react-native-elements/docs/0.19.1/lists.html' }}
                    title='No Found Trainer Attendance'
                    subtitle={
                        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 5 }}>
                            <Image style={{ height: 19.21, width: 100 }} />
                        </View>
                    }
                />
            )
        }

        return (
            <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <ScrollView style={styleData.screenContainer}>
                <View style={styleData.outercontainer}>
                    <Icon name="chevron-left" onPress={() => this.goBack()} style={{ fontSize: 22, color: '#23ABE2', marginTop: 8 }} />
                    <Text onPress={() => this.goBack()} style={{ fontSize: 25, fontColor: "#000", fontWeight: 'bold', marginLeft: 10 }}>Trainer Attendance</Text>
                </View>
                <View style={{ flex: 5, flexDirection: 'column' }}>

                </View>
                <View style={styleData.row}>
                    <View style={[styleData.box, styleData.box1]}><Text style={styleData.tableTextData}>Name</Text></View>
                    <View style={[styleData.box, styleData.box1]}><Text style={styleData.tableTextData}>Mobile No.</Text></View>
                    <View style={[styleData.box, styleData.box1]}><Text style={styleData.tableTextData}>School Name</Text></View>
                    <View style={[styleData.box, styleData.box1]}><Text style={styleData.tableTextData}>Attendance Time</Text></View>
                </View>
                <View>
                    {arr.reverse()}
                </View>
            </ScrollView>
            </SafeAreaView>
        )
    }
}



const styleData = StyleSheet.create({
    screenContainer: {
        // marginTop:(Platform.OS === 'ios')?40:0,
        flex: 8,
        backgroundColor: '#fff',
        height:'100%',
        width:'100%'
        
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
        // flex: .3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 25,
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
        height: 70,
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
        fontSize: 12,
        marginTop: 20
    },
    spaceBetween: {
        marginTop: 10,
    }
})


export default TrainerAttendance;