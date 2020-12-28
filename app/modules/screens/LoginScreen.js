import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';
import t from 'tcomb-form-native';
import { API_URL } from '../constants/config';
const GenerateForm = t.form.Form;

class LoginScreen extends Component {

    constructor(props) {
        super(props);
    }

    login(device_id, token) {
        const formValues = this._form.getValue();
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
	            fetch(`${API_URL}/check-user/${formValues['phone_number']}/${formValues['password']}/${device_id}/${token}`, {
	                method: 'GET',
	                headers: {
	                    Accept: 'application/json',
	                    'Content-Type': 'application/json',
	                }
	            }).then((res) => res.json()).then((responsed) => {
                     //alert(JSON.stringify(responsed));
                     console.log('responsedresponsed',responsed)
                    if (responsed.role == 'trainer') {
                       AsyncStorage.setItem('@userData', userdata.users_id);
                        const navigateAction = NavigationActions.navigate({
                            routeName: 'SchoolScreen',
                            params: {
                                rolval: userdata
                            }
                        });
                        this.props.navigation.dispatch(navigateAction);
                    } else if (responsed.role == 'admin') {
                        AsyncStorage.setItem('@userData', userdata.users_id);
                        const navigateAction = NavigationActions.navigate({
                            routeName: 'SchoolScreen',
                            params: {
                                rolval: userdata
                            }
                        });
                        this.props.navigation.dispatch(navigateAction);
                    } else {
                        AsyncStorage.setItem('@userData', userdata.users_id);
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
	            this.showAlertMessage(response.message);

	        }
	    });
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
                    style={styles.scrollView} >
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
                        <TouchableOpacity style={styles.loginButton} onPress={() => this.login('fsdfjsbdfjsbfjk', 'fjkhfjhsdjfhsjk')} >
                            <Text style={styles.loginText} > Login </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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