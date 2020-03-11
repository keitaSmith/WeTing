import React from 'react';
import { FlatList, Text,StyleSheet,View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
const ProductsOverviewScreen = props => {
    const products = useSelector(state => state.products.availableProducts)
    return (
        <LinearGradient colors={[Colors.gradeA,Colors.gradeB]} style={styles.gradient}>
        <FlatList style={styles.list}
            data={products}
            renderItem={itemData => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onViewDetail={() => {
                        props.navigation.navigate('ProductDetail',
                            {
                                productId: itemData.item.id,
                                productTitle:itemData.item.title
                            });
                    }}
                    onAddToCart={() => { }}
                />
            )}
        />
        </LinearGradient>
    );
}
ProductsOverviewScreen.navigationOptions = {
    headerTitle: 'All Products'
}
const styles=StyleSheet.create({
    screen:{
        flex:1
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      list:{
          width:'100%'
      }
})
export default ProductsOverviewScreen;
