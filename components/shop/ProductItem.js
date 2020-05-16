import React from 'react';
import { Platform, View, Text, Image, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../UI/Card';
import Cart from '../UI/Cart';
import Colors from '../../constants/Colors';
import CustomButton from '../../components/UI/CustomButton';
const ProductItem = props => {
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  let cardAction;
  if (props.productOverview) {
    cardAction = props.onViewDetail;
  } else {
    cardAction = props.editProduct
  }
  return (
    <TouchableCmp onPress={cardAction} useForeground>
      <View style={styles.product}>
        <Card>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: `data:image/jpg;base64,${props.image}` }} />
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.price}>${props.price.toFixed(2)}</Text>
          </View>
          {props.productOverview && <View style={styles.actions}>
            <CustomButton action={props.onViewDetail}>
              VIEW DETAILS
          </CustomButton>
            <Cart onAddToCart={props.onAddToCart} />
          </View>}
          {props.userProducts && <View style={styles.actions}>
            <CustomButton action={props.editProduct}>
              EDIT PRODUCT
          </CustomButton>
            <View style={styles.circle}>
              <TouchableCmp onPress={props.deleteProduct} style={styles.actions}>
                <View style={styles.circle}>
                  <Ionicons
                    name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                    size={28}
                    color="red"
                  />
                </View>
              </TouchableCmp>
            </View>
          </View>}
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
    overflow: "hidden",
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
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    marginVertical: 4
  },
  price: {
    fontFamily: 'open-sans',
    fontSize: 14,
    color: '#888'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '25%',
    paddingHorizontal: 20
  },
  buttonStyle: {
    backgroundColor: Colors.accent
  },
  circle: {
    height: 54,
    width: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    overflow: 'hidden'
  }
});

export default ProductItem;