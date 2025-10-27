import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { updateAssignmentStart, updateAssignmentSuccess, updateAssignmentFailure } from '../../store/slices/assignmentSlice';
import { assignmentService } from '../../services/assignmentService';
import AssignmentForm from '../../components/forms/AssignmentForm';
import { globalStyles } from '../../styles/globalStyles';

export default function EditAssignmentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { assignment } = route.params;
  
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.auth.user);

  const handleUpdateAssignment = async (assignmentData) => {
    setLoading(true);
    dispatch(updateAssignmentStart());

    try {
      const result = await assignmentService.updateAssignment(assignment._id, assignmentData);
      
      if (result.success) {
        dispatch(updateAssignmentSuccess(result.assignment));
        Alert.alert(
          'Éxito',
          'Tarea actualizada correctamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        dispatch(updateAssignmentFailure(result.message));
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      dispatch(updateAssignmentFailure(error.message));
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <AssignmentForm
        initialValues={assignment}
        onSubmit={handleUpdateAssignment}
        loading={loading}
        submitButtonText="Actualizar Tarea"
      />
    </View>
  );
}