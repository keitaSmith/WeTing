import { AsyncStorage } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT='LOGOUT';
export const authenticate = (userId, token) => {
  return { type: AUTHENTICATE, userId: userId, token: token };
};
export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAiKzIxvGox7ojmYlp45Yxoj4tlp9KGJTA',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorID = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorID === 'EMAIL_EXISTS') {
        message = 'Account with email ' + email + ' already exists';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    //console.log(resData);
    dispatch(authenticate(resData.localId,resData.idToken));
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};
export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAiKzIxvGox7ojmYlp45Yxoj4tlp9KGJTA',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorID = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorID === 'EMAIL_NOT_FOUND') {
        message = 'Account with email ' + email + ' not found';
      } else if (errorID === 'INVALID_PASSWORD') {
        message = 'Incorrect Password';
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(authenticate(resData.localId,resData.idToken));
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};
export const logout=()=>{
  return {type:LOGOUT};
}
const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem('userData', JSON.stringify({
    token: token,
    userId: userId,
    expiryDate: expirationDate.toISOString()
  }))
}    