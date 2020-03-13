import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer}from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {Platform} from 'react-native';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import AuthScreen from '../screens/user/AuthScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import Colors from '../constants/Colors';
import {Ionicons}from'@expo/vector-icons';
//import { fetchProducts } from '../store/actions/products';
const defaultNavOptions={
    headerTitleStyle:{
        fontFamily:'open-sans-bold'
    },
    headerBackTitle:{
        fontFamily:'open-sans'
    },
    headerStyle:{
        backgroundColor:Platform.OS==='android' ?Colors.primary:''
    },
    headerTintColor:Platform.OS==='android'?'white':Colors.primary
}
const ProductsNavigator = createStackNavigator({
    //Auth:AuthScreen,
    ProductsOverview:ProductsOverviewScreen,
    ProductDetail:ProductDetailScreen,
    Cart:CartScreen
    
},{
    navigationOptions:{
        drawerIcon:drawerConfig=><Ionicons 
            name={Platform.OS==='android'?'md-cart':'ios-cart'}
            size={25}
            color={drawerConfig.tintColor}
            />
    },
    defaultNavigationOptions:defaultNavOptions
});
const OrdersNavigator=createStackNavigator({
    Orders:OrdersScreen
},{
    navigationOptions:{
        drawerIcon:drawerConfig=><Ionicons 
            name={Platform.OS==='android'?'md-list':'ios-list'}
            size={25}
            color={drawerConfig.tintColor}
            />
    },
    defaultNavigationOptions:defaultNavOptions
});
const ShopNavigator = createDrawerNavigator({
    Products:ProductsNavigator,
    Orders:OrdersNavigator
},{
    contentOptions:{
        activeTintColor:Colors.primary
    }
})
export default createAppContainer(ShopNavigator);