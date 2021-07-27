import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Button, StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';;
import * as ImagePicker from "expo-image-picker";
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import Firebase from '../config/firebase';
import 'firebase/firestore';
import 'firebase/storage'

const db = Firebase.firestore();
const auth = Firebase.auth();
const storage = Firebase.storage();

const EditScreen = ({ navigation, route: { params } }) => {
    const [loading, setLoading] = useState(false);
    const [foodName, setFoodName] = useState(params?.foodName);
    const [description, setDescription] = useState(params?.description);
    const [expirationDate, setExpirationDate] = useState(params?.expiry.toDate())
    const [image, setImage] = useState('');

    const update = async () => {
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
            const id = params.id
            const ref = await db.collection('foodTrackers').doc(uid).collection('foods').doc(id);

            if (image !== '') {
                uploadImage(image, id)
                    .then(() => {
                        console.log('image uploaded');
                        const uri = `https://firebasestorage.googleapis.com/v0/b/nowaste-9ddd0.appspot.com/o/${id}?alt=media&${Date.now()}`;
                        saveToFireStore(id, ref, uri);
                    }).catch(error => alert(error.message()));
            } else {
                await saveToFireStore(id, ref, params.imageUrl);
            }
        } catch (error) {
            alert(error.message());
            setLoading(false)
        }
    }

    const saveToFireStore = async (id, ref, imageUrl) => {
        ref.set({
            foodName,
            description,
            imageUrl: imageUrl,
            expiry: expirationDate,
        }, { merge: true }
        )
            .then(() => {
                setLoading(false);
                alert(`${foodName} updated`);
                navigation.navigate('Home');
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
            allowsEditing: true,
            quality: 0.5
        }).then(result => {
            if (!result.cancelled) {
                setImage(result.uri);
            }
        }).catch(error => alert(error.message()));
    };

    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        let ref = storage.ref().child(imageName);
        return ref.put(blob);
    };

    const deleteItem = async () => {
        db.collection('foodTrackers')
            .doc(auth.currentUser.uid)
            .collection('foods')
            .doc(params.id)
            .delete()
            .then(response => {
                alert(`${foodName} deleted`)
                navigation.navigate('Home');
            })
            .catch(error => alert(error.message()));
    };


    if (loading) {
        return (
            <View style={styles.preloader}>
                <ActivityIndicator size="large" color="#9E9E9E" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <StatusBar style='dark-content' />
            <Text style={styles.text}>Update {params.foodName}  </Text>

            <Image source={{ uri: image !== '' ? image : params?.imageUrl }}
                style={{ width: 200, height: 200 }}
            />

            <View style={styles.inputContainer}>
                <Input
                    autoFocus
                    type='text'
                    value={foodName}
                    onChangeText={(text) => setFoodName(text)}
                />
                <Input
                    placeholder='Description'
                    type='text'
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    onSubmitEditing={update}
                />                    
                <View style={styles.dateContainer}>
                <Text style={{fontSize:18}}>Expiration Date: </Text>

                    <DateTimePicker style={styles.datepicker}
                        textColor="red"
                        testID="dateTimePicker"
                        value={expirationDate}
                        mode={'date'}
                        display="default"
                        onChange={onDateChange}
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
                    onPress={update}>
                    <Text style={{ color: 'white' }}> Update Food </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => deleteItem()}
            >
                <Text style={{ color: 'white' }}> Delete Food </Text>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
        </View>
    );
}

export default EditScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
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
        color: '#000',
    },
    text: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000',
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#E05A33',
        color: 'white',
        alignItems: 'center',
        width: 130,

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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dateContainer:{
        justifyContent: 'space-around',
        flexDirection:'row',
        alignItems:'center',
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
});
