import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, View,TouchableOpacity, Image as RNButton } from 'react-native';
import { Button, InputField, ErrorMessage } from '../components';
import Firebase from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

const auth = Firebase.auth();

export default function SettingScreen() {
  const { user } = useContext(AuthenticatedUserContext);
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye');

  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };
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
        <Text style={styles.title}>Setting</Text>

    {/* LOG OUT */}
      <TouchableOpacity 
          onPress={handleSignOut}
          style={{alignItems:'center',justifyContent:'center',color: 'white'}}>
      <Text style={{fontSize:12,}}>LOG OUT</Text>
      </TouchableOpacity>
    {/* LOG OUT */}
      </View>

      <View style={styles.imageContainer}>
     {/* IMage */}
      <Image
        style={styles.tinyLogo}
        source={require('../assets/setting.png')}
      />
    {/* IMage */}
      </View>

      <View style={styles.changeContainer}>
      <Text style={styles.text}>User name change</Text>
    {/* Name Change */}
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#ECBDB0',
          marginBottom: 20
        }}
        placeholder='Enter email'
        autoCapitalize='none'
        keyboardType='email-address'
        textContentType='emailAddress'
        autoFocus={true}
        value={userName}
        onChangeText={text => setUserName(text)}
        />
    {/* Name Change */}

      <Text style={styles.text}>Password change</Text>
    {/* Password Change */}
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
    {/* Password Change */}
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity 
      onPress={{}}
      style={{alignItems:'center',justifyContent:'center', backgroundColor:'#E05A33', height: 45, width: 200, color: 'white'}}>
     <Text style={{fontSize:12,}}>Submit</Text>
      </TouchableOpacity>

            {/* LOG OUT */}
                {/* <TouchableOpacity 
                    onPress={handleSignOut}
                    style={{alignItems:'center',justifyContent:'center', marginTop: 20, backgroundColor:'red', height: 45, width: 200, color: 'white'}}>
                    <Text style={{fontSize:12,}}>LOG OUT</Text>
                </TouchableOpacity> */}
            {/* LOG OUT */}
    </View>
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
    fontSize: 12,
    fontWeight: '600',
    color: 'black'
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'black',
    marginTop: 15
  },
  imageContainer: {
    alignItems:'center',
    marginTop: 25
  },

  tinyLogo: {
    width: 350,
    height: 250,
  },

  buttonContainer:{
    fontSize: 25,
    marginTop: 30,
    color:'white', 
    alignItems:'center',
    justifyContent:'center', 
  },

  changeContainer:{
      marginTop: 40,
  }
});
