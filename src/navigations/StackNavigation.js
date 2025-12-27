import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login';
import Registration from '../screens/Registration';
import Home from '../screens/Home';
import ChatScreen from '../components/ChatScreen';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Registration' component={Registration} />
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='ChatScreen' component={ChatScreen} />
        </Stack.Navigator>
    )
}

export default StackNavigation

const styles = StyleSheet.create({})