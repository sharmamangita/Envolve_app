import React, { Component } from 'react';
import { ScrollView, Image, View, Text, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';


class StudentProfile extends Component {

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
            statusVal: []
        };

    }

    goBack = () => {
        const navigateAction = NavigationActions.navigate({
            routeName: 'Parents',
        });
        this.props.navigation.dispatch(navigateAction);

    }


    componentWillMount() {
        const { state, navigate } = this.props.navigation;
        this.setState({
            activity_id: state.params.activityData.activity_id,
        });
    }


    render() {
        const Present = <Text style={{ textAlign: 'center', marginTop: 10 }}>Present</Text>;
        const Absent = <Text style={{ textAlign: 'center', marginTop: 10, color: '#FF0000' }}>Absent</Text>;
        const { state, navigate } = this.props.navigation;

        return (
            <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: '#fff' }}>
                <ScrollView>
                    <View style={styleData.outercontainer}>
                        <Icon name="chevron-left" onPress={() => this.goBack()} style={{ fontSize: 22, color: '#23ABE2', marginTop: 8 }} />
                        <Text onPress={() => this.goBack()} style={{ fontSize: 25, fontColor: "#000", fontWeight: 'bold', marginLeft: 10 }}>{state.params.activityData.student_name}</Text>
                    </View>
                    <View style={{ backgroundColor: '#F7F7F7', marginTop: 50, marginBottom: 10, marginRight: 15, marginLeft: 15, padding: 6 }}>
                        <Text style={{ fontSize: 22, fontWeight: "bold", fontColor: "#4B4B4C", }}> {state.params.activityData.school_name}
                            <Text style={{ fontSize: 18, fontColor: "#4B4B4C", }}>-{state.params.activityData.school_address}</Text>
                        </Text>
                    </View>

                    <View style={styleData.row}>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Admission Name</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Class</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Section</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={styleData.tableTextData}>Activity Name</Text></View>
                    </View>
                    <View style={{
                        flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: -36, marginLeft: 10,
                        marginRight: 10
                    }}>
                        <View style={[styleData.box, styleData.box2]}><Text style={{ textAlign: 'center', marginTop: 12, fontWeight: 'bold' }}>{state.params.activityData.admission_number}</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={{ textAlign: 'center', marginTop: 12, fontWeight: 'bold' }}>{state.params.activityData.class}</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={{ textAlign: 'center', marginTop: 12, fontWeight: 'bold' }}>{state.params.activityData.section}</Text></View>
                        <View style={[styleData.box, styleData.box2]}><Text style={{ textAlign: 'center', marginTop: 12, fontWeight: 'bold' }}>{state.params.activityData.activity_name}</Text></View>
                    </View>
                </ScrollView>
            </View>
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


export default StudentProfile;