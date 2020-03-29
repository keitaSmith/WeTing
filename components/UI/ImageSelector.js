import React from 'react';
import { View, Button, Text, StyleSheet,Image,Alert } from 'react-native';
import Colors from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {Ionicons}from'@expo/vector-icons';
const ImageSelector = props => {
    const verifyCameraPermissions=async()=>{
        const result= await Permissions.askAsync(Permissions.CAMERA,Permissions.CAMERA_ROLL);
        if (result.status!=='granted'){
            Alert.alert('Camera Permissions Declined!',
            'WeTing requires permission to use the camera and camera roll to take pictures of your product.',
            [{text:Okay}]
            );
            return false;
        }
        return true;
    }

    const takeImageHandler =async()=>{
        const hasPermission = await verifyCameraPermissions();
        if (!hasPermission){
            return;
        }
        ImagePicker.launchCameraAsync();
    }
    
    const galleryImageHandler=async()=>{
        const hasPermission = await verifyCameraPermissions();
        if (!hasPermission){
            return;
        }
        ImagePicker.launchImageLibraryAsync();
    }
    return (
        <View style={styles.imagePicker}>
            <View style={styles.imagePreview}>
                <Text>No image selected</Text>
                <Image style={styles.image}/>
            </View>
            <View style={styles.actions}>
            <Button title="Take Image" color={Colors.primary} onPress={takeImageHandler} />
            <Button title="Gallery" color={Colors.accent} onPress={galleryImageHandler} />
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    imagePicker:{
        alignItems:"center"
    },
    imagePreview:{
        width:'100%',
        height:200,
        marginBottom:10,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#ccc',
        borderWidth:1
    },
    image:{
        width:'100%',
        height:'100%'
    },
    actions:{
        flexDirection:"row",
        width:'100%'
    }
});
export default ImageSelector;
