import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import { API_URL } from '../constants/config';

class ActivitiesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            // title: `Activities`,
            // headerLeft: <HeaderBackButton onPress={() => navigation.pop(1)} />,
            //headerLeft: <Attendance navigation={navigation} activities={navigation.state.activities} />,
            headerStyle: { height: 80 }
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            value1: '',
            gotImage: 0,
            schoolData: [],
            navparams: [],

        }

    }

    getStudents = (school, teacher, item) => {
        var activititid = JSON.stringify(item.activity_id);
        var activitity_id = activititid.replace(/^"|"$/g, '');
        fetch(`${API_URL}/get-students/${school}/${teacher}/${activitity_id}`, {
            method: 'GET'
        }).then((res) => res.json()).then((response) => {
            this.setState({ value1: response })
            const navigateAction = NavigationActions.navigate({
                routeName: 'Student',
                params: {
                    students: this.state.value1,
                    schoolData: this.state.schoolData,
                    activityData: item,
                    gotImage: this.state.gotImage
                }
            });
            this.props.navigation.dispatch(navigateAction);
        }).catch((err) => alert(err))
    }

    componentWillMount() {
        const { state, navigate } = this.props.navigation;
        this.setState({ schoolData: state.params.schoolData });
    }

    goBack = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'SchoolScreen',
        });
        this.props.navigation.dispatch(navigateAction);
    }

    render() {
        const { state, navigate } = this.props.navigation;
        var arr = [];
        if (state.params.activities != '') {
            var teacher_id = JSON.stringify(state.params.navparams.rolval.teacher_id)
            var school_id = JSON.stringify(state.params.schoolData.school_id)
            var teacher = teacher_id.replace(/^"|"$/g, '');
            var school = school_id.replace(/^"|"$/g, '');
            state.params.activities.map((item) => {
                arr.push(
                    <ListItem onPress={() => this.getStudents(school, teacher, item)}
                        component={TouchableScale}
                        style={{ borderTop: 0 }}
                        title={<Text style={{ paddingLeft: 10, color: '#23ABE2', fontSize: 20 }}>{item.activity_name ? item.activity_name : 'not found'}</Text>}
                        rightIcon={<Icon name="users" style={{ fontSize: 20, color: "#23ABE2", paddingRight: 20, }} />}
                        subtitle={
                            <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 5 }}>
                            </View>
                        }
                    />
                )
            })
        } else {
            arr.push(
                <ListItem
                    component={TouchableScale}
                    title={<Text style={{ paddingLeft: 10, color: '#23ABE2', fontSize: 20 }}>No Activity Found</Text>}
                    rightIcon={<Icon name="users" style={{ fontSize: 20, color: "#23ABE2" }} />}

                />
            )
        }

        return (
            <ScrollView style={styleData.screenContainer}>
                <View style={styleData.container}>
                    <Icon name="chevron-left" onPress={() => this.goBack()} style={{ fontSize: 22, color: '#23ABE2', marginTop: 8 }} />
                    <Text onPress={() => this.goBack()} style={{ fontSize: 25, fontColor: "#000", fontWeight: 'bold', marginLeft: 10 }}>Activities</Text>
                </View>
                <View style={styleData.activityText}>
                    <Text style={{ fontSize: 22, fontWeight: "bold", fontColor: "#4B4B4C", borderRadius: 10, }}> {state.params.schoolData.school_name}
                        <Text style={{ fontSize: 18, fontColor: "#4B4B4C", }}>-{state.params.schoolData.school_address}</Text>
                    </Text>
                </View>

                <View >
                    {arr}
                </View>
            </ScrollView>
        )
    }
}

const styleData = StyleSheet.create({
    screenContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginLeft: 10,
        marginTop: 15
    },
    activityText: {
        backgroundColor: '#F7F7F7',
        marginTop: 50,
        marginBottom: 10,
        marginRight: 15,
        marginLeft: 15,
        padding: 6,
    },
    listData: {
        marginTop: 0,
        padding: 0
    },
    activityHeader: {
        marginTop: 10
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
        borderStyle: 'solid',
        borderColor: "#B0C043",
    }
})


export default ActivitiesScreen;