import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { ScrollView,Platform, View, KeyboardAvoidingView, StyleSheet, Button, Text, ActivityIndicator, Alert, Keyboard, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import * as authActions from '../../store/actions/auth';
import Colors from '../../constants/Colors';

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

const AuthScreen = props => {
  const [isBlured, setIsBlured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    let action;
    if (Keyboard) {
      Keyboard.dismiss();
    }
    setIsBlured(true);
    if (!formState.formIsValid) {
      return;
    }
    if (isSignup) {
      if (!(formState.inputValues.confirmPassword === formState.inputValues.password)) {
        return;
      }
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate('ProductsOverview');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setIsBlured(false);
    }

  }, [formState, dispatch, isSignup]);

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

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={styles.gradient}>

        <Card style={styles.authContainer}>
          <ScrollView>
            <Text style={styles.formLabel}>{isSignup ? 'Sign Up' : 'Login'}</Text>
            <Input
              id="email"
              label="E-Mail"
              placeholder='email@example.com'
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
              initiallyBlured={isBlured}
            />
            <Input
              id="password"
              label="Password"
              placeholder="password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={8}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
              initiallyBlured={isBlured}
            />
            {isSignup ? (
              <Input
                id="confirmPassword"
                label="Confirm Password"
                placeholder="confirm password"
                keyboardType="default"
                secureTextEntry
                required
                minLength={8}
                autoCapitalize="none"
                errorText="Passwords do not match."
                onInputChange={inputChangeHandler}
                initialValue=""
                confirmPassword
                initiallyBlured={isBlured}
              />
            ) : null}
            {!(formState.inputValues.confirmPassword === formState.inputValues.password) && isSignup && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Passwords do not match</Text>
              </View>
            )}
            < View style={styles.buttonContainer}>
              {isLoading ? (<ActivityIndicator size='small' color={Colors.primary} />) :
                <Button
                  title={(isSignup ? 'Sign Up' : 'Login')}
                  color={Colors.primary}
                  onPress={authHandler}
                />}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Go to ${isSignup ? 'Login' : 'Sign Up'}`}
                color={Colors.accent}
                onPress={() => {
                  setIsSignup(prevState => !prevState);
                }}
              />
            </View>
          </ScrollView>
        </Card>

      </LinearGradient>
    </KeyboardAvoidingView >
  );
};

AuthScreen.navigationOptions = {
  headerTitle: () =>
    (<Image
      source={Platform.OS === 'android' ? require('../../assets/logos/WeTingHeaderTitle.png') : require('../../assets/logos/WeTingHeaderTitleIos.png')}
      resizeMode='contain'
      style={Platform.OS==='android'?{ height: 100, width: 100, alignSelf: "center" }:{height:80,width:80, alignSelf:'center'}}
    />)
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 500,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  },
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    fontFamily: 'open-sans',
    color: 'red',
    fontSize: 13
  },
  formLabel: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    color: Colors.primary,
    textAlign: "center"
  },
  toastStyle: {
    //fontFamily:'open-sans',
    backgroundColor: Colors.accent
  }
});

export default AuthScreen;