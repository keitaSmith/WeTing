import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Card from '../../components/UI/Card';
import Cart from '../../components/UI/Cart';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart'

const ProductDetailScreen = props => {
    const productId = props.navigation.getParam('productId');
    const product = useSelector(state => state.products.availableProducts.find(prod => prod.id === productId));
    const dispatch = useDispatch();
    return (
        <LinearGradient colors={[Colors.accent, Colors.primary]} style={{flex:1}}>
            <ScrollView style={styles.sView}>
                <Card style={styles.imageContainer}>
                    <View style={styles.border}>
                        <Image style={styles.image} source={{ uri: product.imageUrl }} />
                    </View>
                </Card>
                <Card style={styles.detailContainer} >
                    <View style={styles.headerContainer}>
                        <Text style={styles.price}> Price: ${product.price.toFixed(2)}</Text>
                        <Cart onAddToCart={() => {
                            dispatch(cartActions.addToCart(product));
                        }} />
                    </View>
                </Card>
                <Card style={styles.detailContainer}>
                    <Text style={styles.descHeader}>Description</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </Card>
            </ScrollView>
        </LinearGradient>
    );
};
ProductDetailScreen.navigationOptions = navData => {
    return {
        headerTitle: navData.navigation.getParam('productTitle'),
        headerRight: () =>
            (<HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title='Cart'
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart')
                    }} />
            </HeaderButtons>)
    };
}
const styles = StyleSheet.create({
    image: {
        height: 200,
        width: '100%',
    },
    border: {
        borderRadius: 10
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    price: {
        fontSize: 20,
        color: Colors.accent,
        textAlign: "center",
        marginVertical: 20,
    },
    descHeader: {
        fontSize: 20,
        color: Colors.accent,
        marginHorizontal: 25,
    },
    description: {
        fontSize: 14,
        marginHorizontal: 25,
        textAlign: "justify",
        paddingTop: 10

    },
    button: {
        width: '50%',
        marginHorizontal: 20,
    },
    sView: {
        flex: 5,
        width: '100%',

    },
    imageContainer: {
        marginHorizontal: 25,
        marginVertical: 10,

    },
    detailContainer: {
        marginHorizontal: 25,
        marginVertical: 10,
        padding: 15

    }
});
export default ProductDetailScreen;