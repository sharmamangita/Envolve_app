import React from 'react';
import { Button, StyleSheet,Image, Text, View,TouchableOpacity } from 'react-native';
import  Icon  from 'react-native-vector-icons/Ionicons';
const proileImage = require("../assets/images/sm-logo.png");

const Header = ({ navigation,title }) => {
    const toggleMenu = () => {
        navigation.toggleDrawer();
        
    }
    return (
        <View style={styles.header}>            
            <TouchableOpacity onPress={() => toggleMenu()}>
                <Icon style={styles.menuIcon} name="menu" size={25} color="white"/>
               
            </TouchableOpacity>
            <View style={styles.headerView}>
              <Image source={require('../assets/images/sm-logo.png')} />
            </View>
        </View>
    )
}
export default Header;
const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        //backgroundColor: "#1C75BB"        
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 20,
        color: 'white',
        letterSpacing: 1,
    },
    headerView:{
        flex:1, 
        flexDirection: 'row-reverse'
    },
    menuIcon:{
        //marginLeft:10,
        fontSize:25,
        color:'#4B4B4C'
    }
});