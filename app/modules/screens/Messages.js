import React, { Component } from 'react';
import { ScrollView, Image, StyleSheet, Text, View} from 'react-native';
import { Button, Spinner, Card, CardItem, Body, Left, Right } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { API_URL } from '../constants/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import { shadow } from 'react-native-paper';

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            miniLoading: false,
            inbox: true,
        }

    }

    componentDidMount() {
    }

    inbox = () => {
        this.setState({ inbox: true });
    }

    sent = () => {
        this.setState({ inbox: false });
    }

    OpenHWAC = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: "HomeWorkAndComplaint",
          });
          this.props.navigation.dispatch(navigateAction);
    }


    render() {
        return (
            <View style={styleData.body}>
             
                <View style={styleData.section1}>
                    
                    <View style={{flexDirection:'row', marginTop: 20}}>
                        <View style={{flex: 9, alignSelf:'flex-start'}}>
                            <Text style={{fontSize: 18, fontWeight:'bold'}}>Messages</Text>
                            <Text style={{fontSize: 14,}}>School Name will come here </Text>
                        </View>
                        <View style={{alignSelf:'flex-end'}}>
                            <Button style={styleData.addButton} onPress={()=> this.OpenHWAC()}>
                                <Icon name='plus' size={20} color="#fff" />
                            </Button>
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
                    <View style={{ width:"100%", alignItems:'center', marginBottom: 20}}>
                        <Text>--------------- April 05, Monday ---------------</Text>
                        <View style={{width:'100%', marginTop: 5, borderRadius: 5, borderColor: '#afafaf', borderWidth: 1, padding: 1}}>
                            <View>
                                <CardItem>
                                    <Left>
                                        <Text style={{ textDecorationLine: 'underline'}}>NativeBase</Text>
                                    </Left>
                                    <Right>
                                        <Text style={{ fontStyle: 'italic'}}>Ms Jyoti, 10:00am</Text>
                                    </Right>
                                </CardItem>
                                <CardItem style={{ paddingTop: 0, paddingBottom:0}}>
                                    <Body>
                                        <Text>
                                            Message from Parent will display here. Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
                                        </Text>
                                    </Body>
                                </CardItem>
                                <CardItem footer>
                                    <Left></Left>
                                    <Right>
                                        <Text style={{ textDecorationLine: 'underline'}}><Icon name="paperclip"/> NativeBase</Text>
                                    </Right>
                                </CardItem>
                            </View>
                            <View style={{ borderTopWidth: 1, width: '96%', alignSelf: 'center', borderColor: '#afafaf' }}></View>
                            <View>
                                <CardItem>
                                    <Left>
                                        <Text style={{ textDecorationLine: 'underline'}}>NativeBase</Text>
                                    </Left>
                                    <Right>
                                        <Text style={{ fontStyle: 'italic'}}>Ms Jyoti, 10:00am</Text>
                                    </Right>
                                </CardItem>
                                <CardItem style={{ paddingTop: 0, paddingBottom:0}}>
                                    <Body>
                                        <Text>
                                            Message from Parent will display here. Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
                                        </Text>
                                    </Body>
                                </CardItem>
                                <CardItem footer >
                                    <Left></Left>
                                    <Right>
                                        {/* <Text style={{ textDecorationLine: 'underline'}}>NativeBase</Text> */}
                                    </Right>
                                </CardItem>
                            </View>
                        </View>
                    </View>
                    :
                    <View style={{ width:"100%", alignItems:'center', marginBottom: 20}}>
                        <Text>--------------- April 06, Monday ---------------</Text>
                        <View style={{width:'100%', marginTop: 5, borderRadius: 5, borderColor: '#afafaf', borderWidth: 1, padding: 1}}>
                            <View>
                                <CardItem>
                                    <Body>
                                        <Text style={{ textDecorationLine: 'underline', color: '#1CAFF6'}}>NativeBase</Text>
                                        <Text style={{ fontStyle: 'italic', color: '#1CAFF6'}}>Ms Jyoti, 10:00am</Text>
                                    </Body>
                                </CardItem>
                                <CardItem style={{ paddingTop: 0, paddingBottom:0}}>
                                    <Body>
                                        <Text>
                                            Message from Parent will display here. Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
                                        </Text>
                                    </Body>
                                </CardItem>
                                <CardItem footer>
                                    <Left></Left>
                                    <Right>
                                    <Text style={{ textDecorationLine: 'underline'}}><Icon name="paperclip"/> NativeBase</Text>
                                    </Right>
                                </CardItem>
                            </View>
                            <View style={{ borderTopWidth: 1, width: '96%', alignSelf: 'center', borderColor: '#afafaf' }}></View>
                            <View>
                                <CardItem>
                                    <Body>
                                        <Text style={{ textDecorationLine: 'underline', color: '#1CAFF6'}}>NativeBase</Text>
                                        <Text style={{ fontStyle: 'italic', color: '#1CAFF6'}}>Ms Jyoti, 10:00am</Text>
                                    </Body>
                                </CardItem>
                                <CardItem style={{ paddingTop: 0, paddingBottom:0}}>
                                    <Body>
                                        <Text>
                                            Message from Parent will display here. Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
                                        </Text>
                                    </Body>
                                </CardItem>
                                <CardItem footer>
                                    <Left></Left>
                                    <Right>
                                    <Text style={{ textDecorationLine: 'underline'}}><Icon name="paperclip"/> NativeBase</Text>
                                    </Right>
                                </CardItem>
                            </View>
                        </View>
                    </View>


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
        height: 120,
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
