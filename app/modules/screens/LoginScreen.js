import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    ScrollView,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';
import t from 'tcomb-form-native';
import { API_URL } from '../constants/config';
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import firebase from 'react-native-firebase';
const GenerateForm = t.form.Form;

class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state={
            loading:false,
            isButtonDisable:false,
            firebaseToken: ''
        }
        this.getfireToken()
    }

    async componentDidUpdate() {
        console.log("=========================== check login data ===========================")
        await AsyncStorage.getItem("@userData").then(
            (user) =>{

                if (user) {
                    let profile = JSON.parse(user);
                    Alert(profile);
                  }

            }, (err) =>{
              console.log("error",err)
            })
    }

    getfireToken = async() => {
        console.log("============================fire===================================")
        const firebaseToken = await firebase.messaging().getToken();
        this.setState({firebaseToken})
        console.log(firebaseToken)
        console.log("============================fire===================================")
        return firebaseToken;
    }

    login(device_id, token) {
        const formValues = this._form.getValue();
        this.setState({
            loading:true,
            isButtonDisable:true
        })
        if(formValues && formValues['phone_number']!=undefined  && formValues['password']!=undefined){
        fetch(`${API_URL}/save-user/${formValues['phone_number']}/${formValues['password']}/${device_id}`, {
	        method: 'GET',
	        headers: {
	            Accept: 'application/json',
	            'Content-Type': 'application/json',
	        }
	    }).then((res) => res.json()).then((response) => {
            const userdata =response['user'];
            console.log('yyyyyyyy',response)
	        if (response.status == 200) {
                console.log(token)
	            fetch(`${API_URL}/check-user/${formValues['phone_number']}/${formValues['password']}/${device_id}/${token}`, {
	                method: 'GET',
	                headers: {
	                    Accept: 'application/json',
	                    'Content-Type': 'application/json',
	                }
	            }).then((res) => res.json()).then((responsed) => {
                    this.setState({loading:false,isButtonDisable:false});
                    if (responsed.role == 'trainer') {
                       AsyncStorage.setItem('@userData', userdata.users_id);
                        AsyncStorage.setItem('@userRoll', userdata.role);
                        AsyncStorage.setItem('@teacher_id', userdata.teacher_id);
                        console.log("===========================login response==============================");
                        console.log("login - response =>",responsed);
                        console.log("===========================login response==============================");
                        const navigateAction = NavigationActions.navigate({
                            routeName: 'SchoolScreen',
                            params: {
                                rolval: userdata
                            }
                        });
                        this.props.navigation.dispatch(navigateAction);
                    } else if (responsed.role == 'admin') {
                        AsyncStorage.setItem('@userData', userdata.users_id);
						AsyncStorage.setItem('@userRoll', responsed.role);
                        const navigateAction = NavigationActions.navigate({
                            routeName: 'SchoolScreen',
                            params: {
                                rolval: userdata
                            }
                        });
                        this.props.navigation.dispatch(navigateAction);
                    } else if (responsed.role == 'principal') {
                        console.log("during login ======>>>>> ", responsed);
                        AsyncStorage.setItem('@userData', userdata.users_id);
                        AsyncStorage.setItem('@schoolId', responsed.school_id);
                        AsyncStorage.setItem('@userRoll', responsed.role);
                       const navigateAction = NavigationActions.navigate({
                            routeName: 'ActivitiesStatsScreen',
                            params: {
                                rolval: userdata,
                                schoolData:responsed
                            }
                        });
                        this.props.navigation.dispatch(navigateAction);
                    } 

                    else {
                        AsyncStorage.setItem('@userData', userdata.users_id);
                        AsyncStorage.setItem('@userDataForNotification', userdata);
                        AsyncStorage.setItem('@userRoll', responsed.role);
                        const navigateAction = NavigationActions.navigate({
                            routeName: 'Parents',
                            params: {
                                rolval: userdata
                            }
                        });
                        this.props.navigation.dispatch(navigateAction);
                    }
	                if (response.status == 404) {

	                }
	            }).catch((err) => alert(err))
	        } else {
                this.setState({loading:false,isButtonDisable:false});
	            this.showAlertMessage(response.message);
	        }
	    });
    } else {
        this.setState({loading:false,isButtonDisable:false});
    }
    }


    render() {
        const User = t.struct({
            phone_number: t.Number,
            password: t.String,
        });
        const formOptions = {
            fields: {
                phone_number: {
                    auto: 'placeholders',
                    error: 'Enter your phone',
                    phone_number: true,
                    placeholder: 'Enter your phone',
                    icon: 'ios-contact',
                    placeholderTextColor: '#333'
                },
                password: {
                    secureTextEntry: true,
                    auto: 'placeholders',
                    error: 'Enter your password',
                    password: true,
                    placeholder: 'Enter your password',
                    icon: 'ios-contact',
                    placeholderTextColor: '#333',

                }
            }
        };
        return (
            <View style={styles.container}>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={this.state.loading?{opacity:0.1}:{opacity:1}} >
                    <View style={styles.referenceText}>
                        <Text style={styles.welcomeText}> Welcome! </Text>
                        <Text style={styles.text}>Please enter your mobile number {"\n"} to access your account.</Text>
                    </View>
                    <View style={styles.box}>
                        <GenerateForm
                            ref={c => this._form = c} // assign a ref  
                            type={User}
                            options={formOptions}
                        />
                    </View> 
                    <View style={styles.box1}>
                        <TouchableOpacity disabled={this.state.isButtonDisable} style={styles.loginButton} onPress={() => this.login('fsdfjsbdfjsbfjk', this.state.firebaseToken)} >
                            <Text style={styles.loginText} > Login </Text>
                        </TouchableOpacity>
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
                        left:'45%'
                      }}
                    >
                      <Bubbles size={10} color="#1CAFF6" />
                    </View>
                  ) : null}  
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 5,
        height:'100%',
        width:'100%',
        backgroundColor: '#fff',
        //marginTop: 15,
    },
    box1: {
        paddingHorizontal: 10,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',

    },
    box: {
        padding: 20,
        marginTop: 20,
    },
    loginButton: {
        backgroundColor: "#23ABE2",
        width: '95%',
        padding: 10
    },
    loginText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
    },

    textStyle: {
        padding: 15,
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold'
    },
    referenceText: {
        // flex: .3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 15,
        marginBottom: 0,
        padding: 0,
    },
    welcomeText: {
        fontSize: 25,
        fontWeight: '600',
        color: '#4B4B4C',
        marginTop: 25,
        fontWeight: "bold"

    },
    text: {
        fontSize: 15,
        textAlign: 'center',
        color: '#4B4B4C',
        fontWeight: "bold"
    }
});

export default LoginScreen;
