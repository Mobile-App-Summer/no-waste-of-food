import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Firebase from '../config/firebase';
import 'firebase/firestore';

const auth = Firebase.auth();
const db = Firebase.firestore();

export default function AddScreen() {
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState(new Date())
  const [imageUrl, setImageUrl] = useState('https://i.pinimg.com/originals/94/ee/2f/94ee2fda4931c26b3c55ed23d28e885e.png');

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
          const ref = db.collection('foodTrackers').doc(uid).collection('foods').doc();
          const id = ref.id;
          await ref.set({
              id,
              foodName,
              description,
              expiry: expirationDate,
          })
          alert(`${foodName} added`);
          //clear variables
      } catch (error) {
          alert(error);
      }
  }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || expirationDate;
        setExpirationDate(currentDate);
    };


  return (
    <View style={styles.container}>
      <StatusBar style='dark-content'  />

      <Image source = {{
        uri: imageUrl,
      }}
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
