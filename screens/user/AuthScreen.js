import React, { useState, useReducer, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  TextInput,
  Text,
  ActivityIndicator
} from 'react-native';
import Toast from 'react-native-tiny-toast';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

import * as authActions from '../../store/actions/auth';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true
      };
    default:
      return state;
  }
};

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
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const disp = useDispatch();
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue,
    isValid: props.initiallyValid,
    touched: false
  });
  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const id = 'cnfPassword';
  useEffect(() => {
    if (inputState.touched) {
      inputChangeHandler(id, inputState.value, inputState.isValid);
      //console.log(inputState.input);
    }
  }, [inputState, inputChangeHandler, id]);

  const confirmPasswordHandler = (text) => {
    let isValid = true;
    if (!(formState.inputValues.password === text)) {
      isValid = false;
    }
    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      cnfPassword: ''
    },
    inputValidities: {
      email: false,
      password: false,
      cnfPassword: true
    },
    formIsValid: false
  });
  useEffect(() => {
    if (error) {
      Toast.show(error, {
        position: Toast.position.center,
        containerStyle: styles.toastStyle
      });
    }
  }, [error])
  const authHandler = async () => {
    let action;
    if (!formState.formIsValid) {
      return;
    }
    if (isSignup) {
      if (!(formState.inputValues.password === formState.inputValues.cnfPassword)) {
        Toast.show('Passwords do not match', {
          position: Toast.position.center,
          containerStyle: styles.toastStyle
        });
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
    setLoading(true);
    try {
      await disp(action);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };



  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={[Colors.gradeA,Colors.gradeB]} style={styles.gradient}>
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
            />
            {isSignup ? (
              <View style={styles.formControl}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  placeholder="confirm password"
                  keyboardType="default"
                  secureTextEntry
                  style={styles.input}
                  value={inputState.value}
                  inputChangeHandler
                  onChangeText={confirmPasswordHandler}
                  onBlur={lostFocusHandler}
                />
                {!(formState.inputValues.cnfPassword === formState.inputValues.password) && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Passwords do not match</Text>
                  </View>
                )}
              </View>) : null}
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
  headerTitle: 'WeTing'
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
    //fontFamily: 'open-sans-bold',
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
    //fontFamily: 'open-sans',
    color: 'red',
    fontSize: 13
  },
  formLabel: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: "center"
  },
  toastStyle: {
    backgroundColor: Colors.primary
  }
});

export default AuthScreen;