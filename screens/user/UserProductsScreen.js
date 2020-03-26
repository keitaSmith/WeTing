import React from 'react';
import { FlatList, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import ProductItem from '../../components/shop/ProductItem';
import * as productsActions from '../../store/actions/products'
const UserProductsScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();
    return (
        <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{ flex: 1 }}>
            <FlatList
                data={userProducts}
                keyExtractor={item=>item.id}
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
export default UserProductsScreen;