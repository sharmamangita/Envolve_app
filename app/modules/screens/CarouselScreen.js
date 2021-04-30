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
      carouselItems:[] 
    }

  }

  _renderItem({ item, index }) {
    var that = this;
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
        marginLeft: 0,
         paddingRight: 20, 
      }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 20, color: "#23ABE2" }}>{item.title}</Text>
        </View>
        <Text style={{ fontSize: 15, marginTop: 10, letterSpacing: 0.9, lineHeight: 25, }}>{item.text}</Text>
      </View>

    )
  }

_handlePress(){
  this.props.navigation.goBack(null)
}

   componentWillMount(){
    const { params } = this.props.navigation.state;
    this.setState({
      carouselItems:params.carouselitems
    })
    
  }
  render() {
       const { params } = this.props.navigation.state;
       let carouselVal=0; 
        if (params.data !=undefined && params.data) {
           carouselVal = params.data;
        }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', paddingTop: 30 }}>
			 
        <View style={{flexDirection: "row", alignItems: "flex-end", alignSelf: 'flex-end',marginRight:15,zIndex:999 }}>
          <TouchableOpacity
            onPress={() => this._handlePress()}>
            <Text style={{ fontSize: 20, color: "#23ABE2" }}><Icons name="close" style={{ fontSize: 20, marginTop: 5, color: '#23ABE2' }} /></Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
				<TouchableOpacity
					onPress={
					 () => this.carousel._snapToItem(this.state.activeIndex-1)
					}
					>
					<Text style={{ fontSize: 30, color: "#23ABE2", marginTop: 200, marginLeft:0 }}>
						<Icons name="angle-double-left" style={{ fontSize: 30, marginTop: 10, color: '#23ABE2' }} />
					</Text>
				</TouchableOpacity>
          <Carousel
            layout={"2"}
            ref={ref => this.carousel = ref}
            data={this.state.carouselItems}
            sliderWidth={300}
            itemWidth={340}
            renderItem={this._renderItem}
            // currentIndex={carouselVal}
            inactiveSlideShift={0}
            _onPressCarousel 
            currentIndex={carouselVal}
            activeSlideOffset={carouselVal}
            firstItem={carouselVal}
            onSnapToItem={index => this.setState({ activeIndex: index })} 
            useScrollView={true}
            />
				
				<TouchableOpacity
					onPress={
					 () => this.carousel._snapToItem(this.state.activeIndex+1)
					}
					>
					<Text style={{ fontSize: 30, color: "#23ABE2", marginTop: 200, marginRight:0}}>
						<Icons name="angle-double-right" style={{ fontSize: 30, marginTop: 10, color: '#23ABE2' }} />
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
