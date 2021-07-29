import React, { useEffect, useState } from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View, Button} from 'react-native';
import Firebase from '../config/firebase';
import { MaterialIcons } from '@expo/vector-icons';
import 'firebase/firestore';

const db = Firebase.firestore();
const auth = Firebase.auth();

const Item = React.memo(
    ({ item: { id, title, createdAt}, onPress }) => {

      return (
          <TouchableOpacity style ={styles.itemContainer} onPress={() => onPress({ id, title })}>
            <View style ={styles.textContainer}>
              <Text style ={styles.text}>{title}</Text>
            </View>
            <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color={"black"}
            />
          </TouchableOpacity>
      );
    }
);

export default function ChatScreen({navigation, route}) {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('channels')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const list = [];
          snapshot.forEach(doc => {
            list.push(doc.data());
          });
          setChannels(list);
        });

    return () => unsubscribe();
  }, []);

  const itemPress= params => {
    navigation.navigate('Channel', params);
  };

  return (
      <View style ={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>Message Boards</Text>
          <MaterialIcons
              name="add"
              size={26}
              style={{ margin: 10 }}
              onPress={() => navigation.navigate('Channel Creation')}
          />
        </View>

        <FlatList
            keyExtractor={item => item['id']}
            data={channels}
            renderItem={({ item }) => (
                <Item item={item} onPress={itemPress} />
            )}
            windowSize={3}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E05A33',
    padding: 15,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});

