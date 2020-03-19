import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import Colors from '../../constants/Colors';
const CustomButton = props => {
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <View style={{...styles.buttonContainer,...props.style}}>
            <TouchableCmp onPress={props.action} useForground>
                <View style={{...styles.buttonContainer,...props.style}}>
                    <Text style={styles.text}>{props.children}</Text>
                </View>
            </TouchableCmp>
        </View>
    );
};
const styles = StyleSheet.create({
    buttonContainer:{
        height: 40,
        width: 130,
        //borderWidth:2,
        borderRadius: 10,
        borderColor:Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        overflow: 'hidden',
        backgroundColor:Colors.primary
    },
    text:{
        color:'white',
        padding:10,
        fontFamily:'open-sans-bold'
    }
});
export default CustomButton;