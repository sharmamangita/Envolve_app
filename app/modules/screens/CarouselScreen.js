import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView ,TouchableOpacity, TouchableHighlight} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';
import Icons from 'react-native-vector-icons/FontAwesome';
import { TouchableItem } from 'react-native-tab-view';

class CarouselScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      carouselItems: [
        {
          id: 0,
          title: "Co-Curricular",
          text: "In this day and age, co-curricular activites are a must have for any child's holistic personnality development beyond academices.These are meat to bring about enhanced social and intellectual skills,integrate moral value through practical experience,and hone many facets of a child's character which may not be readily visible in a traditional classroom.",
        },
        {
          id: 1,
          title: "Spoken English",
          text: "In today's competitive world, India continues to grow as a nation primarilty because of the large english speaking populace. This has therefore become a must have base skill for any child's success professionally.",
        },
        {
          id: 2,
          title: "Mental Math",
          text: "Designed especially keeping competitive exams in mind, our carefully designed program helps in preparing the participants for a bright future. We provide Abacus activities for younger children and Vedic Math for older kids which not only keeps them motivated, but also sharpens analytical skills.",
        },
        {
          id: 3,
          title: "Whiz Kid",
          text: "There are several creative and practical ways to understand science and maybe even help find tomorrow's Einstein. Our whiz kid program enables the same with a myriad set of experiments outside the traditional teaching model.",
        },
        {
          id: 4,
          title: "Cricket",
          text: "Cricket almost a religion in india, also has several health benefits that accrue to if - one cket you needs to be fit and strong, have good hand-eys coordination and ball-handling skills.Along with building endurance and stamina it is also a great team sport helping a child social skills.",
        },
        {
          id: 5,
          title: "Football",
          text: "Participating in football-like any sport-provides many health benefits for children.It's a physically demanding game that provides an opportunity for players to improve their speed,agility,strength,hand-eys coordination and overall cardiovascular endurance.",
        },
        {
          id: 6,
          title: "Lawn Tennis",
          text: "Tennis is a sport that requires alertness, focus, and problem solving skills, as well as strategic and tactical thinking. For students who regularly play this sport, they are not just working out their muscles, but also their minds. With tennis, students will be able to enjoy a holistic development in both academic and extra-curricular aspects. At the same time, tennis fosters communication and coordination among players; allowing students to interact with each other on and off the court. Finally, it is also a healthy way to engage in some friendly competition among friends and classmates.",
        },
        {
          id: 7,
          title: "Skating",
          text: "Great as a cross training exercise: Roller skating is equivalent to jogging in term of health benefits and coloric consumption, reduction of body fat, and leg strength development.Roller skating helps bulid strenght,especially in the muscles of the lower body.Envolve India is pround to support few famous name in this arena.",
        },
        {
          id: 8,
          title: "Volleyball",
          text: "Tones and shapes the body:The physical activites involved in playing volleyball will strengthen the upper body,arms and shoulders as well as the muscles of the lower body.Playing volleyball also improves the cardiovascular and resiratory systems.",
        },
        {
          id: 9,
          title: "Basketball",
          text: "A fast moving sport, basketball helps greatly in building endurance,improving balance and coordination , and developing concentration and self decipline",
        },
        {
          id: 10,
          title: "Self Defence",
          text: "Increased self confidence: Training in self defense helps people, especially women, devlop more confidence in themselves and their surrounding.Knowin that you have the abiliy to defend yourself give you the confidence and freedom to fully explore the world, meet new people and find new ways to engage with others.",
        },
        {
          id: 11,
          title: "Foreign Language",
          text: "Studies show that learning a second language improves your memory.If you regularly exercise your memory,you can often remember sequences and lists better.Other cognitive benefits include better problem solving skills,better critical thinking skills,and better multi-tasking abilites.",
        },
        {
          id: 12,
          title: "Yoga",
          text: "Research over the past years has shown Yoga to have stress-relieving powers on students,paving the way for improved academic performance with the practice of asanas,meditation and breathing exercise.Students talked of decreased stress levels and being more at peace to study,resulting in an increase in academic scores as well",
        },
        {
          id: 13,
          title: "Music",
          text: "Music gives students a way to connect with people at a large.Children are naturally very social,and it's important to encourage them to build relationships by providing them experienes to share with each other.We teach instruments (Guitar,violin,drums and piano) as well as vocals",
        },
        {
          id: 14,
          title: "Dance",
          text: "When children are provided with creative movement problems that invole the slection of movement choices,they learn to think in the concrete reality of movement.Thus,learning the art of dance helps young children develop knownledge,skill and understanding about the world.Dance helps children develop literancy.We teach various dance forms such as Hip-Hop,freestyle,salsa,contemporary and regional dance as well.",
        },
        {
          id: 15,
          title: "Theatre",
          text: "The importance of drama and performing arts in education is significant.For example,drama students learn to approach situations in an array of different manners which can help to develop creative thinking and new study techniques.",
        },
        {
          id: 16,
          title: "Photography",
          text: "From familiarization with a camera, to recognizing certain object, colors and angles - photography teaches students to focus on the beautification of a moment, and is a much coveted career these day.",
        },
        {
          id: 17,
          title: "Art & Craft",
          text: "Children can express their feeling completly via the medium of art.Not just restricting them to painting,we provide means for forming objects via sculpting, pottery and origami.Creating art expands a child's ability to interact with the world around them, and provide a new set of skills for self-expression and communication.",
        },
        {
          id: 18,
          title: "Design",
          text: "A new program, enabling future designers to learn the art of fashion design, industrial design and graphic design",
        },

      ]
    }
     closeCarousel = () => {
        this.props.navigation.goBack(null)
    }
  }

  _renderItem({ item, index }) {
    //alert(index);
    return (
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 5,
        height: '90%',
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
        <View style={{ flexDirection: "row", alignItems: "flex-end", alignSelf: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => closeCarousel()}>
            <Text style={{ fontSize: 20, color: "#23ABE2" }}><Icons name="close" style={{ fontSize: 20, marginTop: 5, color: '#23ABE2' }} /></Text>
          </TouchableOpacity>
        </View>
				
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 20, color: "#23ABE2" }}>{item.title}</Text>
        </View>
        <Text style={{ fontSize: 15, marginTop: 10, letterSpacing: 0.9, lineHeight: 25, }}>{item.text}</Text>
      </View>

    )
  }
  render() {
       const { params } = this.props.navigation.state;
       let carouselVal=0; 
        if (params.data !=undefined && params.data) {
           carouselVal = params.data;
        }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', paddingTop: 30 }}>
			
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
				<TouchableOpacity
					onPress={
					 () => this.carousel._snapToItem(this.state.activeIndex-1)
					}
					>
					<Text style={{ fontSize: 30, color: "#23ABE2", marginTop: 150 }}>
						<Icons name="angle-left" style={{ fontSize: 30, marginTop: 10, color: '#23ABE2' }} />
					</Text>
				</TouchableOpacity>
          <Carousel
            layout={"2"}
            ref={ref => this.carousel = ref}
            data={this.state.carouselItems}
            sliderWidth={300}
            itemWidth={350}
            renderItem={this._renderItem}
            currentIndex={carouselVal}
            activeSlideOffset={carouselVal}
            firstItem={carouselVal}
            onSnapToItem={index => this.setState({ activeIndex: index })} />
				
				<TouchableOpacity
					onPress={
					 () => this.carousel._snapToItem(this.state.activeIndex+1)
					}
					>
					<Text style={{ fontSize: 30, color: "#23ABE2", marginTop: 150}}>
						<Icons name="angle-right" style={{ fontSize: 30, marginTop: 10, color: '#23ABE2' }} />
					</Text>
				</TouchableOpacity>
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
