import React, { Component } from 'react';
import { ScrollView, Image, StyleSheet, Text, View, Button } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { NavigationActions } from 'react-navigation';
import { API_URL } from '../constants/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import TrainerAttendance from './TrainerAttendance';
import { Button as Buttons } from 'native-base';
import AsyncStorage from "@react-native-community/async-storage";

class SchoolScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schools: [],
            value: '',
            roleval: '',
            navparams: '',
            teacher_id: '',
            mobile_num:'',
            loading: false,
        }

    }

    async componentDidMount() {
        this.setState({
            loading: true
        })

        await AsyncStorage.getItem("@teacher_id").then(
            (teacher_id) =>{
              this.setState({ teacher_id });
            }, (err) =>{
              console.log("error",err)
        })

        await AsyncStorage.getItem("@mobile_num").then(
            (mobile_num) =>{
              this.setState({ mobile_num });
            }, (err) =>{
              console.log("error",err)
        })

        // =============================== 
        await fetch(`${API_URL}/get-user-data/${this.state.mobile_num}`).then((res) => res.json()).then((response) =>{
            if(response.role) {
                this.setState({roleval: response});
            } else {
                this.setState({
                    loading: false
                });
            }
        }).catch((err) => {
            this.setState({
                loading: false
            });
            alert(err);
        })
        console.log("========****************************************************************=======");
console.log(this.state.roleval)
        console.log("========****************************************************************=======");

        // ===============================

        var teacher_id = JSON.stringify(this.state.teacher_id)
        var users_id = JSON.stringify(this.state.roleval.user_id)
        var teacher = teacher_id.replace(/^"|"$/g, '');
        var users = users_id.replace(/^"|"$/g, '');
        await fetch(`${API_URL}/list-schools/${teacher}/${users}`).then((res) => res.json()).then((response) => {
            if (response.length > 0) {
                this.setState({ schools: response,loading:false });
            } else {
                this.setState({
                    loading: false
                });
            }
        }).catch((err) => {
            this.setState({
                loading: false
            });
            alert(err);
        })
    }

    getData = (val, schoolData) => {
        var navparams = {
            teacher_id: this.state.teacher_id,
            role: this.state.roleval.role
        }

        this.setState({
            loading: true
        });
        var teacher_id = JSON.stringify(this.state.teacher_id)
        var users_id = JSON.stringify(this.state.roleval.user_id)
        var teacher = teacher_id.replace(/^"|"$/g, '');
        var users = users_id.replace(/^"|"$/g, '');
        //let url = `${API_URL}/get-activities/${teacher}/${val}/${users}`;
        fetch(`${API_URL}/get-activities/${teacher}/${val}/${users}`, {
            method: 'GET'
        }).then((res) => res.json()).then((response) => {
            this.setState({ value: response,loading:false });
           const navigateAction = NavigationActions.navigate({
                routeName: 'ActivitiesScreen',
                params: {
                    activities: response,
                    schoolData: schoolData,
                    navparams: navparams
                }
            });
            this.props.navigation.dispatch(navigateAction);
        }).catch((err) => alert(err))
    }

    render() {
        var viewbtton = [];
        var teacher_name = this.state.roleval.teacher_name
        
        console.log("===========================------------==========================")

        console.log("===========================------------==========================")

        var admin_role = this.state.roleval.role;
        if (teacher_name != "" && teacher_name != undefined) {
            var teachername = teacher_name.replace(/^"|"$/g, '');;
            teacher_name = <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Hey {teachername}</Text>
        }
        else {
            teacher_name = <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Hey user!</Text>
        }
        if (admin_role == 'admin') {
            viewbtton = <Buttons
                onPress={() =>
                    this.props.navigation.navigate('TrainerAttendance')
                }
                style={{
                    borderRadius:0,
                    color:"#23ABE2",
                    width:"100%",
                    justifyContent:'center',
                    height:55
                }}
                >
                <Text style={{color:"#fff", fontWeight:'bold'}}>Trainer Attendance</Text>
            </Buttons>
        }
        var arr = [];
        if (this.state.schools != '') {
            console.log("=========================== school ========================");
            console.log(this.state.schools)
            console.log("===========================================================");
            this.state.schools.map((item) => {

                arr.push(
                    <ListItem onPress={() => this.getData(item.school_id, item)}
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
                        title={<Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 20, paddingTop: 5 }}>{item.school_name}</Text>}
                        subtitle={
                            <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 5 }}>
                                <Text style={{ paddingLeft: 10, color: 'grey', fontSize: 20 }}>{item.school_address}</Text>
                            </View>
                        }
                        chevron
                    /> 
                )
            })
        } else {
            if(this.state.loading==false){
                arr.push(
                    <ListItem
                        component={TouchableScale}
                        title={<Text style={{ paddingLeft: 10, color: '#23ABE2', fontSize: 20 }}>No School Found</Text>}
                        rightIcon={<Icon name="users" style={{ fontSize: 20, color: "#23ABE2" }} />}
                    />
                )     
            }
        }
        return (
            <View style={{ flex: 1,height:'100%',width:'100%',backgroundColor:'#fff' }}>
             

                <ScrollView style={this.state.loading?{opacity:0.1}:{opacity:1}}>
                    <View style={styleData.referenceText}>
                        <Text style={{ fontSize: 20 }}>{teacher_name}</Text>
                    </View>

                    <View style={{ marginBottom: 25 }}>
                        {arr}
                    </View>
                </ScrollView>

                <View style={styleData.Button} >
                    {viewbtton}
                </View>
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
        );
    }
}

const styleData = StyleSheet.create({
    referenceText: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 15,
       // marginBottom: 2,
        padding: 0,
    },
    listData: {
        marginTop: 0,
        padding: 0
    },
    Button: {
        backgroundColor: '#23ABE2',
        alignItems: 'center',
    }
})

export default SchoolScreen;
