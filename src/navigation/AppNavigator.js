import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';

// Role-based Navigators
import StudentNavigator from './StudentNavigator';
import TeacherNavigator from './TeacherNavigator';
import DirectorNavigator from './DirectorNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, role } = useSelector(state => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          {role === 'student' && (
            <Stack.Screen name="Main" component={StudentNavigator} />
          )}
          {role === 'teacher' && (
            <Stack.Screen name="Main" component={TeacherNavigator} />
          )}
          {role === 'director' && (
            <Stack.Screen name="Main" component={DirectorNavigator} />
          )}
        </>
      ) : (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            animationTypeForReplace: !isAuthenticated ? 'pop' : 'push',
          }}
        />
      )}
    </Stack.Navigator>
  );
}