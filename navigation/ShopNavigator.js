import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer}from 'react-navigation';
import {Platform} from 'react-native';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import AuthScreen from '../screens/user/AuthScreen';
import Colors from '../constants/Colors';
import { fetchProducts } from '../store/actions/products';
const ProductsNavigator = createStackNavigator({
    Auth:AuthScreen,
    ProductsOverview:ProductsOverviewScreen,
    
    
},{
    defaultNavigationOptions:{
        headerStyle:{
            backgroundColor:Platform.OS==='android' ?Colors.primary:''
        },
        headerTintColor:Platform.OS==='android'?'white':Colors.primary
    }
});
export default createAppContainer(ProductsNavigator);