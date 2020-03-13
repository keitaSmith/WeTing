import React from 'react';
import { Platform,View, Text, Image, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback,} from 'react-native';
import Card from '../UI/Card';
import Cart from '../UI/Cart';
import Colors from '../../constants/Colors';

const ProductItem = props => {
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <TouchableCmp onPress={props.onViewDetail} useForeground>
      <View style={styles.product}>
      <Card>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: props.image }} />
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.price}>${props.price.toFixed(2)}</Text>
        </View>
        <View style={styles.actions}>
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={props.onViewDetail}
          />
          <Cart onAddToCart={props.onAddToCart}/>
        </View>
      </Card>
      </View>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  product: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 300,
    margin: 20,
    overflow:"hidden",
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  details: {
    alignItems: 'center',
    height: '15%',
    flexDirection:"row",
    paddingHorizontal: 20,
    justifyContent:'space-between'
  },
  title: {
    fontFamily:'open-sans-bold',
    fontSize: 18,
    marginVertical: 4
  },
  price: {
    fontFamily:'open-sans',
    fontSize: 14,
    color: '#888'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '25%',
    paddingHorizontal: 20
  }
});

export default ProductItem;