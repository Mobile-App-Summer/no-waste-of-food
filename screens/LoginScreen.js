import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Image,Button as RNButton } from 'react-native';

import { Button, InputField, ErrorMessage } from '../components';
import Firebase from '../config/firebase';

const auth = Firebase.auth();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye');
  const [loginError, setLoginError] = useState('');

  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const onLogin = async () => {
    try {
      if (email !== '' && password !== '') {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='dark-content' />
      <Text style={styles.title}>Login</Text>
      {/* LOGO */}
      <View style={styles.imageContainer}>
      <Image
        style={styles.tinyLogo}
        source={require('../assets/logo.png')}
      />
      </View>
      {/* LOGO */}
      {/* EMAIL */}
      <Text style={styles.text}>Email</Text>
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#ECBDB0',
          marginBottom: 20
        }}
        leftIcon='email'
        placeholder='Enter email'
        autoCapitalize='none'
        keyboardType='email-address'
        textContentType='emailAddress'
        autoFocus={true}
        value={email}
        onChangeText={text => setEmail(text)}
      />

      {/* Password */}
      <Text style={styles.text}>Password</Text>
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#ECBDB0',
          marginBottom: 20
        }}
        leftIcon='lock'
        placeholder='Enter password'
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={passwordVisibility}
        textContentType='password'
        rightIcon={rightIcon}
        value={password}
        onChangeText={text => setPassword(text)}
        handlePasswordVisibility={handlePasswordVisibility}
      />
      {loginError ? <ErrorMessage error={loginError} visible={true} /> : null}
      
      <View style={styles.buttonContainer}>
      <TouchableOpacity 
        onPress={onLogin}
        style={{alignItems:'center',justifyContent:'center', backgroundColor:'#E05A33', height: 45, width: 200, color: 'white'}}>
      <Text style={{fontSize:12,}}>SIGN IN</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Signup')}
        style={{alignItems:'center',justifyContent:'center',color: 'white'}}>
      <Text style={{fontSize:12,}}>You don't have an account?</Text>
      </TouchableOpacity>
      </View>
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
  imageContainer: {
    alignItems:'center',
    marginTop: 25
  },

  tinyLogo: {
    width: 294,
    height: 200,
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    alignSelf: 'center',
    paddingBottom: 24
  },

  buttonContainer:{
    fontSize: 25,
    color:'#fff', 
    alignItems:'center',
    justifyContent:'center', 
  },

  text:{
    marginTop: 15
  },
});
