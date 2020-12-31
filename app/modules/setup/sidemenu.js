import React, { useEffect, useState } from 'react';
// Import required components
import {
  SafeAreaView,
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
const ExpandableComponent = ({ item, onClickFunction, navigation }) => {
  //Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
   
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);


  goBack = (data) => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'CarouselScreen',
      params: {
        data: data
      }
    });
    navigation.dispatch(navigateAction);
    navigation.closeDrawer();
  }

  
  return (
    <View>
      {/*Header of the Expandable List Item*/}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClickFunction}
        style={styles.header}>
        <Text style={styles.headerText}>
          {item.category_name}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: layoutHeight,
          overflow: 'hidden',
        }}>
        {/*Content under the header of the Expandable List Item*/}
        {item.subcategory.map((item, key) => (
          <TouchableOpacity
            key={key}
            style={styles.content}
            onPress={
              () => goBack(item.id)
            }>
            <Text style={styles.text}>
              {item.val}
            </Text>
            <View style={styles.separator} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const App = ({ navigation }) => {
  const [listDataSource, setListDataSource] = useState(CONTENT);
  const [multiSelect, setMultiSelect] = useState(false);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listDataSource];
    if (multiSelect) {
      // If multiple select is enabled
      array[index]['isExpanded'] = !array[index]['isExpanded'];
    } else {
      // If single select is enabled
      array.map((value, placeindex) =>
        placeindex === index
          ? (array[placeindex]['isExpanded'] =
            !array[placeindex]['isExpanded'])
          : (array[placeindex]['isExpanded'] = false),
      );
    }
    setListDataSource(array);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {listDataSource.map((item, key) => (
          <ExpandableComponent
            key={item.category_name}
            navigation={navigation}
            onClickFunction={() => {
              updateLayout(key);
            }}
            item={item}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 500,
    backgroundColor: '#fff',
  },
  titleText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginLeft: 25
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 0.5,
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
    paddingLeft: 50,
    //paddingRight: 10,
    backgroundColor: '#fff',
  },
});

//Dummy content to show
//You can also use dynamic data by calling webservice
const CONTENT = [
  {
    isExpanded: false,
    category_name: 'Summary',
    subcategory: [{ id: 0, val: 'Co-Curricular' }],
  },
  {
    isExpanded: false,
    category_name: 'Cram School',
    subcategory: [
      { id: 1, val: 'Spoken English' }, { id: 2, val: 'Mental Math' }, { id: 3, val: 'Whiz Kid' }],
  },
  {
    isExpanded: false,
    category_name: 'Outdoor Activities',
    subcategory: [{ id: 4, val: 'Cricket' }, { id: 5, val: 'Football' }, { id: 6, val: 'Lawn Tennis' }, { id: 7, val: 'Skating' }, { id: 8, val: 'Volleyball' }, { id: 9, val: 'Basketball' }],
  },
  {
    isExpanded: false,
    category_name: 'Lifestyle Activities',
    subcategory: [{ id: 10, val: 'Self Defence' }, { id: 11, val: 'Foreign Language' }, { id: 12, val: 'Yoga' }],
  },
  {
    isExpanded: false,
    category_name: 'Performing Arts',
    subcategory: [{ id: 13, val: 'Music' }, { id: 14, val: 'Dance' }, { id: 15, val: 'Theatre' }],
  },
  {
    isExpanded: false,
    category_name: 'Creative Arts',
    subcategory: [{ id: 16, val: 'Photography' }, { id: 17, val: 'Art & Craft' }, { id: 18, val: 'Design' }],
  }
];