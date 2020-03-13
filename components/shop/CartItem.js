import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, TouchableNativeFeedback, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const CartItem = props => {
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (<View style={styles.cartItem}>
        <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: props.imgUrl }} />
        </View>
        <View style={styles.details}>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>{props.title}</Text>

                <Text style={styles.amount}>${props.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.itemSummary}>
               
                <View style={styles.circle}>
                    <TouchableCmp onPress={props.onMinusOne} style={styles.actions}>
                        <View style={styles.circle}>
                            <Ionicons
                                name={Platform.OS === 'android' ? 'md-remove-circle-outline' : 'ios-remove-circle-outline'}
                                size={28}
                                color={Colors.primary}
                            />
                        </View>
                    </TouchableCmp>
                </View>
                <Text style={styles.quantity}>QTY: {props.quantity} </Text>
                <View style={styles.circle}>
                    <TouchableCmp onPress={props.onOneToCart} style={styles.actions}>
                        <View style={styles.circle}>
                            <Ionicons
                                name={Platform.OS === 'android' ? 'md-add-circle-outline' : 'ios-add-circle-outline'}
                                size={28}
                                color={Colors.primary}
                            />
                        </View>
                    </TouchableCmp>
                </View>
                <View style={styles.circle}>
                    <TouchableCmp onPress={props.onRemove} style={styles.actions}>
                        <View style={styles.circle}>
                            <Ionicons
                                name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                                size={28}
                                color="red"
                            />
                        </View>
                    </TouchableCmp>
                </View>
            </View>
        </View>
    </View>);
}
const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: 'white',
        width: '100%',
        marginVertical: 10,
        height: 100,
        justifyContent: "space-between",
        borderRadius: 10,
        flexDirection: "row"
        //marginVertical:20
    },
    itemData: {
        //flexDirection:"row",
        //flexDirection: "row",
        justifyContent: "flex-start",
        //width:'65%',
        //justifyContent: "center",
    },
    quantity: {
        fontFamily: 'open-sans',
        color: Colors.accent,
        fontSize: 16,
        //paddingHorizontal: 10
    },
    mainText: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        //
    },
    actions: {
        // height: 20,
        // width: 10
        //alignSelf:'flex-end'
        //alignContent:"flex-end",
        //marginLeft:10
    },
    itemSummary: {
        //width:'65%',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    amount: {
        fontFamily: 'open-sans-bold',
        color: Colors.accent
    },
    image: {
        height: '100%',
        width: '100%'
    },
    details: {
        width: '75%',
        justifyContent: "space-between",
        paddingHorizontal: 10
    },
    imageContainer: {
        backgroundColor: 'black',
        height: '100%',
        width: '25%'
    },
    circle: {
        height: 30,
        width: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        overflow: 'hidden'
    }
});
export default CartItem;