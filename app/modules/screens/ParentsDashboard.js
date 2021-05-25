import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { ListItem } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationActions } from "react-navigation";
import { API_URL } from "../constants/config";
import { Bubbles, DoubleBounce, Bars, Pulse } from "react-native-loader";
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
      activitiesStudentsCount: [],
      value1: "",
      gotImage: 0,
      schoolName: "temparey school name",
      navparams: [],
      school_id:null,
      loading:false
    };
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
          ) : null}
        <View>
            <Text style={{ fontSize: 18, fontWeight:'bold',paddingHorizontal:20}}>
                {this.state.schoolName}
            </Text>
        </View>

        <View style={{...styleData.cardContainer, marginTop:25}}>
        <View style={styleData.columnCardSearch}>
          </View>
          <View style={styleData.SearchCard}>
              <TextInput
              keyboardType="number-pad"
              placeholder="Search Student by Admission No."
              placeholderTextColor="black"
              style={{width:"85%", height:40}}
              />
              <TouchableOpacity style={
                {
                  height:40,
                  width:"15%",
                  justifyContent:'center',
                  alignItems:'center'
                }}>
              <Icon 
              name="search"
              size={20}
              color='#23ABE2'
              />
              </TouchableOpacity>
          </View>
        </View>

        <View style={styleData.cardContainer}>
          <View style={styleData.columnCard}>
            <TouchableOpacity style={styleData.card}>
              <Text style={styleData.styleText}>school attendance</Text>
            </TouchableOpacity>
          </View>
          <View style={styleData.columnCard}>
            <TouchableOpacity style={styleData.card}>
              <Text style={styleData.styleText}>teachers attendance</Text>
            </TouchableOpacity>
          </View>
          <View style={styleData.columnCard}>
            <TouchableOpacity style={styleData.card}>
              <Text style={styleData.styleText}>fees paid</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styleData.cardContainer}>
          <View style={styleData.columnCard}>
            <TouchableOpacity style={styleData.card}>
              <Text style={styleData.styleText}>performance</Text>
            </TouchableOpacity>
          </View>
          <View style={styleData.columnCard}>
            <TouchableOpacity style={styleData.card}>
              <Text style={styleData.styleText}>cctv's</Text>
            </TouchableOpacity>
          </View>
          <View style={styleData.columnCard}>
            <TouchableOpacity style={styleData.card}>
              <Text style={styleData.styleText}>substitutes data</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styleData.cardContainer}>
          <View style={styleData.columnCard}>
            <TouchableOpacity style={styleData.card}>
              <Text style={styleData.styleText}>broadcast (Communications)</Text>
            </TouchableOpacity>
          </View>
          <View style={styleData.columnCard}>
            <TouchableOpacity style={styleData.card}>
              <Text style={styleData.styleText}>pay bills</Text>
            </TouchableOpacity>
          </View>
          <View style={styleData.columnCard}>
            <TouchableOpacity style={styleData.card}>
              <Text style={styleData.styleText}>expenses</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styleData.cardContainer}>
          <View style={styleData.columnCard}>
            <TouchableOpacity style={styleData.card}>
              <Text style={styleData.styleText}>total cash in hand</Text>
            </TouchableOpacity>
          </View>
          <View style={styleData.columnCard}>
            <TouchableOpacity style={styleData.card}>
              <Text style={styleData.styleText}>tax returns</Text>
            </TouchableOpacity>
          </View>
          <View style={styleData.columnCard}>
          </View>
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
    height:60,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    borderColor:'#23ABE2',
    padding:5
  },
  SearchCard:{
    flex:1,
    flexDirection:'row',
    height:40,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    borderColor:'#c3c3c3',
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
