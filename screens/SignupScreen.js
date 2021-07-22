import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Image,TouchableOpacity, Button as RNButton } from 'react-native';

import { Button, InputField, ErrorMessage } from '../components';
import Firebase from '../config/firebase';

const auth = Firebase.auth();

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye');
  const [signupError, setSignupError] = useState('');

  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const onHandleSignup = async () => {
    try {
      if (email !== '' && password !== '') {
        await auth.createUserWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setSignupError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='dark-content' />
      {/* LOGO */}
      <View style={styles.imageContainer}>
      <Image
        style={styles.tinyLogo}
        source={require('../assets/logo.png')}
      />
      </View>
      {/* LOGO */}

      <Text style={styles.text}>UserName</Text>
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#ECBDB0',
          marginBottom: 20
        }}
        leftIcon='person'
        placeholder='UserName'
        autoCapitalize='none'
        autoFocus={true}
        value={userName}
        onChangeText={text => setUserName(text)}
      />
      <Text style={styles.text}>Full Name</Text>
      
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#ECBDB0',
          marginBottom: 20
        }}
        leftIcon='person'
        placeholder='Name:'
        autoCapitalize='none'
        autoCorrect={false}
        textContentType='name'
        value={name}
        onChangeText={text => setName(text)}
      />
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
        placeholder='Email:'
        autoCapitalize='none'
        keyboardType='email-address'
        textContentType='emailAddress'
        autoFocus={true}
        value={email}
        onChangeText={text => setEmail(text)}
      />
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
        placeholder='Password:'
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={passwordVisibility}
        textContentType='password'
        rightIcon={rightIcon}
        value={password}
        onChangeText={text => setPassword(text)}
        handlePasswordVisibility={handlePasswordVisibility}
      />        

      {signupError ? <ErrorMessage error={signupError} visible={true} /> : null}
      <View style={styles.buttonContainer}>

      <TouchableOpacity 
      onPress={onHandleSignup}
      style={{alignItems:'center',justifyContent:'center', backgroundColor:'#E05A33', height: 45, width: 200, color: 'white'}}>
     <Text style={{fontSize:12,}}>SIGN UP</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      onPress={() => navigation.navigate('Login')}
      style={{alignItems:'center',justifyContent:'center'}}>
     <Text style={{fontSize:12,}}>Already have an account?</Text>
    </TouchableOpacity>
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 12,
  },

  tinyLogo: {
    width: 294,
    height: 200,
  },
  imageContainer: {
    alignItems:'center',
    marginTop: 100
  },
  text:{
    marginTop: 15
  },
  buttonContainer:{
    fontSize: 25,
    color:'white', 
    alignItems:'center',
    justifyContent:'center', 
  }
});
