import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Text, StyleSheet, Platform, View, Button, KeyboardAvoidingView, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import { WaveIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/FontAwesome5';


const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const [searchText, setSearchText] = useState('');

    let ownerId = null;
    let products = null;
    { props.navigation.getParam('ownerId') ? ownerId = props.navigation.getParam('ownerId') : null };
    if (ownerId) {
        products = useSelector(state => state.products.availableProducts.filter(prod => prod.ownerId === ownerId));
    } else {

        products = useSelector(state => state.products.availableProducts);
    }
    if (searchText !== '') {
        let reg = new RegExp(searchText, 'gi');
        products = products.filter(prod => prod.title.match(reg));
    }

    const dispatch = useDispatch();
    const searchProducts = (searchText) => {
        setSearchText(searchText);
    }

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
    const reload = () => {
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false);
        });
    }
    useEffect(() => {
        reload();
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
    }
    if (!isLoading && products.length === 0 && searchText === '') {
        return (
            <LinearGradient colors={[Colors.accent, Colors.primary]} style={{ flex: 1 }}>
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../assets/logos/WeTingHeaderTitle.png')}
                        resizeMode='contain'
                        style={{ height: 100, width: 100, alignSelf: "center" }}
                    />
                    <Text style={styles.emptyText}>No Products Found</Text>
                </View>
            </LinearGradient>
        )
    } else return (
        <LinearGradient colors={[Colors.gradeA, Colors.gradeB, Colors.gradeA]} style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
                keyboardVerticalOffset={100}
            >
                <View style={{ alignItems: "center", width: '100%' }}>
                    <SearchBar
                        round
                        placeholder="Search..."
                        placeholderTextColor='#ccc'
                        underlineColorAndroid='transparent'
                        searchIcon={<Ionicons name={Platform.OS === 'android' ? "md-search" : 'ios-search'} size={15} color={'white'} />}
                        clearIcon={{ name: 'clear', color: 'white' }}
                        inputStyle={{ backgroundColor: 'transparent', color: '#ccc' }}
                        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', borderWidth: 1, borderTopColor: 'transparent', borderColor: 'transparent', borderBottomColor: Colors.accent, width: '100%', }}
                        inputContainerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: 20, width: '60%', alignSelf: "center" }}
                        onChangeText={(text) => { searchProducts(text) }}
                        value={searchText}
                    />
                </View>
                {products.length === 0 ?
                    (<View style={styles.emptyContainer}>
                        <Image
                            source={require('../../assets/logos/WeTingHeaderTitle.png')}
                            //resizeMode='contain'
                            //style={{ height: 100, width: 100, alignSelf: "center" }}
                        />
                        <Text style={styles.emptyText}>No Products Found</Text>
                    </View>)
                    : (<FlatList
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
                    />)}
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
ProductsOverviewScreen.navigationOptions = navData => {
    let businessName = null;
    businessName = navData.navigation.getParam('businessName');
    if (businessName) {
        return {
            headerTitle: businessName,
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
    } else {
        return {
            headerTitle: () =>
                (<Image
                    source={Platform.OS === 'android' ? require('../../assets/logos/WeTingHeaderTitle.png') : require('../../assets/logos/WeTingHeaderTitleIos.png')}
                    resizeMode='contain'
                    style={Platform.OS==='android'?{ height: 100, width: 100, alignSelf: "center" }:{height:80,width:80, alignSelf:'center'}}
                />),

            headerLeft: () =>
                (<HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        title='Menu'
                        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                        onPress={() => {
                            navData.navigation.toggleDrawer();
                        }} />
                </HeaderButtons>)
            ,
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
