import React, { Component } from 'react';
import { StyleSheet, View, Text, Image,SafeAreaView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';

class CarouselScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeIndex:0,
      carouselItems: [
      {
          title:"LAWN TENNIS",
          text: "Tennis is a sport that requires alertness, focus, and problem solving skills, as well as strategic and tactical thinking. For students who regularly play this sport, they are not just working out their muscles, but also their minds. With tennis, students will be able to enjoy a holistic development in both academic and extra-curricular aspects. At the same time, tennis fosters communication and coordination among players; allowing students to interact with each other on and off the court. Finally, it is also a healthy way to engage in some friendly competition among friends and classmates.",
      },
      {
          title:"Cricket",
          text: "Cricket is a very famous game. It can be played by men, women and children of all ages. It is an outdoor game which requires a bat, ball and stumps. It is usually played on a field by two teams and the team that scores more runs, wins the game. Umpires are also present to give a fair decision and stop arguments.",
      },
      {
          title:"Dance",
          text: "A lot of people love to dance. Dancing is very enjoyable. It also provides a healthy exercise. There are many types of challenging dances. Dancing is also a way to express or communicate personal feelings usually happiness and excitement. Dance can also have other meaning and purposes. For example, Indian dance has a specific purpose. When there is drought, people perform a dance called the “rain dance” this is believed to bring rain. Dance is passed down from generation to generation.",
      },
      {
          title:"Football",
          text: "When talking about the world’s most popular games, football tops the list. Every year we witness several football tournaments, which gives us the best adrenaline rush of our lives. It is exciting to see players and teams from various nations play against each other enthusiastically.The ones who play the games and watch the game have an equally high level of enthusiasm. We have given below a few paragraphs on football, which can be used by kids, students, and children belonging to different age groups.",
      },
      
    ]
  }
}

_renderItem({item,index}){
    return (
      <View style={{
          backgroundColor:'#fff',
          borderRadius: 5,
          height:'90%',
          padding: 20,
          borderColor: "red",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,
          elevation: 14,
          marginLeft: 25,
         // marginRight: 20, 
        }}>
         <View style={{ flexDirection: "row"}}>
        <Text style={{fontSize: 20,color:"#23ABE2", textAlign: 'right',}}>X</Text>
        <Text style={{fontSize: 20,color:"#23ABE2"}}>{item.title}</Text>
        </View> 
        <Text  style={{fontSize: 15 ,marginTop:10,letterSpacing:0.9,lineHeight: 25,}}>{item.text}</Text>
      </View>

    )
}
render() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor:'#fff',justifyContent: 'center',paddingTop:30 }}>
      <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
          <Carousel
            layout={"default"}
            ref={ref => this.carousel = ref}
            data={this.state.carouselItems}
            sliderWidth={300}
            itemWidth={370}
            renderItem={this._renderItem}
            onSnapToItem = { index => this.setState({activeIndex:index}) } />
      </View>
    </SafeAreaView>
  );
}
}

const styles = StyleSheet.create({
  getbutton: {
    fontSize: 20,
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',

  },
  button: {

    height: 45,
    backgroundColor: '#CCCC33',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom: 25
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default CarouselScreen;
