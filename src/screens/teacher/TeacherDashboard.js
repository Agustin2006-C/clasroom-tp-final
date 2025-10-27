import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { globalStyles } from '../../styles/globalStyles';
import { assignmentService } from '../../services/assignmentService';
import { calculateAverageGrade } from '../../utils/helpers';

export default function TeacherDashboard({ navigation }) {
  const [stats, setStats] = useState({
    totalAssignments: 0,
    totalSubmissions: 0,
    pendingGrading: 0,
    averageGrade: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await assignmentService.getTeacherAssignments();
      const assignments = response.assignments || [];
      
      // Calcular estadísticas
      const totalAssignments = assignments.length;
      let totalSubmissions = 0;
      let pendingGrading = 0;
      let allSubmissions = [];

      assignments.forEach(assignment => {
        totalSubmissions += assignment.stats?.totalSubmissions || 0;
        pendingGrading += assignment.stats?.pendingSubmissions || 0;
        
        // Aquí deberías tener acceso a las submissions para calcular el promedio
        // Por ahora usamos un cálculo simulado
        if (assignment.submissions) {
          allSubmissions = allSubmissions.concat(assignment.submissions);
        }
      });

      const averageGrade = calculateAverageGrade(allSubmissions);

      setStats({
        totalAssignments,
        totalSubmissions,
        pendingGrading,
        averageGrade,
      });

      // Asignaciones recientes (últimas 5)
      setRecentAssignments(assignments.slice(0, 5));

    } catch (error) {
      const message = error.response?.data?.message || 'Error al cargar el dashboard';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, subtitle, color = '#007AFF' }) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </Card>
  );

  if (loading) {
    return <Loading text="Cargando dashboard..." />;
  }

  return (
    <ScrollView 
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={globalStyles.title}>Hola, {user?.name}</Text>
        <Text style={globalStyles.subtitle}>Panel del Profesor</Text>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Tareas Creadas"
          value={stats.totalAssignments}
          color="#007AFF"
        />
        <StatCard
          title="Entregas Totales"
          value={stats.totalSubmissions}
          color="#34C759"
        />
        <StatCard
          title="Pendientes Calificar"
          value={stats.pendingGrading}
          color="#FF9500"
        />
        <StatCard
          title="Promedio General"
          value={stats.averageGrade}
          subtitle="/10"
          color="#5856D6"
        />
      </View>

      {/* Acciones Rápidas */}
      <Card title="Acciones Rápidas" style={styles.actionsCard}>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('CreateAssignment')}
          >
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionText}>Nueva Tarea</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('GradeSubmissions')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Calificar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('TeacherAssignments')}
          >
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionText}>Mis Tareas</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Tareas Recientes */}
      <Card title="Tareas Recientes" style={styles.recentCard}>
        {recentAssignments.length === 0 ? (
          <Text style={styles.noAssignmentsText}>
            Aún no has creado tareas
          </Text>
        ) : (
          recentAssignments.map((assignment) => (
            <TouchableOpacity 
              key={assignment._id}
              style={styles.assignmentItem}
              onPress={() => navigation.navigate('TeacherAssignments')}
            >
              <View style={styles.assignmentInfo}>
                <Text style={styles.assignmentTitle} numberOfLines={1}>
                  {assignment.title}
                </Text>
                <Text style={styles.assignmentStats}>
                  {assignment.stats?.totalSubmissions || 0} entregas • 
                  {assignment.stats?.gradedSubmissions || 0} calificadas
                </Text>
              </View>
              <Text style={styles.assignmentArrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
        {recentAssignments.length > 0 && (
          <Button
            title="Ver Todas las Tareas"
            onPress={() => navigation.navigate('TeacherAssignments')}
            variant="outline"
            style={styles.seeAllButton}
          />
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: '46%',
    margin: '2%',
    padding: 16,
    borderLeftWidth: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  actionsCard: {
    margin: 16,
    marginTop: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  recentCard: {
    margin: 16,
    marginTop: 8,
  },
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  assignmentInfo: {
    flex: 1,
    marginRight: 12,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  assignmentStats: {
    fontSize: 14,
    color: '#8E8E93',
  },
  assignmentArrow: {
    fontSize: 18,
    color: '#C7C7CC',
    fontWeight: 'bold',
  },
  noAssignmentsText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontStyle: 'italic',
    padding: 20,
  },
  seeAllButton: {
    marginTop: 16,
  },
});