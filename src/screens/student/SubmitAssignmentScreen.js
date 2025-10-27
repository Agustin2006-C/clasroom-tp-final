import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { submitAssignmentStart, submitAssignmentSuccess, submitAssignmentFailure } from '../../store/slices/assignmentSlice';
import { assignmentService } from '../../services/assignmentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { globalStyles } from '../../styles/globalStyles';
import { formatDate } from '../../utils/helpers';

export default function SubmitAssignmentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { assignment } = route.params;
  
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.auth.user);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Por favor agrega un comentario sobre tu entrega');
      return;
    }

    setLoading(true);
    dispatch(submitAssignmentStart());

    try {
      const submissionData = {
        assignmentId: assignment._id,
        comment: comment.trim(),
        // En una implementación real, aquí agregarías los archivos
      };

      const result = await assignmentService.submitAssignment(submissionData);
      
      if (result.success) {
        dispatch(submitAssignmentSuccess(result.submission));
        Alert.alert(
          'Éxito',
          'Tarea entregada correctamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        dispatch(submitAssignmentFailure(result.message));
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      dispatch(submitAssignmentFailure(error.message));
      Alert.alert('Error', 'No se pudo entregar la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Card style={styles.assignmentCard}>
        <Text style={globalStyles.heading}>{assignment.title}</Text>
        <Text style={[globalStyles.body, styles.description]}>
          {assignment.description}
        </Text>
        
        <View style={[globalStyles.row, globalStyles.spaceBetween, styles.infoRow]}>
          <Text style={globalStyles.caption}>
            Profesor: {assignment.teacher?.name}
          </Text>
          <Text style={globalStyles.caption}>
            Vence: {formatDate(assignment.dueDate)}
          </Text>
        </View>

        {assignment.instructions && (
          <View style={styles.instructionsSection}>
            <Text style={[globalStyles.caption, styles.instructionsLabel]}>
              Instrucciones:
            </Text>
            <Text style={[globalStyles.body, styles.instructionsText]}>
              {assignment.instructions}
            </Text>
          </View>
        )}
      </Card>

      <Card title="Tu Entrega" style={styles.submissionCard}>
        <Input
          label="Comentario (obligatorio)"
          placeholder="Describe tu entrega, incluye detalles importantes o comentarios para el profesor..."
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={styles.commentInput}
        />

        <View style={styles.filesSection}>
          <Text style={globalStyles.label}>Archivos Adjuntos</Text>
          <Text style={[globalStyles.caption, styles.filesInfo]}>
            Función de subida de archivos en desarrollo. Por ahora, incluye enlaces o descripciones en tu comentario.
          </Text>
        </View>

        <Button
          title={loading ? "Enviando..." : "Entregar Tarea"}
          onPress={handleSubmit}
          loading={loading}
          disabled={!comment.trim() || loading}
          style={styles.submitButton}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  assignmentCard: {
    margin: 16,
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    marginBottom: 8,
  },
  instructionsSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  instructionsLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionsText: {
    color: '#666',
  },
  submissionCard: {
    margin: 16,
    marginTop: 8,
  },
  commentInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  filesSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
  },
  filesInfo: {
    color: '#856404',
  },
  submitButton: {
    marginTop: 20,
  },
});