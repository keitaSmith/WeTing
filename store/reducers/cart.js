import { ADD_TO_CART, REMOVE_FROM_CART, DELETE_CART_ITEM, ADD_ONE } from '../actions/cart';
import CartItem from '../../models/CartItem';
import { ADD_ORDER } from '../actions/orders';
import {StyleSheet} from 'react-native';
import Toast from 'react-native-tiny-toast';
import Colors from '../../constants/Colors';
import { DELETE_PRODUCT } from '../actions/products';
const initialState = {
  items: {},
  totalAmount: 0
};

export default (state = initialState, action) => {
  let selectedCartItem;
  let updatedCartItems;
  switch (action.type) {

    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;
      const imgUrl = addedProduct.imageUrl;
      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice,
          imgUrl
        );
      } else {
        updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice, imgUrl);
      }
      Toast.show('+ 1 ' +prodTitle+' added to cart', {
        position: Toast.position.center,
        containerStyle: styles.toastStyle
      });
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + prodPrice
      };
    case REMOVE_FROM_CART:
      selectedCartItem = state.items[action.pid];
      let currentQty = selectedCartItem.quantity;
      updatedCartItems;
      if (currentQty > 1) {
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice,
          selectedCartItem.imgUrl
        );
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice
      };
    case DELETE_CART_ITEM:
      selectedCartItem = state.items[action.pid];
      updatedCartItems = { ...state.items };
      delete updatedCartItems[action.pid];
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.sum
      };

    case ADD_ONE:
      selectedCartItem = state.items[action.pid];

      const updatedCartItem = new CartItem(
        selectedCartItem.quantity + 1,
        selectedCartItem.productPrice,
        selectedCartItem.productTitle,
        selectedCartItem.sum + selectedCartItem.productPrice,
        selectedCartItem.imgUrl
      );

      updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount + selectedCartItem.productPrice
      };
    case ADD_ORDER:
      return initialState
    case DELETE_PRODUCT:
      if(!state.items[action.pid]){
        return state;
      }
      const updatedItems = {...state.items};
      const itemTotal=state.items[action.pid].sum
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        totalAmount:state.totalAmount - itemTotal
      }
  }

  return state;
};
const styles=StyleSheet.create({
  toastStyle: {
    //fontFamily:'open-sans',
    backgroundColor: Colors.accent
  }
});
