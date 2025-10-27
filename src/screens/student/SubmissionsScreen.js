import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { globalStyles } from '../../styles/globalStyles';
import { formatDate, getStatusColor, getStatusText } from '../../utils/helpers';
import { assignmentService } from '../../services/assignmentService';

export default function SubmissionsScreen() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await assignmentService.getStudentSubmissions();
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

  const renderSubmission = ({ item }) => {
    const status = item.status || 'submitted';
    const statusColor = getStatusColor(status);

    return (
      <Card style={styles.submissionCard}>
        <Text style={globalStyles.cardTitle}>
          {item.assignment?.title}
        </Text>
        
        <View style={[globalStyles.row, globalStyles.spaceBetween, styles.infoRow]}>
          <Text style={globalStyles.caption}>
            Entregado: {formatDate(item.submittedAt)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {getStatusText(status)}
            </Text>
          </View>
        </View>

        {item.comment && (
          <View style={styles.commentSection}>
            <Text style={[globalStyles.caption, styles.commentLabel]}>Tu comentario:</Text>
            <Text style={[globalStyles.body, styles.commentText]}>
              {item.comment}
            </Text>
          </View>
        )}

        {item.files && item.files.length > 0 && (
          <View style={styles.filesSection}>
            <Text style={[globalStyles.caption, styles.filesLabel]}>
              Archivos: {item.files.length}
            </Text>
          </View>
        )}

        {item.grade !== undefined && item.grade !== null && (
          <View style={styles.gradeSection}>
            <View style={[globalStyles.row, globalStyles.spaceBetween]}>
              <Text style={[globalStyles.body, styles.gradeLabel]}>Calificación:</Text>
              <Text style={[globalStyles.body, styles.gradeValue]}>
                {item.grade}/{item.assignment?.maxPoints || 10}
              </Text>
            </View>
            {item.feedback && (
              <View style={styles.feedbackSection}>
                <Text style={[globalStyles.caption, styles.feedbackLabel]}>Feedback del profesor:</Text>
                <Text style={[globalStyles.body, styles.feedbackText]}>
                  {item.feedback}
                </Text>
              </View>
            )}
          </View>
        )}

        {item.gradedAt && (
          <Text style={[globalStyles.caption, styles.gradedAt]}>
            Calificado: {formatDate(item.gradedAt)}
          </Text>
        )}
      </Card>
    );
  };

  if (loading) {
    return <Loading text="Cargando tus entregas..." />;
  }

  return (
    <View style={globalStyles.container}>
      {submissions.length === 0 ? (
        <View style={[globalStyles.container, globalStyles.center]}>
          <Text style={globalStyles.title}>No hay entregas</Text>
          <Text style={[globalStyles.body, styles.noSubmissionsText]}>
            Aún no has entregado ninguna tarea.
          </Text>
        </View>
      ) : (
        <FlatList
          data={submissions}
          renderItem={renderSubmission}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  submissionCard: {
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
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
  gradeSection: {
    padding: 12,
    backgroundColor: '#F0F8F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  gradeLabel: {
    fontWeight: '600',
  },
  gradeValue: {
    fontWeight: 'bold',
    color: '#34C759',
    fontSize: 18,
  },
  feedbackSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  feedbackLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  feedbackText: {
    color: '#666',
    fontStyle: 'italic',
  },
  gradedAt: {
    textAlign: 'right',
    color: '#999',
  },
  noSubmissionsText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
});