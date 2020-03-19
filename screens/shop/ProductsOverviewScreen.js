import React from 'react';
import { FlatList, Text, StyleSheet, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import * as cartActions from '../../store/actions/cart';
//import cart from '../../store/reducers/cart';
const ProductsOverviewScreen = props => {
    //const productOverview = true;
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();
    return (
        <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{flex:1}}>
            <FlatList
                style={{width:'100%'}}
                data={products}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <ProductItem
                        productOverview
                        image={itemData.item.imageUrl}
                        title={itemData.item.title}
                        price={itemData.item.price}
                        onViewDetail={() => {
                            props.navigation.navigate('ProductDetail', {
                                productId: itemData.item.id,
                                productTitle: itemData.item.title
                            });
                        }}
                        onAddToCart={() => {
                            dispatch(cartActions.addToCart(itemData.item));
                        }}
                    />
                )}
            />
        </LinearGradient>
    );
}
ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products',
        headerLeft:() =>
        (<HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title='Menu'
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navData.navigation.toggleDrawer()
                }} />
        </HeaderButtons>),
        headerRight: () =>
            (<HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title='Cart'
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart')
                    }} />
            </HeaderButtons>)
    }
}

export default ProductsOverviewScreen;
