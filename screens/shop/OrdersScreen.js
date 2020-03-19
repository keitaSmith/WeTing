import React from 'react';
import { FlatList, Platform,View,Text,StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
const OrdersScreen = props => {
    const orders = useSelector(state => state.orders.orders);
    if (orders.length === 0) {
        return (
            <LinearGradient colors={[Colors.accent, Colors.primary]} style={{flex:1}}>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons
                        name='react'
                        size={100}
                        color={Colors.primary}
                    />
                    <Text style={styles.emptyText}>You Haven't Made Any Orders Yet.</Text>
                </View>
            </LinearGradient>)
    } else return (
        <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{flex:1}}>
            <FlatList
                data={orders}
                renderItem={itemData =>
                    <OrderItem
                        amount={itemData.item.totalAmount}
                        date={itemData.item.readableDate}
                        items={itemData.item.items}
                    />
                }
            />
        </LinearGradient>
    );
}
OrdersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Order History',
        headerLeft: () =>
            (<HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer()
                    }} />
            </HeaderButtons>)
    }
}
const styles=StyleSheet.create({
    emptyContainer: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontFamily: "open-sans-bold",
        fontSize: 18,
        color: 'white'
    }
})
export default OrdersScreen;