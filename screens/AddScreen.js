import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Firebase from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';
import 'firebase/firestore';
import 'firebase/storage'

const auth = Firebase.auth();
const db = Firebase.firestore();
const storage = Firebase.storage();

export default function AddScreen() {
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
            //clear variables
        } catch (error) {
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
            isActive: true,
        })
            .then(response => {alert(`${foodName} added`)})
            .catch(error => alert(error.message()));
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
            mediaTypes: ImagePicker.MediaTypeOptions.All
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


    return (
        <View style={styles.container}>
            <StatusBar style='dark-content'  />

            <Image source = {{uri:  image !== '' ? image : DEFAULT_IMAGE}}
                   style={{width: 200, height: 200}}
            />

            <View style ={styles.inputContainer}>
                <Input
                    placeholder="Food"
                    autoFocus
                    type = 'text'
                    value={foodName}
                    onChangeText={(text) => setFoodName(text)}
                />
                <Input
                    placeholder='Description'
                    type ='text'
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    onSubmitEditing={add}
                />
                <Text>Expiration Date: </Text>
                <DateTimePicker
                    testID="dateTimePicker"
                    value={expirationDate}
                    mode={'date'}
                    display="default"
                    onChange={onDateChange}
                />
                <Button title="Pick an image" onPress={pickImage} />

            </View>

            <Button containerStyle = {styles.button} onPress={add} title="Add Food"/>

            <View style = {{ height: 100}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 50,
        paddingHorizontal: 12
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
        color: '#fff'
    },
    text: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000'
    },
    button: {
        marginTop: 10,
    },
});
