export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const DELETE_CART_ITEM ='DELETE_CART_ITEM';
export const ADD_ONE='ADD_ONE';
export const removeFromCart=productId=>{
  return {type: REMOVE_FROM_CART, pid:productId};
};
export const addToCart = product => {
  return { type: ADD_TO_CART, product: product };
};
export const deleteCartItem=productId=>{
  return {type: DELETE_CART_ITEM, pid:productId};
};
export const addOne=productId=>{
  return {type: ADD_ONE, pid:productId};
};
