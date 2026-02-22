import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadAchievementsScreen from './src/screens/UploadAchievementsScreen';
import SportsProfileScreen from './src/screens/SportsProfileScreen';
import SelectTestScreen from './src/screens/SelectTestScreen';
import TestInstructionsScreen from './src/screens/TestInstructionsScreen';
import UploadingDataScreen from './src/screens/UploadingDataScreen';
import UploadAssessmentScreen from './src/screens/UploadAssessmentScreen';

import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="UploadAchievements" component={UploadAchievementsScreen} />
          <Stack.Screen name="SportsProfile" component={SportsProfileScreen} />
          <Stack.Screen name="SelectTest" component={SelectTestScreen} />
          <Stack.Screen name="TestInstructions" component={TestInstructionsScreen} />
          <Stack.Screen name="UploadAssessment" component={UploadAssessmentScreen} />
          <Stack.Screen name="UploadingData" component={UploadingDataScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </Provider>
  );
}
