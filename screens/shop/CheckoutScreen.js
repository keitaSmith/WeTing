import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, Platform, FlatList } from 'react-native';
import Toast from 'react-native-tiny-toast';
import CustomButton from '../../components/UI/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/UI/Card';
import CartItem from '../../components/shop/CartItem'
import { WaveIndicator } from 'react-native-indicators';
import OrderItem from '../../components/shop/OrderItem';
import { LinearGradient } from 'expo-linear-gradient';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';
const CheckoutScreen = props => {
    const[isLoading,setIsLoading]=useState(false);
    const [showDetails, setShowDetails] = useState(false);
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
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const dispatch = useDispatch();
    return (
        <LinearGradient colors={[Colors.accent, Colors.primary]} style={{ flex: 1 }}>
            {/* <View style={styles.screen}> */}
            <Card style={styles.details}>
                <Text style={styles.detailsText}>
                    Your Cart: <Text style={styles.cost}>${cartTotalCost.toFixed(2)}</Text>
                </Text>
                {/* <View style={styles.list}> */}
                {showDetails && (<FlatList
                    data={cartItems}
                    keyExtractor={item => item.productId}
                    renderItem={itemData => (
                        <CartItem
                            quantity={itemData.item.quantity}
                            title={itemData.item.productTitle}
                            amount={itemData.item.sum}
                            imgUrl={itemData.item.imgUrl}
                        />)}
                />

                )}
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

            <Card style={styles.paymentInfo}>

                <Text>Payment Information Form</Text>

                {isLoading?(<WaveIndicator color={Platform.OS === 'android' ? 'white' : Colors.primary} size={150} waveMode={"outline"} waveFactor={0.4} count={2} />):
                (<CustomButton
                    style={styles.pay}
                    action={async() => {
                        setIsLoading(true);
                        dispatch(ordersActions.addOrder(cartItems, cartTotalCost));
                        setIsLoading(false);
                        Toast.show('Payment Confirmed', {
                            position: Toast.position.center,
                            containerStyle: styles.toastStyle
                          });
                        props.navigation.navigate('ProductsOverview');
                    }}>
                    Confirm Payment
                </CustomButton>)}

            </Card>
        </LinearGradient>
    );
}
CheckoutScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Checkout',
    }
}
const styles = StyleSheet.create({

    details: {
        maxHeight: '90%',
        //alignItems: "center",
        justifyContent: "center",
        margin: 20,
        padding: 10,

    },
    list: {
        alignItems: "center",
        //width:'100%'
        //justifyContent: "center",
    },
    detailsText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
    },
    cost: {
        color: Colors.accent
    },
    dropDown: {
        height: 54,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        width: '100%',
    },
    paymentInfo: {
        margin: 20,
        padding: 10,
    },
    pay: {
        alignSelf: "flex-end",
        alignItems: "center",
        width: 150
    },
    toastStyle: {
        //fontFamily:'open-sans',
        backgroundColor: Colors.accent
      }
});
export default CheckoutScreen;