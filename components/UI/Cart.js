import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Dimensions, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import Colors from '../../constants/Colors';
const Cart = props => {
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <View style={styles.circle}>
            <TouchableCmp background={TouchableNativeFeedback.Ripple('', true)}>
                <FontAwesomeIcon size={40} icon={faCartPlus} style={styles.customButton} />
            </TouchableCmp>
        </View>
    )
};
const styles = StyleSheet.create({
    customButton: {
        color: Colors.accent,
        overflow: "hidden",

    },
    circle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    }
});
export default Cart;