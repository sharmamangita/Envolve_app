import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationActions } from 'react-navigation';
class signup extends Component {
  constructor(props) {
    super(props);
  }

  login = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'LoginScreen',
    });
    this.props.navigation.dispatch(navigateAction);
  }

  componentDidUpdate(){
    this.props.navigation.dismiss()
  }

  render() {
    return (
      // Try setting `flexDirection` to `column`.
      <View style={styles.container}>
        <View style={{
          width: '100%', height: '10%', justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 20
          }}>Choose Account Type</Text>

        </View>
        <ScrollView style={{ height: '100%', width: '100%', marginTop: 12 }} >
          <TouchableOpacity onPress={() => this.login()} style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../assets/images/parent.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.login()} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 12 }} >
            <Image source={require('../assets/images/principal.png')} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.login()} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
            <Image source={require('../assets/images/trainer.png')} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',

  },
  imageClass: {
    width: '100%',
    height: '28%',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default signup;
