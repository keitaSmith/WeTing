import React, { useEffect, useCallback, useReducer, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Platform, Alert, KeyboardAvoidingView, Keyboard, Button, Image, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import { WaveIndicator } from 'react-native-indicators';
import HeaderButton from '../../components/UI/HeaderButton';
//import * as productsActions from '../../store/actions/products';
import * as producerActions from '../../store/actions/producers';
import Input from '../../components/UI/Input';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import Card from '../../components/UI/Card';
import { Ionicons, Entypo } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
const BecomeProducerScreen = props => {
    //const pickedImage = null;
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const [imageHeight, setImageHeight] = useState(200);
    const [isBlured, setIsBlured] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId)
    );
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [pickedDocument, setPickedDocument] = useState();
    const [pickedImage, setPickedImage] = useState();

    const [businessNameIsValid, setBusinessNameIsValid] = useState(false);
    const [descriptionIsValid, setDescriptionIsValid] = useState(false);
    const [pickedDocumentIsValid, setPickedDocumentIsValid] = useState(false);
    const [pickedImageIsValid, setPickedImageIsValid] = useState(false);
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
    const galleryImageHandler = async () => {
        const hasPermission = await verifyCameraPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            mediaTypes: "Images",
            allowsEditing: true,
            //aspect: [16, 9],
            quality: 0.5
        });
        //console.log(image);
        if (!image.cancelled) {
            setImageHeight(image.height / image.width * 200);
            setPickedImage(image.base64);
            setPickedImageIsValid(true);
        }
    }
    const documentHandler = async () => {
        console.log('selecting document');
        const document = await DocumentPicker.getDocumentAsync({});
        if (document.type === "success") {
            setPickedDocument(document);
            setPickedDocumentIsValid(true);
        }
    }
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            Alert.alert('An error has occured!', error, [{ text: 'Okay' }]);
        }
    }, [error])
 const submitHandler = useCallback(async () => {
         Keyboard.dismiss();
         if (!businessNameIsValid || !pickedImageIsValid || !pickedDocumentIsValid ||!descriptionIsValid) {
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
                 await dispatch(
                     producerActions.createProducer(
                         businessName,
                         pickedImage,
                         //pickedDocument,
                         description

                     )
                 );
                 props.navigation.navigate('Your_Shop');
     } catch (err) {
             setError(err.message)
         }
         setIsLoading(false);

     }, [dispatch,businessName,pickedImage,pickedDocument,description,businessNameIsValid,pickedImageIsValid,pickedDocumentIsValid,descriptionIsValid]);

     useEffect(() => {
         props.navigation.setParams({ submit: submitHandler });
}, [submitHandler]);
    let file;
    if (pickedDocument && pickedDocument.name.length < 30) {
        file = pickedDocument.name;
    }
    else {
        file = "Document Uploaded!"
    }
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
                            //value={businessName}//id="title"
                            id = "businessName"
                            val={businessName}
                            label="Business Name"
                            errorText="Please enter your Business Name!"
                            placeholder="required"
                            keyboardType="default"
                            autoCapitalize='words'
                            autoCorrect
                            returnKeyType="next"
                            onInputChange={(id,value,businessNameIsValid) => {
                                setBusinessName(value);
                                //console.log(businessName);
                                if (businessName !== '') {
                                    setBusinessNameIsValid(true);
                                } else {
                                    setBusinessNameIsValid(false);
                                }
                            }}
                            initialValue={''}
                            initiallyValid={false}
                            required
                            initiallyBlured={isBlured}
                        />
                        <View style={styles.imagePicker}>
                            <View style={{ height: imageHeight, width: 200, alignItems: 'center', justifyContent: 'center', borderColor: Colors.accent, borderWidth: 2 }}>
                                {!pickedImage ? <Text>Logo (required)</Text>
                                    : <Image style={{ height: imageHeight, width: 200 }} source={{ uri: `data:image/jpg;base64,${pickedImage}` }} />}
                            </View>
                            <View style={styles.actions}>
                                <View style={styles.actionLogo}>
                                    <TouchableCmp onPress={galleryImageHandler}>
                                        <View style={styles.actionIconLeft}>
                                            <Ionicons
                                                name={Platform.OS === 'android' ? 'md-image' : 'ios-image'}
                                                size={Platform.OS === 'android' ? 30 : 36}
                                                color={Platform.OS === 'android' ? 'white' : Colors.primary}
                                            />
                                        </View>
                                    </TouchableCmp>
                                </View>
                            </View>
                        </View>

                        <View style={styles.filePicker}>
                            <View style={styles.filePreview}>
                                {!pickedDocument ? (
                                    <View>
                                        <Text>Certificate of incorporation</Text>
                                        
                                    </View>)
                                    : (<View style={styles.file}><Text>{file}</Text>
                                        <Entypo
                                            name="check"
                                            size={30}
                                            color={Colors.accent} />
                                    </View>
                                    )
                                }
                                
                            </View>
                            
                            <View style={styles.actions}>
                                <View style={styles.actionCertificate}>
                                    <TouchableCmp onPress={documentHandler}>
                                        <View style={styles.actionIconLeft}>
                                            <Ionicons
                                                name={Platform.OS === 'android' ? 'md-paper' : 'ios-paper'}
                                                size={30}
                                                color={Platform.OS === 'android' ? 'white' : Colors.primary}
                                            />
                                        </View>
                                    </TouchableCmp>
                                </View>
                            </View>
                        </View>
                        <Text style={{color:"#ccc"}}>supports (pdf,png,jpg,docx)</Text>
                        <Input
                            id="description"
                            label="Description"
                            errorText="Please enter a valid description!"
                            placeholder="required"
                            keyboardType="default"
                            autoCapitalize="sentences"
                            autoCorrect
                            multiline
                            numberOfLines={3}
                            onInputChange={(id,value,descriptionIsValid)  => {
                                setDescription(value);
                                if (description !== '') {
                                    setDescriptionIsValid(true);
                                } else {
                                    setDescriptionIsValid(false);
                                }
                            }}
                            initialValue={''}
                            initiallyValid={false}
                            required
                            minLength={1}
                            initiallyBlured={isBlured}
                        />
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

BecomeProducerScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: 'Producer Sign Up',
        headerLeft: () =>
            (<HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }} />
            </HeaderButtons>),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Submit"
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
        padding: 10
    },
    filePicker: {
        alignItems: "center",
        marginTop: 10,
        flexDirection: "row"
    },
    imagePicker: {
        //width:'100%',
        marginTop: 10,
        //flexDirection: "row",
        justifyContent: 'space-between'

    },
    filePreview: {
        width: '75%',
        height: 40,

        justifyContent: 'center',
        borderColor: '#ccc',
        borderBottomWidth: 1
    },
    file: {
        flexDirection: "row",
        paddingHorizontal: 5,
        width: '90%'
    },
    imagePreview: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        width: 200,
        borderColor: Colors.accent,
        borderWidth: 1,
    },
    image: {
        width: '100%',
        height: '100%',

        resizeMode: 'contain',
        overlayColor: 'black'
    },
    actions: {
        alignSelf: 'flex-end',
        flexDirection: "row",
        width: '100%'
    },
    actionLogo: {
        width: 200,
        height: 40,
        backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
    },
    actionCertificate: {
        width: '25%',
        height: 40,
        backgroundColor: Platform.OS === 'android' ? Colors.primary : 'white',
    },
    actionIconLeft: {
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        height: 40

    },

});

export default BecomeProducerScreen;