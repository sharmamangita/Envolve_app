/*Example of Expandable ListView in React Native*/
import React, { Component } from 'react';
//import react in our project
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';
//import basic react native components
import { NavigationActions } from 'react-navigation';
import { API_URL } from '../constants/config';

class ExpandableItemComponent extends Component {
  //Custom Component for the Expandable List
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
    };
  }

  getLoginPage = () => {
   //alert('ehhre');
  // navigation.closeDrawer();
    const navigateAction = NavigationActions.navigate({
        routeName: 'CarouselScreen'
    });
    this.props.navigation.dispatch(navigateAction);
   };
  componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }

    // componentDidMount() {
    //   fetch(`${API_URL}/new-activities/`).then((res) => res.json()).then((response) => {
    //       if (response.length > 0) {
    //           this.setState({ listDataSource: response });
    //       }
    //   }).catch((err) => alert(err))
    // }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }
  


 
  render() {
    return (
      <View>
        {/*Header of the Expandable List Item*/}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={styles.header}>

          <Text style={styles.headerText}>{this.props.item.category_name}</Text>
        </TouchableOpacity>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: 'hidden',
          }}>
          {/*Content under the header of the Expandable List Item*/}
          {this.props.item.subcategory.map((item, key) => (
            <TouchableOpacity
              key={key}
              style={styles.content}
              onPress={() =>this.getLoginPage()}>
              <Text style={styles.text}>
                {item.val}
              </Text>
              <View style={styles.separator} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

export default ExpandableItemComponent;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:500,
    // paddingTop: 30,
    backgroundColor: '#fff',
  },
  topHeading: {
    paddingLeft: 20,
    fontSize: 20,
  },
  header: {
  //  height:'60%',
    backgroundColor: '#fff',
    padding: 10,
    marginLeft:35
  },
  headerText: {
    color: '#23ABE2',
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
   // height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },
  content: {
    paddingLeft: 40,
    //paddingRight: 10,
    backgroundColor: '#fff',
  },
    menuItemIcon: {
    marginRight: 10,
   // marginLeft: 20,
    marginTop:10
  },
});
 
//Dummy content to show
//You can also use dynamic data by calling webservice
const CONTENT = [
  {
    isExpanded: false,
    category_name: 'Summary',
    subcategory: [{ id: 1, val: 'Co-Curricular' }],
  },
  {
    isExpanded: false,
    category_name: 'Cram School',
    subcategory: [
    { id: 2, val: 'Spoken English' }, { id: 3, val: 'Mental Math'}, { id: 4, val: 'Whiz Kid'}],
  },
    {
    isExpanded: false,
    category_name: 'Outdoor Activities',
    subcategory: [{ id: 5, val: 'Cricket' }, { id: 6, val: 'Football'},{ id: 7, val: 'Lawn Tennis'},{ id: 8, val: 'Skating'},{ id: 9, val: 'Volleyball'},{ id: 10, val: 'Basketball'}],
  },
    {
    isExpanded: false,
    category_name: 'Lifestyle Activities',
    subcategory: [{ id: 11, val: 'Self Defence' }, { id: 12, val: 'Foreign Language'},{ id: 13, val: 'Yoga'}],
  },
   {
    isExpanded: false,
    category_name: 'Performing Arts',
    subcategory: [{ id: 14, val: 'Music' }, { id: 15, val: 'Dance'}, { id: 16, val: 'Theatre'}],
  },
    {
    isExpanded: false,
    category_name: 'Creative Arts',
    subcategory: [{ id: 17, val: 'Photography' }, { id: 18, val: 'Art & Craft'},{ id: 19, val: 'Design'}],
  }
];

