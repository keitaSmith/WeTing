import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Platform, View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ordersActions from '../../store/actions/orders';
import { WaveIndicator } from 'react-native-indicators';
import Colors from '../../constants/Colors';
const OrdersScreen = props => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const loadOrders = useCallback(async () => {
        setIsRefreshing(true)
        dispatch(ordersActions.fetchOrders());
        setIsRefreshing(false);
    }, [dispatch, setIsLoading])
    useEffect(() => {
        setIsLoading(true);
        loadOrders().then(() => {
            setIsLoading(false);
        });
    }, [dispatch,loadOrders]);
    const orders = useSelector(state => state.orders.orders);
    if (isLoading) {
        return (
            <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{ flex: 1 }}>
                <WaveIndicator color={Platform.OS === 'android' ? 'white' : Colors.primary} size={150} waveMode={"outline"} waveFactor={0.4} count={2} />
            </LinearGradient>
        )
    }
    if (orders.length === 0) {
        return (
            <LinearGradient colors={[Colors.accent, Colors.primary]} style={{ flex: 1 }}>
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
        <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{ flex: 1 }}>
            <FlatList
                refreshing={isRefreshing}
                onRefresh={loadOrders}
                data={orders}
                keyExtractor={item => item.id}
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
const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
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