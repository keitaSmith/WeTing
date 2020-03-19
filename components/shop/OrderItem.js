import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import CartItem from './CartItem';
import { Ionicons } from '@expo/vector-icons';
import Card from '../UI/Card';
import Colors from '../../constants/Colors';
const OrderItem = props => {
    const [showDetails, setShowDetails] = useState(false);
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    //console.log(showDetails);
    return (
        
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.totalAmount}>${props.amount.toFixed(2)}</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            {showDetails && <View>
                {props.items.map(cartItem =>
                    <CartItem
                        key={cartItem.productId}
                        imgUrl={cartItem.imgUrl}
                        quantity={cartItem.quantity}
                        amount={cartItem.sum}
                        title={cartItem.productTitle} />)}
            </View>}
            <View style={styles.dropDown}>
                <TouchableCmp onPress={() => {
                    setShowDetails(prevState => !prevState)
                }}>
                    <View style={styles.dropDown}>
                        {showDetails ? (<Ionicons
                            name={Platform === 'android' ? 'md-arrow-dropup' : 'ios-arrow-dropup'}
                            size={30}
                            color={Colors.primary}
                        />) : (<Ionicons
                            name={Platform === 'android' ? 'md-arrow-dropdown' : 'ios-arrow-dropdown'}
                            size={30}
                            color={Colors.primary}
                        />)}
                    </View>
                </TouchableCmp>
            </View>
        </Card>
    );
};
const styles = StyleSheet.create({
    orderItem: {
        margin: 10,
        padding: 10,
    },
    summary: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: '100%',
    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        color: Colors.accent
    },
    date: {
        fontSize: 16,
        fontFamily: 'open-sans',
        color: '#888'
    },
    dropDown: {
        height: 54,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        width: '100%',
    }
});
export default OrderItem;