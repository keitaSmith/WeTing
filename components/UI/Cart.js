import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform, Dimensions, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCartPlus, faPray } from '@fortawesome/free-solid-svg-icons'
import Colors from '../../constants/Colors';
//import {useDispatch} from 'react-redux';
//import * as cartActions from '../../store/actions/cart';
const Cart = props => {
    //const dispatch=useDispatch();
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <View style={styles.circle}>
            <TouchableCmp onPress={props.onAddToCart}>
            <View style={styles.circle}>
                <FontAwesomeIcon size={40} icon={faCartPlus} style={styles.customButton} />
                </View>
            </TouchableCmp>
        </View>
    );
};
const styles = StyleSheet.create({
    customButton: {
        color: Colors.accent,
        // height: 50,
        // width: 50,
        // borderRadius:25,
        //overflow:"hidden"
    },
    circle: {
        height: 54,
        width: 54,
        borderRadius: 27,
        alignItems: "center",
        justifyContent: "center",
        overflow: 'hidden'
    }
});
export default Cart;