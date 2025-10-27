import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Director Screens
import DirectorDashboard from '../screens/director/DirectorDashboard';
import TeacherPerformanceScreen from '../screens/director/TeacherPerformanceScreen';
import ReportsScreen from '../screens/director/ReportsScreen';
import TeacherDetailScreen from '../screens/director/TeacherDetailScreen';

const Stack = createStackNavigator();

export default function DirectorNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#5856D6',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Atrás',
      }}
    >
      <Stack.Screen 
        name="DirectorDashboard" 
        component={DirectorDashboard}
        options={{ 
          title: 'Panel del Director',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="TeacherPerformance" 
        component={TeacherPerformanceScreen}
        options={{ 
          title: 'Desempeño de Profesores',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{ 
          title: 'Reportes y Analytics',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="TeacherDetail" 
        component={TeacherDetailScreen}
        options={({ route }) => ({ 
          title: `Detalle: ${route.params.teacher?.name || 'Profesor'}`,
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
}