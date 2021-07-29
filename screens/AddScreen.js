import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {ActivityIndicator, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import Firebase from '../config/firebase';
import 'firebase/firestore';
import 'firebase/storage'
import { TextInput } from 'react-native-paper';

const auth = Firebase.auth();
const db = Firebase.firestore();
const storage = Firebase.storage();


export default function AddScreen() {
    const [loading, setLoading] = useState(false);
    const [foodName, setFoodName] = useState('');
    const [description, setDescription] = useState('');
    const [expirationDate, setExpirationDate] = useState(new Date())
    const [image, setImage] = useState('');
    const DEFAULT_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/nowaste-9ddd0.appspot.com/o/default.png?alt=media';

    const add = async() => {
        if (foodName === '') {
            alert('Food needs a name!')
            return;
        }
        const uid = auth?.currentUser?.uid;
        if (!uid) {
            alert('No authenticated user found!')
            return;
        }
        try {
            setLoading(true)
            const ref = await db.collection('foodTrackers').doc(uid).collection('foods').doc();
            const id = ref.id;

            if (image !== '') {
                uploadImage(image, id)
                    .then(response => {
                        console.log('image uploaded');
                        const uri = `https://firebasestorage.googleapis.com/v0/b/nowaste-9ddd0.appspot.com/o/${id}?alt=media`
                        saveToFireStore(id, ref, uri)
                    }).catch(error => alert(error.message()));

            } else {
                await saveToFireStore(id, ref, DEFAULT_IMAGE)
            }
        } catch (error) {
            setLoading(false)
            alert(error.message());
        }
    }

    const saveToFireStore = async (id, ref, imageUrl) => {
        ref.set({
            id,
            foodName,
            description,
            imageUrl: imageUrl,
            expiry: expirationDate,
            isConsumed: false,
        })
            .then(() => {
                setFoodName('')
                setDescription('')
                setImage('')
                setExpirationDate(new Date())
                setLoading(false);
                alert(`${foodName} added`)
            })
            .catch(error => {
                setLoading(false);
                alert(error.message())
            });
    }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || expirationDate;
        setExpirationDate(currentDate);
    };

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            quality: 0.5
        }).then(result => {
            console.log(result);
            if (!result.cancelled) {
                setImage(result.uri);
            }
        }).catch(error => alert(error.message()));
    };

    const uploadImage = async(uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        let ref = storage.ref().child(imageName);
        return ref.put(blob);
    }

    if (loading) {
        return (
            <View style={styles.preloader}>
                <ActivityIndicator size="large" color="#9E9E9E"/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style='dark-content'  />
            <Text  style={styles.text}>Add Food </Text>

            <Image source = {{uri:  image !== '' ? image : DEFAULT_IMAGE}}
                   style={{width: 200, height: 200}}
            />

            <View style={styles.inputContainer}>                
                <TextInput
                    label='Food name:'
                    style={styles.input}
                    autoFocus
                    type = 'text'
                    value={foodName}
                    onChangeText={(text) => setFoodName(text)}
                    color='#ECBDB0'
                />
                <TextInput
                    label='Summary:'
                    style={{backgroundColor:'#ECBDB0', marginTop: 10}}
                    color='#ECBDB0'
                    placeholder='tell us about this ingredient'
                    type ='text'
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    onSubmitEditing={add}
                />

                <View style={styles.dateContainer}>
                <Text style={{fontSize:18}}>Expiration Date: </Text>
                <DateTimePicker style={styles.datepicker}
                                 testID="dateTimePicker"
                                 value={expirationDate}
                                 mode={'date'}
                                 display="default"
                                 onChange={onDateChange}
                                 minimumDate={Date.now()}
                />
                </View>
            </View>
            <View style={styles.buttonContainer}>
            <TouchableOpacity
                    style={styles.button1}
                    onPress={pickImage}>
                    <Text style={{ color: 'white' }}> Pick an image </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button1}
                    onPress={add}>
                    <Text style={{ color: 'white' }}> Add Food </Text>
                </TouchableOpacity>             
            </View>
            <View style = {{ height: 100}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 50,
        alignItems : 'center',
        justifyContent: 'center',
    },
    inputContainer:{
        width: 300,
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000'
    },
    text: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000'
    },
    button: {
        marginTop: 10,
    },
    datepicker: {
        marginTop: 7,
        marginBottom: 10,
        width: 130,
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    input:{
        backgroundColor: '#ECBDB0',
        borderColor:"#ECBDB0",
        borderStyle:"solid",
    },
    dateContainer:{
        justifyContent: 'space-around',
        flexDirection:'row',
        alignItems:'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button1: {
        marginTop: 10,
        marginRight: 15,
        marginLeft: 15,
        padding: 10,
        backgroundColor: '#E05A33',
        color: 'white',
        alignItems: 'center',
        width: 130,
    },
});
