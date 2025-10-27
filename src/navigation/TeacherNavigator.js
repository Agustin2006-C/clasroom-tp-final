import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Teacher Screens
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import CreateAssignmentScreen from '../screens/teacher/CreateAssignmentScreen';
import TeacherAssignmentsScreen from '../screens/teacher/TeacherAssignmentsScreen';
import GradeSubmissionsScreen from '../screens/teacher/GradeSubmissionsScreen';
import EditAssignmentScreen from '../screens/teacher/EditAssignmentScreen';

const Stack = createStackNavigator();

export default function TeacherNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#34C759',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Atrás',
      }}
    >
      <Stack.Screen 
        name="TeacherDashboard" 
        component={TeacherDashboard}
        options={{ 
          title: 'Panel del Profesor',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="CreateAssignment" 
        component={CreateAssignmentScreen}
        options={{ 
          title: 'Crear Nueva Tarea',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="TeacherAssignments" 
        component={TeacherAssignmentsScreen}
        options={{ 
          title: 'Mis Tareas',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="EditAssignment" 
        component={EditAssignmentScreen}
        options={{ 
          title: 'Editar Tarea',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="GradeSubmissions" 
        component={GradeSubmissionsScreen}
        options={{ 
          title: 'Calificar Entregas',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}