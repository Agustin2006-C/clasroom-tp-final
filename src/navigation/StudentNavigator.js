import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Student Screens
import StudentDashboard from '../screens/student/StudentDashboard';
import AssignmentsScreen from '../screens/student/AssignmentsScreen';
import SubmissionsScreen from '../screens/student/SubmissionsScreen';
import SubmitAssignmentScreen from '../screens/student/SubmitAssignmentScreen';

const Stack = createStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Atrás',
      }}
    >
      <Stack.Screen 
        name="StudentDashboard" 
        component={StudentDashboard}
        options={{ 
          title: 'Mi Classroom',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Assignments" 
        component={AssignmentsScreen}
        options={{ 
          title: 'Tareas Disponibles',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Submissions" 
        component={SubmissionsScreen}
        options={{ 
          title: 'Mis Entregas',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="SubmitAssignment" 
        component={SubmitAssignmentScreen}
        options={{ 
          title: 'Entregar Tarea',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}