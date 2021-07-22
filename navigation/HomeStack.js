import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingScreen from '../screens/SettingScreen';
import AddScreen from '../screens/AddScreen';
import ChatScreen from '../screens/ChatScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function HomeStack() {
  return (
      <Tab.Navigator
      initialRouteName="Home"
      activeColor="#E05A33"
      inactiveColor="#ECBDB0"
      barStyle={{ backgroundColor: 'white' }}>
        <Tab.Screen name='Home' 
        component={HomeScreen} 
        
        options={{
          tabBarLabel: 'Home',
          
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
        />
        <Tab.Screen name="Add" component={AddScreen} 
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ color }) => (
        <Ionicons name="add-circle-sharp" size={24} color={color} />          
        ),
        }}        
        />
        <Tab.Screen name="Chat" component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => (
            <Entypo name="chat" size={26} color={color} />          ),
        }}        
        />
        <Tab.Screen name="Settings" component={SettingScreen}
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({ color }) => (
            <AntDesign name="setting" size={26} color={color} />
          ),
        }}        
        />

      </Tab.Navigator>
  );
}
