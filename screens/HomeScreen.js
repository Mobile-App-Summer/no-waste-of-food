import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler'
import Firebase from '../config/firebase';
import { Icon } from 'react-native-elements'
import 'firebase/firestore';

const db = Firebase.firestore();
const auth = Firebase.auth();

export default function HomeScreen({ navigation }) {
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

    const LeftAction = ({ item }) => {
        return (<View style={styles.leftAction}>
            <Text style={styles.textAction}> Consumed: {item.foodName}</Text>
        </View>);
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

    const faceType = (expiration) => {
        const expirationInMicroseconds = expiration.seconds * 1000;
        const numberOfDaysForMehFace = 7;
        const today = Date.now();
        const mehFace = today + (3600 * 24 * 1000 * numberOfDaysForMehFace)

        if (expirationInMicroseconds <= today) {
            return { face: 'frown-o', color: '#E05A33' };
        } else if (expirationInMicroseconds <= mehFace) {
            return { face: 'meh-o', color: '#ffa500' };
        }
        return { face: 'smile-o', color: '#00b300' };
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
            style={styles.flatlist}
                data={foodItems}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <Swipeable
                        renderLeftActions={() => <LeftAction item={item} />}
                        onSwipeableLeftOpen={() => markConsumed(item)}
                        onSwipeableClose={() => markNotConsumed(item)}

                    >
                        <TouchableOpacity style={styles.textContainer} onPress={() => navigation.navigate('Edit', item)} activeOpacity={1}>
                            <Image
                                style={styles.thumbnail}
                                source={{ uri: item.imageUrl }}
                            />
                            <View style={styles.inside}>
                                <Text
                                    style={[
                                        styles.item,
                                        { textDecorationLine: item.isConsumed ? "line-through" : "none" }
                                    ]}>
                                    {item.foodName}
                                </Text>
                                <Text style={styles.description}>
                                    {item.description}
                                </Text>
                                <Text style={styles.date}>
                                    {item.expiry?.toDate()?.toDateString()}
                                </Text>
                            </View>
                            <View style={styles.smile}>
                            <Icon

                                name={faceType(item.expiry).face}
                                type='font-awesome'
                                color={faceType(item.expiry).color}
                                size={35}
                            />
                            </View>
                        </TouchableOpacity>
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
    flatlist:{
        marginTop: 30,
    },
    item: {
        // padding: 15,
        marginLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F3F3",
    },
    inside: {
        marginRight: 20,
        marginLeft: 20,
        width: 230,

    },  

    description: {
        marginLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F3F3",
    },
    date: {
        marginLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F3F3",
        color: '#E05A33'
    },
    text: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#fff',

    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 25,
    },

    tinyLogo: {
        width: 294,
        height: 200,
    },
    thumbnail: {
        width: 50,
        height: 50,
        marginLeft: 18,
        marginVertical: 5,
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
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        width: 400,
    },
    textAction: {
        color: '#fff',

    },

    listContainer: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        backgroundColor: 'yellow',

    }
});
