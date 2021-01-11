import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { ListItem, Avatar } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_URL } from '../constants/config';
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
class Parents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schools: [],
            Api_url: '',
            roleval: Object.assign({}, this.props.navigation.state.params),
            navparams: '',
            loading: false,
        }
    }
    componentDidMount() {

        var navparams = this.props.navigation.state.params ? this.props.navigation.state.params : null;
        if (navparams == null && this.props) {
            var navparams = this.props;
        }
        this.setState({
            loading: true
        })
        var mobile_num = JSON.stringify(navparams.rolval.mobile_num);
        var mobile_number = mobile_num.replace(/^"|"$/g, '');
        fetch(`${API_URL}/student-activities/${mobile_number}`).then((res) => res.json()).then((response) => {
            //alert(JSON.stringify(response));
            if (response.length > 0) {
                this.setState({ schools: response,loading:false });
            }
        }).catch((err) =>{
            this.setState({loading:false });
            alert(err);

        })


    }

    student_info = (item) => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'StudentProfile',
            params: {
                activityData: item
            }
        });
        this.props.navigation.dispatch(navigateAction);
    }

    getStudents = (item) => {
        var student_id = JSON.stringify(item.student_id);
        var activity_id = JSON.stringify(item.activity_id);
        var school_id = JSON.stringify(item.school_id);
        var schoolid = school_id.replace(/^"|"$/g, '');
        var studentid = student_id.replace(/^"|"$/g, '');
        var activityid = activity_id.replace(/^"|"$/g, '');
        this.setState({
            loading: true
        })
        fetch(`${API_URL}/get-students-attendance/${studentid}/${activityid}`, {
            method: 'GET'
        }).then((res) => res.json()).then((response) => {
            this.setState({ value1: response,loading:false })
            const navigateAction = NavigationActions.navigate({
                routeName: 'StudentAttendance',
                params: {
                    students: this.state.value1,
                    activityData: item,
                }
            });
            this.props.navigation.dispatch(navigateAction);
        }).catch((err) => alert(err))
    }
    render() {
        const { navigate, state } = this.props.navigation;
        var viewbtton = [];
        var navparams = this.props.navigation.state.params ? this.props.navigation.state.params : null;
        if (navparams == null && this.props) {
            var navparams = this.props;
        }
        var arr = [];
        if (this.state.schools != '') {
            this.state.schools.map((item) => {
                arr.push(
                    <View>
                        <View>
                            <ListItem onPress={() => this.student_info(item)}
                                component={TouchableScale}
                                avatar={
                                    <Avatar
                                        size="large"
                                        rounded
                                        source={require('../assets/images/download.png')}
                                        showEditButton
                                        onPress={() => alert('clicked avatar')}
                                    />
                                }
                                title={<Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 5, paddingTop: 5 }}>{item.student_name}</Text>}

                            />
                        </View>

                        <View>
                            <Text style={styleData.school_name}>{item.school_name}</Text>
                        </View>

                        <View>
                            <ListItem onPress={() => this.getStudents(item)}
                                component={TouchableScale}
                                style={{ borderTop: 0 }}
                                title={<Text style={{ paddingLeft: 10, color: '#23ABE2', fontSize: 20 }}>{item.activity_name}</Text>}
                                rightIcon={<Icon name="users" style={{ fontSize: 20, color: "#23ABE2", paddingRight: 20, }} />}
                            />
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#000',
                                borderBottomWidth: 1,
                                paddingTop: 8,
                                marginRight: 15,
                                marginLeft: 15
                            }}
                        />
                    </View>
                )
            })
        } else {
            if(this.state.loading==false){
            arr.push(
                <ListItem
                    component={TouchableScale}
                    title={<Text style={{ paddingLeft: 10, color: '#23ABE2', fontSize: 20 }}>No Student Activity Found !</Text>}
                    rightIcon={<Icon name="users" style={{ fontSize: 20, color: "#23ABE2" }} />}
                />
            )
            }
        }
        return (
            <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: '#fff' }}>
                <ScrollView style={this.state.loading?{opacity:0.1}:{opacity:1}}>
                    <View style={styleData.referenceText}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}> Hello Parents! </Text>
                    </View>
                    <View style={{ marginBottom: 25 }}>
                        {arr}
                    </View>
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
            </View>
        )
    }
}
const styleData = StyleSheet.create({
    referenceText: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop:10
    },

    school_name: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingTop: 5
    },
})

export default Parents;