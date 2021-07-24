import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, FlatList, SafeAreaView  } from 'react-native';
import Swipeout from "react-native-swipeout";
import { IconButton } from '../components';
import {Swipeable} from 'react-native-gesture-handler'
import Firebase from '../config/firebase';
import 'firebase/firestore';

const db = Firebase.firestore();

const auth = Firebase.auth();

export default function HomeScreen() {
    const [foodItems, setFoodItems] = useState([])
    useEffect(() => {
        const unsubscribe = db.collection('foodTrackers')
            .doc(auth.currentUser.uid)
            .collection('foods')
            .orderBy('expiry', 'asc')
            .onSnapshot(snapshot => {
                const list = [];
                snapshot.forEach(doc => {
                    list.push(doc.data());
                });
                setFoodItems(list);
            });

        return () => unsubscribe();
    }, []);

    const LeftAction = () => {
       return  (<View style={styles.leftAction}>
            <Text style={styles.textAction}> Consumed</Text>
        </View>)
    }

    const markConsumed = (item) => {
        db.collection('foodTrackers')
            .doc(auth.currentUser.uid)
            .collection('foods')
            .doc(item.id)
            .update({
                isConsumed: true
            })
    }

    const markNotConsumed = (item) => {
        db.collection('foodTrackers')
            .doc(auth.currentUser.uid)
            .collection('foods')
            .doc(item.id)
            .update({
                isConsumed: false
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='dark-content' />
            {/* LOGO */}
            <View style={styles.imageContainer}>
                <Image
                    style={styles.tinyLogo}
                    source={require('../assets/logo.png')}
                />
            </View>
            {/* LOGO */}
            <FlatList
                data={foodItems}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <Swipeable
                        renderLeftActions={LeftAction}
                        onSwipeableLeftOpen={() => markConsumed(item)}
                        onSwipeableClose={() => markNotConsumed(item)}
                    >
                        <View style={styles.textContainer}>
                            <Image
                                style={styles.thumbnail}
                                source={{uri: item.imageUrl}}
                            />
                            <Text
                                style={[
                                    styles.item,
                                    { textDecorationLine: item.isConsumed ?  "line-through" : "none" }
                                ]}>
                                {item.foodName}  {item.description} {item.expiry?.toDate()?.toDateString()}
                            </Text>
                        </View>
                    </Swipeable>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
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
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        backgroundColor: "black",
        color: "#05db6a"
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F3F3"
    },
    text: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#fff'
    },
    imageContainer: {
        alignItems:'center',
        marginTop: 25
    },

    tinyLogo: {
        width: 294,
        height: 200,
    },
    thumbnail: {
        width: 50,
        height: 50,
        marginLeft: 12,
        marginVertical: 5
    },
    leftAction: {
        backgroundColor: 'red',
        alignItems: "stretch",
        width: 400,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    textContainer: {
        backgroundColor: '#fff',
        width: 400,
        flexDirection: 'row',
        alignItems: "center",

    },
    textAction: {
        color: '#fff',
    },
});
