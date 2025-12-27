import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StackNavigation from './src/navigations/StackNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { persistor, store } from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { StatusBar } from 'react-native'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StackNavigation />
          <StatusBar barStyle={'dark-content'} />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})