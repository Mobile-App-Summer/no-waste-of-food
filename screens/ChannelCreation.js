import React, { useState } from 'react';
import {StyleSheet, View,TouchableOpacity, Text} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Firebase from "../config/firebase";
import 'firebase/firestore';

const db = Firebase.firestore();

const ChannelCreation = ({ navigation }) => {

    const [title, setTitle] = useState('');
    const create = async () => {
        if (title === '') {
            alert('Please enter a title')
            return;
        }
        try {
            const ref = db.collection('channels').doc();
            const id = ref.id;
            await ref.set({
                id,
                title,
                createdAt: Date.now(),
            })
            navigation.replace('Channel', { id, title });
        } catch (error) {
            alert(error);
        }
    }

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            extraScrollHeight={25}>
            <View style={styles.container}>
                <Input
                    placeholder="Title"
                    autoFocus
                    type = 'text'
                    onChangeText={(text) => setTitle(text)}
                />

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button1}
                    onPress={create}>
                    <Text style={{ color: 'white' }}> Create Channel </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button1}
                    onPress={() => navigation.navigate('Home', { screen: 'Chat' })}>
                    <Text style={{ color: 'white' }}> Cancel </Text>
                </TouchableOpacity>
            </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default ChannelCreation;

const styles = StyleSheet.create({
    inputContainer:{
        width: 300,
        marginTop: 10,

    },

    container:{
        flex: 1,
        alignItems : 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',
    },

    button: {
        width: 200,
        marginTop: 10,
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
})