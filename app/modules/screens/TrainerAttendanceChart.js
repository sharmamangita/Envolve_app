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
import {
  SlideAreaChart,
  SlideBarChart,
  SlideBarChartProps,
  SlideAreaChartProps,
  YAxisProps,
  XAxisProps,
  XAxisLabelAlignment,
  YAxisLabelAlignment,
  CursorProps,
  ToolTipProps,
  ToolTipTextRenderersInput,
  GradientProps,
} from 'react-native-slide-charts'

class TrainerAttendanceChart extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      teacherName: this.props.navigation.state.params.trainerName,
      teacher_id: this.props.navigation.state.params.trainer_id,
      threeMonthsLable:this.getLastThreeMonth(),
      attendance: '',
      apiResponseState:0,
      loading: true,
      
      attendanceData: [
        {
          "id": "21",
          "image": "",
          "latitude": "0",
          "longitude": "0",
          "school_id": "1",
          "update_at": "2021-01-14 11:25:09",
          "user_id": "6"
        }
      ],
      chartMonthwise: '',
      sampleData:'',
    };
  }

 async componentDidMount() {
    await this.setState({chartMonthwise: `${this.state.threeMonthsLable[0].year}-${this.state.threeMonthsLable[0].monthInNumber}`})
    await this.getTrainerAttendance();
    // await this.graph()   
  }

  getLastThreeMonth = () => {
    // console.log(this.state.attendanceData[0].update_at);
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                      ];
    let threemonths = []
    for(let i= 0; i < 3; i++){
      var d = new Date();
      d.setMonth(d.getMonth()-i)
      threemonths.push({
        year: d.getFullYear(),
        month: monthNames[d.getMonth()],
        monthInNumber: String(d.getMonth()).length == 2? d.getMonth() + 1 : `0${d.getMonth() + 1}`
      });
    }
    return threemonths;
    
  }

getTrainerAttendance = async () => {
    this.setState({ loading: true})
  await fetch(`${API_URL}/get-trainer-attendance-record/`, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          teacher_id: this.state.teacher_id
      }),
  }).then(response => response.json())
  .then(response => {
      this.setState({loading: false})
      console.log("Response ---> ", response.length);
      console.log(response);
      response.length != 0? this.setState({attendanceData: response, apiResponseState: 1}) : null;
  })
}


  goBack = () => {
    this.props.navigation.goBack(null)
    // const navigateAction = NavigationActions.navigate({
    //   routeName: "StudentListingActivitiesScreen",
    // });
    // this.props.navigation.dispatch(navigateAction);
  };

  graph = async () => {
    let XYData= this.state.attendanceData.map(d => ({ "x":d.update_at.slice(0, 10), "y": Number(d.update_at.slice(11, 16).replace(":","."))}));
    console.log("================>>>>>>",this.state.chartMonthwise)
    let sampleData = XYData.filter(xa => xa.x.slice(0,7) == this.state.chartMonthwise);
    await this.setState({sampleData})
    console.log("====================>>>>>>>>", this.state.sampleData);
  }

  render() {
    const markerSpacing = this.state.sampleData.length > 20 ? 2 : this.state.sampleData.length > 10 ? 1 : 0;
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
            {this.state.teacherName}
          </Text>
          </View>
        </View>

        <View>
          {!this.state.loading ? (
            
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
          <View style={{ width: "100%"}}>
            
            <DropDownPicker
              items={[
                  {
                    label: `${this.state.threeMonthsLable[0].month} - ${this.state.threeMonthsLable[0].year}`,
                    value: `${this.state.threeMonthsLable[0].year}-${this.state.threeMonthsLable[0].monthInNumber}`,
                    hidden: true
                  },
                  {
                    label: `${this.state.threeMonthsLable[1].month} - ${this.state.threeMonthsLable[1].year}`,
                    value: `${this.state.threeMonthsLable[1].year}-${this.state.threeMonthsLable[1].monthInNumber}`
                  },
                  {
                    label: `${this.state.threeMonthsLable[2].month} - ${this.state.threeMonthsLable[2].year}`,
                    value: `${this.state.threeMonthsLable[2].year}-${this.state.threeMonthsLable[2].monthInNumber}`
                  },
              ]}
              containerStyle={{height: 40}}
              style={{backgroundColor: '#fafafa'}}
              itemStyle={{
                  justifyContent: 'flex-start'
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              onChangeItem={ async item => {
                  await this.setState({chartMonthwise: item.value});
                  this.graph();
                }
              }
            />  
          </View>
              <View
                style={{
                  marginTop: "10%"
                }}
              >
                {/* <PureChart 
                  data={sampleData} 
                  type={'line'}
                  height={200}
                  /> */}

          <SlideBarChart
            scrollable
            selectionChangedCallback={() => Haptics.selectionAsync()}
            style={{ marginTop: 64 }}
            shouldCancelWhenOutside={false}
            data={this.state.sampleData}
            axisWidth={34}
            axisHeight={16}
            yAxisProps={{
              numberOfTicks: 4,
              axisLabel: '24-H',
              // axisLabelAlignment: 'aboveTicks',
            }}
            xAxisProps={{
              axisMarkerLabels: this.state.sampleData.map(item => item.x.toString()),
              specialEndMarker: 'Last',
              specialStartMarker: 'First',
              adjustForSpecialMarkers: true,
              markerSpacing,
              minimumSpacing: markerSpacing,
            }}
            toolTipProps={{
              lockTriangleCenter: true,
              toolTipTextRenderers: [
                ({ selectedBarNumber }) => ({
                  text: this.state.sampleData[selectedBarNumber]?this.state.sampleData[selectedBarNumber].y.toString().replace(".",":"): null,
                }),
                () => ({ text: 'Time' }),
              ],
            }}
          />


              </View>
              <View style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10%",
                marginBottom: 10,
              }}>
              <Text style={{
                fontSize: 16,
                fontWeight: "bold"}}>Teacher Name: {this.state.teacherName}</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: "bold"}}> Last Attendance: {this.state.apiResponseState == 1? this.state.attendanceData[0].update_at : "data is not available"}</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: "bold"}}>
                  Location: 
                  latitude: {this.state.attendanceData[0].latitude} - 
                  longitude: {this.state.attendanceData[0].longitude}
                  </Text>
              </View>

            </View>
          ) : 
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
          }
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
