import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { TouchableOpacity,Button, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '../components';
import Firebase from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

const auth = Firebase.auth();

export default function SettingScreen() {
  const { user } = useContext(AuthenticatedUserContext);
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style='dark-content' />
      <View style={styles.row}>
        {/* <Text style={styles.title}>Welcome</Text> */}

      <TouchableOpacity 
          onPress={handleSignOut}
          style={{alignItems:'center',justifyContent:'center',color: 'white'}}>
      <Text style={{fontSize:12,}}>LOG OUT</Text>
      </TouchableOpacity>

      </View>
      {/* <Text style={styles.text}>Your UID is: {user.uid} </Text> */}
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
    color: '#fff'
  }
});