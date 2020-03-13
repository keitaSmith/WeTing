import React from 'react';
import {View,StyleSheet,Text,Button} from 'react-native';
import CartItem from './CartItem';
const OrderItem = props =>{
    return (
    <View>
        <View>
            <Text>$TOTAL{props.amount.toFixed(2)}</Text>
            <Text>{props.date}</Text>
        </View>
        <Button/>
    </View>
    )
};
const styles=StyleSheet.create({
    
})
export default OrderItem;