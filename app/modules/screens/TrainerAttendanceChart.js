import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet,TouchableOpacity, SectionList } from "react-native";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
import PureChart from 'react-native-pure-chart';
import DropDownPicker from 'react-native-dropdown-picker';

class TrainerAttendanceChart extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.studentsNames = [];
    this.state = {
      studentsNames:[],
      teacherName:null,
      actClassName:null,
      activityName:null,
      emptyMsg:null,
      loading: false
    };
  }

//  componentDidMount() {

//   }


  goBack = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "StudentListingActivitiesScreen",
    });
    this.props.navigation.dispatch(navigateAction);
  };


  render() {
    let sampleData = [
      {x: '2018-01-01', y: 1},
      {x: '2018-01-02', y: 2},
      {x: '2018-01-03', y: 3},
      {x: '2018-01-04', y: 5},
      {x: '2018-01-05', y: 24}
    ]

    return (
      <ScrollView style={styleData.screenContainer}>
        <View style={styleData.container}>
        <TouchableOpacity onPress={() =>  this.goBack()}>
          <Icon
            name="arrow-left"
            onPress={() => this.goBack()}
            style={{ fontSize: 18,padding:5}}
          />
          </TouchableOpacity>
          <View style={{flex: 1}}>
          <Text
            style={{ fontSize: 15,textAlign: 'right',fontWeight:'bold',marginRight: 15 }}
          >
            Thrainer Name
          </Text>
          </View>
        </View>
        {this.state.loading==false ?
        (<View>
          <TouchableOpacity
            onPress={() =>  this.goBack()}
            style={{ fontSize: 22, marginTop: 36, marginRight: 16, position: 'absolute', right: 0 }}
            >
            <Icon
            name="bar-chart"
            style={{ fontSize: 18, color: '#23ABE2', padding:5}}
          />
            </TouchableOpacity>
        </View>
        ):null}

        <View>
        


          <Text>Hello</Text>
          
          <View>
            <DropDownPicker
              items={[
                  {label: 'JUN', value: 'usa', hidden: true},
                  {label: 'JUL', value: 'uk'},
                  {label: 'AUG', value: 'france'},
              ]}
              containerStyle={{height: 40}}
              style={{backgroundColor: '#fafafa'}}
              itemStyle={{
                  justifyContent: 'flex-start'
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={item => this.setState({
                  country: item.value
              })}
          />  
          </View>

          <View>
          <PureChart data={sampleData} type='line' />
          </View>
          <Text>Teacher Name: </Text>
          <Text> Last Attendance: </Text>
          <Text>Location: </Text>
{/* 
          {this.state.loading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: "40%",
              }}
            >
              <Bubbles size={20} color="#1CAFF6" />
            </View>
          ) : null}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 65,
              marginBottom: 10,
            }}
          >
            {emptyMsg}
          </Text> */}
        </View>
      </ScrollView>
    );
  }
}

const styleData = StyleSheet.create({
  screenContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingLeft: 10,
    marginTop: 15,
    height:40,
    borderBottomWidth:2,
    borderColor:'#ddd',
  },
  activityText: {
    backgroundColor: "#F7F7F7",
    marginTop: 50,
    marginBottom: 10,
    marginRight: 15,
    marginLeft: 15,
    padding: 6,
  },
  listData: {
    marginTop: 0,
    padding: 0,
  },
  activityHeader: {
    marginTop: 10,
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
    borderStyle: "solid",
    borderColor: "#B0C043",
  },
});

export default TrainerAttendanceChart;
