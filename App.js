import React from 'react';
//import { StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers,applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import productsReducer from './store/reducers/products';
import AuthScreen from './screens/user/AuthScreen';
import ShopNavigator from './navigation/ShopNavigator';
import ReduxThunk from 'redux-thunk';
const rootReducer = combineReducers({
  products: productsReducer
});
const store = createStore(rootReducer,applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <ShopNavigator />
    </Provider>


  );
}

