import React from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, View,Button } from 'react-native';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
const AuthScreen = props => {
    return (
        <KeyboardAvoidingView
            behavior='padding'
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <Card style = {styles.authContainer}>
            <ScrollView>
                <Input 
                Id ="email" 
                label = "E-Mail" 
                keyboardType='email-address' 
                required 
                email
                autoCapitalize = "none"
                errorMessage = "Please enter a valid email address."
                onInputChange={()=>{}}
                initialValue=""
                />
                <Input 
                Id ="password" 
                label = "Password" 
                keyboardType='default'
                secureTextEntry 
                required 
                minLength={8}
                autoCapitalize = "none"
                errorMessage = "Please enter a valid password."
                onInputChange={()=>{}}
                initialValue=""
                />
                <Button title='Login' color='green' onPress={()=>{}}/>
                <Button title='signUp' color='orange' onPress={()=>{}}/>
            </ScrollView >
            </Card>
        </KeyboardAvoidingView> 
    );
};
const styles = StyleSheet.create({
    screen:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    authContainer:{
        width:'80%',
        maxWidth: 400,
        //height:'50%',
        maxHeight:400,
        padding:20
    }
});
export default AuthScreen;