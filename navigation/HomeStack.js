import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingScreen from '../screens/SettingScreen';
import AddScreen from '../screens/AddScreen';
import ChatScreen from '../screens/ChatScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import EditScreen from "../screens/EditScreen";
import ChannelCreation from "../screens/ChannelCreation";
import Channel from "../screens/Channel";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const TabNavigation = () =>  {
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
export default function HomeStack() {
  return (
      <Stack.Navigator
          initialRouteName="Tab Navigation"
          screenOptions={{
            // headerShown: false
          }}
      >
          <Stack.Screen
          name="Home" 
          component={TabNavigation}
          options= {{ headerShown: false}}/>
          <Stack.Screen name="Edit" component={EditScreen} options={{headerStyle : {
              backgroundColor: 'white', color:'black'},}}/>
          <Stack.Screen name="Channel Creation" component={ChannelCreation} />
          <Stack.Screen name="Channel" component={Channel} />
      </Stack.Navigator>
  );
}
