import React, { useEffect, useCallback, useReducer, useState } from 'react';
import { View, ScrollView, StyleSheet, Platform, Alert, KeyboardAvoidingView,Keyboard } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import { WaveIndicator } from 'react-native-indicators';
import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import Card from '../../components/UI/Card';
import ImageSelector from '../../components/UI/ImageSelector';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const EditProductScreen = props => {
  const[isBlured,setIsBlured]=useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const prodId = props.navigation.getParam('productId');
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: ''
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false
    },
    formIsValid: editedProduct ? true : false
  });
  useEffect(()=>{
    if(error){
      Alert.alert('An error has occured!', error,[{text:'Okay'}]);
    }
  },[error])
  const submitHandler = useCallback(async () => {
    //this.titleTextInput.focus();
    //console.log(formState);
    Keyboard.dismiss();
    if (!formState.formIsValid) {
      setIsBlured(true);
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay' }
      ]);
      return;
    }
    setIsBlured(false);
    setError(null);
    setIsLoading(true);
    try {
      if (editedProduct) {
        await dispatch(
          productsActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        );
      } else {
        await dispatch(
          productsActions.createProduct(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl,
            +formState.inputValues.price
          )
        );
      }
      //setIsBlured(false);
      props.navigation.goBack();
    } catch (err) {
      setError(err.message)
    }
    setIsLoading(false);
    
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );
  if (isLoading) {
    return (
      <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{ flex: 1 }}>
        <WaveIndicator color={Platform.OS === 'android' ? 'white' : Colors.primary} size={150} waveMode={"outline"} waveFactor={0.4} count={2} />
      </LinearGradient>
    )
  }
  return (
    <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{ flex: 1 }}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <Card style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title!"
            keyboardType="default"
            autoCapitalize='words'
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ''}
            initiallyValid={!!editedProduct}
            required
            initiallyBlured={isBlured}
          />
          <ImageSelector/>
          <Input
            id="imageUrl"
            label="Image Url"
            errorText="Please enter a valid image url!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ''}
            initiallyValid={!!editedProduct}
            required
            initiallyBlured={isBlured}
          />
          {editedProduct ? null : (
            <Input
              id="price"
              label="Price"
              errorText="Please enter a valid price!"
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              required
              min={0}
              price
              initiallyBlured={isBlured}
            />
          )}
          <Input
            id="description"
            label="Description"
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ''}
            initiallyValid={!!editedProduct}
            required
            minLength={0}
            initiallyBlured={isBlured}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
    </LinearGradient>
  );
};

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Edit Product'
      : 'Add Product',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
    padding:10
  }
});

export default EditProductScreen;