import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { ListItem, Avatar } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_URL } from '../constants/config';
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import { List } from 'react-native-paper';
import { Alert } from 'react-native';
import { forEach } from 'lodash';

class Parents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schools: [],
            Api_url: '',
            roleval: Object.assign({}, this.props.navigation.state.params),
            navparams: '',
            expanded: false,
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

            if (response.length > 0) {
                console.log("student-activities ========>>>", response)
                this.setState({ schools: response,loading:false});
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
            console.log("get-students-attendance =======>>", response)
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
    
    // experiment
    listbody = () => {
        if(this.state.schools != ''){
            let arr = []
            console.log("======================================77==========================")
            let listwise = [...new Set(this.state.schools.map(x => x.student_id))];
            listwise.map(x =>{
                let name  = this.state.schools.filter(name => name.student_id == x );
                arr.push(<List.Accordion
                title={name[0].student_name}
                left={props => <List.Icon {...props} icon="folder" />}>
                    {this.listdata(x)}
                    
                </List.Accordion>)
            });
            return arr;
        }
    }
    listdata = (id) => {
            let list = []
            for (let studentObject of this.state.schools) {
                if(id == studentObject.student_id){
                    list.push(<List.Item 
                        title={`${studentObject.school_name} | ${studentObject.activity_name}`} 
                        onPress={() => this.getStudents(studentObject) }
                        />)
                }
            }
            return list;

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
                        {/* {arr} */}

                        { this.listbody() }

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