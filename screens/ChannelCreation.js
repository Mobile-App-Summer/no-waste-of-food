import React, { useState } from 'react';
import {StyleSheet, View} from 'react-native';
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

                <Button
                    title="Create Channel"
                    onPress={create}
                    containerStyle = {styles.button}
                />
                <Button
                    title="Cancel"
                    onPress={ () => navigation.navigate('Home', { screen: 'Chat' }) }
                    containerStyle = {styles.button}
                />
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
})