import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import { Bubbles} from "react-native-loader";
import AsyncStorage from "@react-native-community/async-storage";

class ParentsDashboard extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: { height: 80 },
    };
  };

  constructor(props) {
    super(props);
    this.activitiesStudentsCount = [];
    this.state = {
      mobile_num:'',
      children_list:[],
      loading:false
    };
  }

  async componentDidMount(){
    await AsyncStorage.getItem("@mobile_num").then(
      (mobile_num) =>{
        this.setState({ mobile_num });
      }, (err) =>{
        console.log("error",err)
    });
    this.setState({
        loading: true
    });
    await fetch(`${API_URL}/get-parent-children-list/${this.state.mobile_num}`)
    .then((res) => res.json()).then((response) => {

      if (response.length > 0) {
          console.log(" childer list ========>>>", response)
          this.setState({ children_list: response, loading:false});
      } else {
          this.setState({children_list: [], loading: false});
      }
    }).catch((err) =>{
        this.setState({loading:false });
        alert(err);

    })
  }

  oldDashboard = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "Parents",
    });
    this.props.navigation.dispatch(navigateAction);
  }

  showChildernList = ({item}) => {
    return(
      <View style={styleData.cardContainer}>
        <View style={styleData.columnCard}>
          <TouchableOpacity onPress={()=> this.gotToStudentDashboard(item.student_id)} style={styleData.card}>
          <Icon color="#1CAFF6" size={40} name="archive" />
            <Text style={{...styleData.styleText, fontSize:18, fontWeight:'bold'}}>{ item.student_name }</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  gotToStudentDashboard = (id) => {
    const navigateAction = NavigationActions.navigate({
          routeName: 'StudentDashboard',
          params: {
            student_id: id
          }
        });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {

    return (
      <ScrollView style={styleData.screenContainer}>

        <View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              marginTop: 15,
              textAlign: "center",
            }}
          >
            {this.stateschoolName}
          </Text>
        </View>
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
          ) :

        <View>
          <View>
              <Text style={{ fontSize: 18, fontWeight:'bold',paddingHorizontal:20}}>
                  Parent Dashboard
              </Text>
          </View>
          
          <FlatList 
            data={this.state.children_list}
            keyExtractor={(item) => item.student_id}
            renderItem={this.showChildernList}
          />

          <View style={styleData.cardContainer}>
            <View style={styleData.columnCard}>
              <TouchableOpacity onPress={()=> this.oldDashboard()} style={styleData.card}>
                <Text style={styleData.styleText}>oldDashboard</Text>
              </TouchableOpacity>
            </View>
            <View style={styleData.columnCard}>
            </View>
          </View>

        </View>
      }
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
  cardContainer:{
    flex:1,
    flexDirection:'row',
    paddingHorizontal:10,
    marginTop:40
  },
  columnCard:{
    flex:1,
    flexDirection:'column',
    paddingHorizontal:9
  },
  rowSearchCard:{
    flex:1,
    flexDirection:'row',
    paddingHorizontal:9
  },
  card: {
    height:120,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    borderColor:'#23ABE2',
    padding:5,
    borderRadius:10,
    backgroundColor:'rgba(35, 171, 226, 0.2)',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width:4, height:4}
  },
  SearchCard:{
    flex:1,
    flexDirection:'row',
    height:40,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    borderColor: '#23ABE2',
    paddingStart:10,
    borderRadius:5,  
  },

  columnCardSearch:{
    flex:0.2,
    flexDirection:'column',
    paddingHorizontal:9
  },

  styleText:{
    textTransform:'uppercase',
    fontSize:12
  }

});

export default ParentsDashboard;
