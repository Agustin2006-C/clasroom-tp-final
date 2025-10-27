import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Input from '../../components/common/Input';
import { globalStyles } from '../../styles/globalStyles';
import { assignmentService } from '../../services/assignmentService';
import { formatDate } from '../../utils/helpers';

export default function GradeSubmissionsScreen({ route, navigation }) {
  const { assignment } = route.params || {};
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    if (assignment) {
      loadSubmissions();
    }
  }, [assignment]);

  const loadSubmissions = async () => {
    try {
      const response = await assignmentService.getAssignmentSubmissions(assignment._id);
      setSubmissions(response.submissions || []);
    } catch (error) {
      const message = error.response?.data?.message || 'Error al cargar entregas';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSubmissions();
    setRefreshing(false);
  };

  const openGradeModal = (submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade?.toString() || '');
    setFeedback(submission.feedback || '');
    setGradeModalVisible(true);
  };

  const closeGradeModal = () => {
    setGradeModalVisible(false);
    setSelectedSubmission(null);
    setGrade('');
    setFeedback('');
  };

  const handleGradeSubmission = async () => {
    if (!grade.trim()) {
      Alert.alert('Error', 'Por favor ingresa una calificación');
      return;
    }

    const gradeValue = parseFloat(grade);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > (assignment.maxPoints || 10)) {
      Alert.alert('Error', `La calificación debe estar entre 0 y ${assignment.maxPoints || 10}`);
      return;
    }

    setGrading(true);
    try {
      await assignmentService.gradeSubmission(selectedSubmission._id, {
        grade: gradeValue,
        feedback: feedback.trim(),
      });

      // Actualizar la lista local
      setSubmissions(prev => prev.map(sub => 
        sub._id === selectedSubmission._id 
          ? { 
              ...sub, 
              grade: gradeValue, 
              feedback: feedback.trim(),
              gradedAt: new Date().toISOString(),
              status: 'graded'
            }
          : sub
      ));

      Alert.alert('Éxito', 'Entrega calificada correctamente');
      closeGradeModal();
    } catch (error) {
      const message = error.response?.data?.message || 'Error al calificar la entrega';
      Alert.alert('Error', message);
    } finally {
      setGrading(false);
    }
  };

  const renderSubmission = ({ item }) => (
    <Card style={styles.submissionCard}>
      <View style={styles.submissionHeader}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.student?.name}</Text>
          <Text style={styles.studentEmail}>{item.student?.email}</Text>
        </View>
        {item.grade !== undefined && item.grade !== null ? (
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeText}>
              {item.grade}/{assignment.maxPoints || 10}
            </Text>
          </View>
        ) : (
          <Text style={styles.pendingText}>Pendiente</Text>
        )}
      </View>

      <Text style={[globalStyles.caption, styles.submittedDate]}>
        Entregado: {formatDate(item.submittedAt)}
      </Text>

      {item.comment && (
        <View style={styles.commentSection}>
          <Text style={[globalStyles.caption, styles.commentLabel]}>Comentario del estudiante:</Text>
          <Text style={[globalStyles.body, styles.commentText]}>{item.comment}</Text>
        </View>
      )}

      {item.files && item.files.length > 0 && (
        <View style={styles.filesSection}>
          <Text style={[globalStyles.caption, styles.filesLabel]}>
            Archivos adjuntos: {item.files.length}
          </Text>
        </View>
      )}

      {item.feedback && (
        <View style={styles.feedbackSection}>
          <Text style={[globalStyles.caption, styles.feedbackLabel]}>Tu feedback:</Text>
          <Text style={[globalStyles.body, styles.feedbackText]}>{item.feedback}</Text>
        </View>
      )}

      <Button
        title={item.grade !== undefined ? 'Modificar Calificación' : 'Calificar'}
        onPress={() => openGradeModal(item)}
        variant={item.grade !== undefined ? 'outline' : 'primary'}
        style={styles.gradeButton}
      />
    </Card>
  );

  if (loading) {
    return <Loading text="Cargando entregas..." />;
  }

  return (
    <View style={globalStyles.container}>
      {assignment && (
        <Card style={styles.assignmentHeaderCard}>
          <Text style={globalStyles.cardTitle}>{assignment.title}</Text>
          <Text style={[globalStyles.body, styles.assignmentDescription]}>
            {assignment.description}
          </Text>
          <View style={[globalStyles.row, globalStyles.spaceBetween]}>
            <Text style={globalStyles.caption}>
              Total de entregas: {submissions.length}
            </Text>
            <Text style={globalStyles.caption}>
              Puntos: {assignment.maxPoints}
            </Text>
          </View>
        </Card>
      )}

      <FlatList
        data={submissions}
        renderItem={renderSubmission}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={globalStyles.title}>No hay entregas</Text>
            <Text style={[globalStyles.body, styles.emptyText]}>
              Los estudiantes aún no han entregado esta tarea.
            </Text>
          </View>
        }
      />

      {/* Modal de Calificación */}
      <Modal
        visible={gradeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeGradeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={globalStyles.heading}>
              Calificar Entrega
            </Text>
            
            <Text style={[globalStyles.body, styles.modalStudent]}>
              Estudiante: {selectedSubmission?.student?.name}
            </Text>

            <Input
              label={`Calificación (0-${assignment?.maxPoints || 10})`}
              placeholder="Ingresa la calificación"
              value={grade}
              onChangeText={setGrade}
              keyboardType="numeric"
            />

            <Input
              label="Feedback (opcional)"
              placeholder="Proporciona feedback al estudiante"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                onPress={closeGradeModal}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title={grading ? "Calificando..." : "Guardar Calificación"}
                onPress={handleGradeSubmission}
                loading={grading}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  assignmentHeaderCard: {
    margin: 16,
    marginBottom: 8,
  },
  assignmentDescription: {
    marginBottom: 8,
  },
  submissionCard: {
    marginBottom: 16,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  gradeBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pendingText: {
    color: '#FF9500',
    fontSize: 14,
    fontWeight: '600',
  },
  submittedDate: {
    marginBottom: 8,
  },
  commentSection: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  commentLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    color: '#666',
  },
  filesSection: {
    marginBottom: 12,
  },
  filesLabel: {
    fontWeight: '600',
  },
  feedbackSection: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F0F8F0',
    borderRadius: 8,
  },
  feedbackLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  feedbackText: {
    color: '#666',
    fontStyle: 'italic',
  },
  gradeButton: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalStudent: {
    marginBottom: 16,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});