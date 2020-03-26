import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Text, StyleSheet, Platform, View, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import { WaveIndicator } from 'react-native-indicators';



const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const[isRefreshing,setIsRefreshing]=useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();
    const loadProducts = useCallback(async () => {
        setError(null); 
        setIsRefreshing(true)
        try {
            await dispatch(productsActions.fetchProducts());
        } catch (err) {
            setError(err.message)
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);
        return () => {
            willFocusSub.remove();
        }
    }, [loadProducts]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(()=>{
            setIsLoading(false);
        });
    }, [dispatch, loadProducts]);

    if (error) {
        return (
            <LinearGradient colors={[Colors.accent, Colors.primary]} style={{ flex: 1 }}>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons
                        name='react'
                        size={100}
                        color={Colors.primary}
                    />
                    <Text style={styles.emptyText}>An Error Occured</Text>
                    <Button title="Try Again" onPress={loadProducts} color={Colors.primary} />
                </View>
            </LinearGradient>
        )
    }
    if (isLoading) {
        return (
            <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{ flex: 1 }}>
                <WaveIndicator color={Platform.OS === 'android' ? 'white' : Colors.primary} size={150} waveMode={"outline"} waveFactor={0.4} count={2} />
            </LinearGradient>
        );
    } if (!isLoading && products.length === 0) {
        return (
            <LinearGradient colors={[Colors.accent, Colors.primary]} style={{ flex: 1 }}>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons
                        name='react'
                        size={100}
                        color={Colors.primary}
                    />
                    <Text style={styles.emptyText}>No Products Found</Text>
                </View>
            </LinearGradient>
        )
    } else return (
        <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{ flex: 1 }}>
            <FlatList
                refreshing={isRefreshing}
                onRefresh={loadProducts}
                style={{ width: '100%' }}
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
        headerTitle: 'WeTing',
        headerLeft: () =>
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
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
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
export default ProductsOverviewScreen;
