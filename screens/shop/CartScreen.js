import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/UI/Card';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/orders';
const CartScreen = props => {
    const cartTotalCost = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for (const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum,
                imgUrl: state.cart.items[key].imgUrl
            });
        }
        return transformedCartItems.sort((a, b) =>
            a.productId > b.productId ? 1 : -1
        );
    });
    const dispatch = useDispatch();
    if (cartItems.length === 0) {
        return (
            <LinearGradient colors={[Colors.accent, Colors.primary]} style={styles.gradient}>
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                        size={100}
                        color={Colors.primary}
                    />
                    <Text style={styles.emptyText}>Your Cart is Empty.</Text>
                </View>
            </LinearGradient>)
    } else return (
        <LinearGradient colors={[Colors.accent, Colors.primary]} style={styles.gradient}>
            <View style={styles.screen}>
                <Card style={styles.details}>
                    <Text style={styles.detailsText}>
                        Total Cost: <Text style={styles.cost}>${cartTotalCost.toFixed(2)}</Text>
                    </Text>
                    <Button
                        title="Checkout"
                        color={Colors.primary}
                        disabled={cartItems.length === 0} 
                        onPress={()=>{
                            dispatch(ordersActions.addOrder(cartItems,cartTotalCost));
                        }}/>
                </Card>
                <View style={{ height: '85%', marginBottom: 20 }}>

                    <FlatList
                        data={cartItems}
                        keyExtractor={item => item.productId}
                        renderItem={itemData => (
                            <CartItem
                                quantity={itemData.item.quantity}
                                title={itemData.item.productTitle}
                                amount={itemData.item.sum}
                                imgUrl={itemData.item.imgUrl}
                                onOneToCart={() => {
                                    dispatch(cartActions.addOne(itemData.item.productId));
                                    //console.log(itemData.item.productId);
                                }}
                                onMinusOne={() => {
                                    //console.log(itemData.item.productId);
                                    dispatch(cartActions.removeFromCart(itemData.item.productId));

                                }}
                                onRemove={() => {
                                    //console.log(itemData.item.productId);
                                    dispatch(cartActions.deleteCartItem(itemData.item.productId));
                                }}
                            />)}
                    />

                </View>
            </View>
        </LinearGradient>
    )
};
CartScreen.navigationOptions={
    headerTitle:'Your Cart'
};
const styles = StyleSheet.create({
    screen: {
        //flex:1,
        margin: 20,
        //marginBottom: 100
    },
    gradient: {
        flex: 1
    },
    details: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        padding: 10,
        //height:'20%'
    },
    detailsText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
    },
    cost: {
        color: Colors.accent
    },
    emptyContainer: {
        //,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontFamily: "open-sans-bold",
        fontSize: 18,
        color: 'white'
    }
});
export default CartScreen;