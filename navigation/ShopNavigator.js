import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Platform, SafeAreaView, View } from 'react-native';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import CheckoutScreen from '../screens/shop/CheckoutScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen2';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import StartupScreen from '../screens/StartupScreen';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import CustomBotton from '../components/UI/CustomButton';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/actions/auth';
//import { fetchProducts } from '../store/actions/products';
const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans',
    },
}
const AuthNavigator = createStackNavigator(
    {
        Auth: AuthScreen
    },
    {
        defaultNavigationOptions: defaultNavOptions
    }
);
const ProductsNavigator = createStackNavigator({
    //Auth: AuthScreen,
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
    Checkout: CheckoutScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => <Ionicons
            name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            size={25}
            color={drawerConfig.tintColor}
        />
    },
    defaultNavigationOptions: defaultNavOptions
});
const OrdersNavigator = createStackNavigator({
    Orders: OrdersScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => <Ionicons
            name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
            size={25}
            color={drawerConfig.tintColor}
        />
    },
    defaultNavigationOptions: defaultNavOptions
});
const UserShopNavigator = createStackNavigator({
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => <Ionicons
            name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
            size={25}
            color={drawerConfig.tintColor}
        />
    },
    defaultNavigationOptions: defaultNavOptions
});

const ShopDrawerNavigator = createDrawerNavigator({
    //Auth:AuthNavigator,
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Your_Shop: UserShopNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return (
            <View style={{ flex: 1,paddingTop:20 }}>
                <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                    <DrawerItems {...props} />
                    <View style={{ width:'100%' }}>
                        <CustomBotton style={{alignSelf: "center",borderRadius:0,width:'100%'}} action={()=>{
                            dispatch(authActions.logout());
                            props.navigation.navigate('Auth');
                        }}>Logout</CustomBotton>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
})
const ShopTabNavigator = createBottomTabNavigator({
    Shop: ShopDrawerNavigator
}, {
    tabBarOptions: {
        activeTintColor: Colors.accent
    }
})
const ShopNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Shop: ShopTabNavigator
})
export default createAppContainer(ShopNavigator);