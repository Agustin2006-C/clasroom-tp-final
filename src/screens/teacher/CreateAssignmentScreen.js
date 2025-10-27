import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import AssignmentForm from '../../components/forms/AssignmentForm';
import { assignmentService } from '../../services/assignmentService';
import { globalStyles } from '../../styles/globalStyles';

export default function CreateAssignmentScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.auth.user);

  const handleCreateAssignment = async (assignmentData) => {
    setLoading(true);
    try {
      await assignmentService.createAssignment(assignmentData);
      Alert.alert(
        'Éxito',
        'Tarea creada correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      const message = error.response?.data?.message || 'Error al crear la tarea';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <AssignmentForm
        onSubmit={handleCreateAssignment}
        loading={loading}
        submitButtonText="Crear Tarea"
      />
    </View>
  );
}