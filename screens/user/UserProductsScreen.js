import React, { useCallback, useEffect } from 'react';
import { FlatList, Alert,View,Text, StyleSheet,Button,Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import ProductItem from '../../components/shop/ProductItem';
import * as productsActions from '../../store/actions/products'
import * as producersActions from '../../store/actions/producers';

const UserProductsScreen = props => {
    const loadProducers = useCallback(async () => {

        await dispatch(producersActions.fetchProducers());

    }, [dispatch])


    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducers);
        return () => {
            willFocusSub.remove();
        }
    }, [loadProducers]);
    const user = useSelector(state => state.auth.userId);
    //console.log(user);
    const isProducer = useSelector(state => state.producers.allProducers.find(prod => prod.ownerId === user));
    //console.log(isProducer.ownerId);
    const userProducts = useSelector(state => state.products.userProducts);
    useEffect(() => {
        props.navigation.setParams({ isProducer: isProducer });
}, [isProducer]);
    
    const dispatch = useDispatch();
    if (!isProducer) {
        return (
            <LinearGradient colors={[Colors.accent, Colors.primary]} style={{ flex: 1 }}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>You must first signup as a poducer to sell items</Text>
                    
                    <Button title="Become a Producer" onPress={() => { props.navigation.navigate('BecomeProducer') }} color={Platform.OS==='android'?Colors.primary:'white'} />
                    
                </View>
            </LinearGradient>
        )
    }
    return (
        <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{ flex: 1 }}>
            <FlatList
                data={userProducts}
                keyExtractor={item => item.id}
                renderItem={itemData =>
                    <ProductItem
                        userProducts
                        image={itemData.item.imageUrl}
                        title={itemData.item.title}
                        price={itemData.item.price}
                        deleteProduct={() => {
                            Alert.alert('Delete', 'Are you sure you want to delete this product?', [
                                { text: 'Cancel', style: 'default' },
                                { text: 'Yes', style: 'destructive', onPress: () => dispatch(productsActions.deleteProduct(itemData.item.id)) }
                            ], { cancelable: true });
                        }}
                        editProduct={() => {
                            props.navigation.navigate('EditProduct', {
                                productId: itemData.item.id,
                                //productTitle: itemData.item.title
                            });
                        }}
                    />
                } />
        </LinearGradient>
    );
};
UserProductsScreen.navigationOptions = navData => {
    const isProducer = navData.navigation.getParam('isProducer');
    if (isProducer) {
        return {
            headerTitle: 'Your Products',
            headerLeft: () =>
                (<HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        title='Menu'
                        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                        onPress={() => {
                            navData.navigation.toggleDrawer();
                            //navData.navigation.navData.navigation.navigate('EditProduct');
                        }} />
                </HeaderButtons>),
            headerRight: () =>
                (<HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        title='Add'
                        iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
                        onPress={() => {
                            navData.navigation.navigate('EditProduct');
                            //navData.navigation.toggleDrawer()
                        }} />
                </HeaderButtons>)
        }
    }
        return {
            headerTitle: 'Your Products',
            headerLeft: () =>
                (<HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        title='Menu'
                        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                        onPress={() => {
                            navData.navigation.toggleDrawer();
                            //navData.navigation.navData.navigation.navigate('EditProduct');
                        }} />
                </HeaderButtons>),
            
        }
    
}
const styles=StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        margin:20,
        textAlign:"center",
        //justifyContent:"center",
        fontFamily: "open-sans-bold",
        fontSize: 18,
        color: 'white'
    },
    button:{
        borderWidth:1,
        //borderColor:'white'
    }
})
export default UserProductsScreen;