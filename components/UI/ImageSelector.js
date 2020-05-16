import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Image, Alert } from 'react-native';
import Colors from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
const ImageSelector = props => {
    const [pickedImage, setPickedImage] = useState();
    const verifyCameraPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (result.status !== 'granted') {
            Alert.alert('Camera Permissions Declined!',
                'WeTing requires permission to use the camera and camera roll to take pictures of your product.',
                [{ text: Okay }]
            );
            return false;
        }
        return true;
    }

    const takeImageHandler = async () => {
        const hasPermission = await verifyCameraPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchCameraAsync({
            base64:true,
            mediaTypes: "Images",
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5
        });
        console.log(image.base64);
        setPickedImage(image.uri);
    }

    const galleryImageHandler = async () => {
        const hasPermission = await verifyCameraPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchImageLibraryAsync({
            base64:true,
            mediaTypes: "Images",
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5
        });
        console.log(image);
        console.log(image.uri);
        setPickedImage(image.base64);
    }
    return (
        <View style={styles.imagePicker}>
            <View style={styles.imagePreview}>
                {!pickedImage ? <Text>No image selected</Text>
                    : <Image style={styles.image} source={{ uri: `data:image/jpg;base64,${pickedImage}` }} />}
            </View>
            <View style={styles.actions}>
                <View style={styles.action}>
                <Button title="Take Image" color={Colors.primary} onPress={takeImageHandler} />
                </View>
                <View style={styles.action}>
                <Button title="Gallery" color={Colors.accent} onPress={galleryImageHandler} />
                </View>
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    imagePicker: {
        alignItems: "center",
        marginTop:10
    },
    imagePreview: {
        width: '100%',
        height: 200,
        //marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1
    },
    image: {
        width: '100%',
        height: '100%'
    },
    actions: {
        flexDirection: "row",
        width: '100%'
    },
    action:{
        width:'50%'
    }
});
export default ImageSelector;
