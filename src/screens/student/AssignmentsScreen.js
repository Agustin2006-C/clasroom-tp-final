import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAssignmentsStart, fetchAssignmentsSuccess, fetchAssignmentsFailure } from '../../store/slices/assignmentSlice';
import { assignmentService } from '../../services/assignmentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { globalStyles } from '../../styles/globalStyles';
import { getStatusColor, getStatusText, formatDate, isOverdue } from '../../utils/helpers';

export default function AssignmentsScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const dispatch = useDispatch();
  const { assignments, loading } = useSelector(state => state.assignments);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    dispatch(fetchAssignmentsStart());
    try {
      const response = await assignmentService.getStudentAssignments();
      dispatch(fetchAssignmentsSuccess(response.assignments));
    } catch (error) {
      const message = error.response?.data?.message || 'Error al cargar tareas';
      dispatch(fetchAssignmentsFailure(message));
      Alert.alert('Error', message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAssignments();
    setRefreshing(false);
  };

  const handleSubmitPress = (assignment) => {
    setSelectedAssignment(assignment);
    navigation.navigate('SubmitAssignment', { assignment });
  };

  const renderAssignment = ({ item }) => {
    const status = item.submitted ? 'submitted' : isOverdue(item.dueDate) ? 'late' : 'pending';
    const statusColor = getStatusColor(status);
    const canSubmit = !item.submitted && !isOverdue(item.dueDate);

    return (
      <Card
        title={item.title}
        subtitle={`Profesor: ${item.teacher?.name}`}
        style={styles.assignmentCard}
      >
        <Text style={[globalStyles.body, styles.description]}>
          {item.description}
        </Text>

        <View style={[globalStyles.row, globalStyles.spaceBetween, styles.infoRow]}>
          <Text style={globalStyles.caption}>
            Vence: {formatDate(item.dueDate)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {getStatusText(status)}
            </Text>
          </View>
        </View>

        {item.submitted && item.grade && (
          <View style={[globalStyles.row, globalStyles.spaceBetween, styles.gradeRow]}>
            <Text style={globalStyles.caption}>Calificación:</Text>
            <Text style={styles.gradeText}>
              {item.grade}/{item.maxPoints || 10}
            </Text>
          </View>
        )}

        {item.submitted && item.feedback && (
          <View style={styles.feedbackSection}>
            <Text style={[globalStyles.caption, styles.feedbackLabel]}>Feedback:</Text>
            <Text style={[globalStyles.body, styles.feedbackText]}>
              {item.feedback}
            </Text>
          </View>
        )}

        {canSubmit && (
          <Button
            title="Entregar Tarea"
            onPress={() => handleSubmitPress(item)}
            style={styles.submitButton}
          />
        )}
      </Card>
    );
  };

  if (loading && assignments.length === 0) {
    return <Loading text="Cargando tareas..." />;
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={assignments}
        renderItem={renderAssignment}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  assignmentCard: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    marginBottom: 8,
  },
  gradeRow: {
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
  },
  feedbackSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  feedbackLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  feedbackText: {
    fontStyle: 'italic',
    color: '#666',
  },
  submitButton: {
    marginTop: 12,
  },
});