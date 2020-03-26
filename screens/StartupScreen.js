import React,{useEffect} from 'react';
import{AsyncStorage}from 'react-native';
import { WaveIndicator } from 'react-native-indicators';
import { LinearGradient } from 'expo-linear-gradient';
import {useDispatch} from 'react-redux';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
const StartupScreen = props =>{
    const dispatch = useDispatch();
    useEffect(()=>{
        const tryLogin=async()=>{
            const userData=await AsyncStorage.getItem('userData');
            if(!userData){
                props.navigation.navigate('Auth');
                return;
            }
            const transformedData=JSON.parse(userData);
            const {token,userId,expiryDate}=transformedData
            const expirationDate=new Date(expiryDate);

            if(expirationDate <=new Date() ||!token||!userId){
                props.navigation.navigate('Auth');
                return;
            }
            props.navigation.navigate('Shop');
            dispatch(authActions.authenticate(userId,token));
        };
        tryLogin();
    },[dispatch])
    return (
        <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{ flex: 1 }}>
            <WaveIndicator color={Platform.OS === 'android' ? 'white' : Colors.primary} size={150} waveMode={"outline"} waveFactor={0.4} count={2} />
        </LinearGradient>
    );
};
export default StartupScreen;