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
import { useSelector } from 'react-redux';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { globalStyles } from '../../styles/globalStyles';
import { assignmentService } from '../../services/assignmentService';
import { formatDate } from '../../utils/helpers';

export default function TeacherAssignmentsScreen({ navigation }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await assignmentService.getTeacherAssignments();
      setAssignments(response.assignments || []);
    } catch (error) {
      const message = error.response?.data?.message || 'Error al cargar tareas';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAssignments();
    setRefreshing(false);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await assignmentService.deleteAssignment(assignmentId);
              setAssignments(prev => prev.filter(a => a._id !== assignmentId));
              Alert.alert('Éxito', 'Tarea eliminada correctamente');
            } catch (error) {
              const message = error.response?.data?.message || 'Error al eliminar la tarea';
              Alert.alert('Error', message);
            }
          },
        },
      ]
    );
  };

  const handleViewSubmissions = (assignment) => {
    navigation.navigate('GradeSubmissions', { assignment });
  };

  const renderAssignment = ({ item }) => (
    <Card style={styles.assignmentCard}>
      <View style={styles.assignmentHeader}>
        <Text style={globalStyles.cardTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleDeleteAssignment(item._id)}>
          <Text style={styles.deleteButton}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <Text style={[globalStyles.body, styles.description]}>
        {item.description}
      </Text>

      <View style={[globalStyles.row, globalStyles.spaceBetween, styles.infoRow]}>
        <Text style={globalStyles.caption}>
          Vence: {formatDate(item.dueDate)}
        </Text>
        <Text style={globalStyles.caption}>
          Puntos: {item.maxPoints}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {item.stats?.totalSubmissions || 0}
          </Text>
          <Text style={styles.statLabel}>Entregas</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {item.stats?.gradedSubmissions || 0}
          </Text>
          <Text style={styles.statLabel}>Calificadas</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {item.stats?.pendingSubmissions || 0}
          </Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Button
          title="Ver Entregas"
          onPress={() => handleViewSubmissions(item)}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Editar"
          onPress={() => navigation.navigate('EditAssignment', { assignment: item })}
          variant="outline"
          style={styles.actionButton}
        />
      </View>
    </Card>
  );

  if (loading) {
    return <Loading text="Cargando tus tareas..." />;
  }

  return (
    <View style={globalStyles.container}>
      {assignments.length === 0 ? (
        <View style={[globalStyles.container, globalStyles.center]}>
          <Text style={globalStyles.title}>No hay tareas</Text>
          <Text style={[globalStyles.body, styles.noAssignmentsText]}>
            Aún no has creado ninguna tarea.
          </Text>
          <Button
            title="Crear Primera Tarea"
            onPress={() => navigation.navigate('CreateAssignment')}
            style={styles.createButton}
          />
        </View>
      ) : (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  assignmentCard: {
    marginBottom: 16,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  deleteButton: {
    fontSize: 18,
    padding: 4,
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  noAssignmentsText: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  createButton: {
    marginHorizontal: 16,
  },
});