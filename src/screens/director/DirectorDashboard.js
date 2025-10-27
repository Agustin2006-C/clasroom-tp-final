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
import { useSelector } from 'react-redux';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { globalStyles } from '../../styles/globalStyles';
import { userAPI } from '../../services/api';

export default function DirectorDashboard({ navigation }) {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    activeAssignments: 0,
    totalSubmissions: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // En una implementación real, aquí llamarías a endpoints específicos del director
      // Por ahora simulamos datos
      const teachersResponse = await userAPI.getUsers('teacher');
      const studentsResponse = await userAPI.getUsers('student');

      setStats({
        totalTeachers: teachersResponse.data.users?.length || 0,
        totalStudents: studentsResponse.data.users?.length || 0,
        activeAssignments: 12, // Simulado
        totalSubmissions: 45, // Simulado
      });

      // Actividad reciente simulada
      setRecentActivity([
        { id: 1, type: 'assignment', message: 'Nueva tarea creada por Prof. García', time: '2 horas ago' },
        { id: 2, type: 'submission', message: '15 entregas nuevas en Matemáticas', time: '5 horas ago' },
        { id: 3, type: 'grading', message: 'Prof. López calificó 8 entregas', time: '1 día ago' },
        { id: 4, type: 'assignment', message: 'Tarea vencida: Historia Antigua', time: '2 días ago' },
      ]);

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

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assignment': return '📝';
      case 'submission': return '📤';
      case 'grading': return '📊';
      default: return '🔔';
    }
  };

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
        <Text style={globalStyles.title}>Bienvenido, {user?.name}</Text>
        <Text style={globalStyles.subtitle}>Panel del Director</Text>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Profesores"
          value={stats.totalTeachers}
          color="#007AFF"
        />
        <StatCard
          title="Estudiantes"
          value={stats.totalStudents}
          color="#34C759"
        />
        <StatCard
          title="Tareas Activas"
          value={stats.activeAssignments}
          color="#FF9500"
        />
        <StatCard
          title="Total Entregas"
          value={stats.totalSubmissions}
          color="#5856D6"
        />
      </View>

      {/* Acciones Rápidas */}
      <Card title="Acciones Rápidas" style={styles.actionsCard}>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('TeacherPerformance')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Desempeño</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Reports')}
          >
            <Text style={styles.actionIcon}>📈</Text>
            <Text style={styles.actionText}>Reportes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Próximamente', 'Gestión de usuarios en desarrollo')}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Usuarios</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Actividad Reciente */}
      <Card title="Actividad Reciente" style={styles.activityCard}>
        {recentActivity.map((activity) => (
          <TouchableOpacity 
            key={activity.id}
            style={styles.activityItem}
            onPress={() => Alert.alert('Actividad', activity.message)}
          >
            <Text style={styles.activityIcon}>
              {getActivityIcon(activity.type)}
            </Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityMessage}>
                {activity.message}
              </Text>
              <Text style={styles.activityTime}>
                {activity.time}
              </Text>
            </View>
            <Text style={styles.activityArrow}>›</Text>
          </TouchableOpacity>
        ))}
        <Button
          title="Ver Todas las Actividades"
          onPress={() => Alert.alert('Próximamente', 'Historial completo en desarrollo')}
          variant="outline"
          style={styles.seeAllButton}
        />
      </Card>

      {/* Resumen de Profesores */}
      <Card title="Resumen de Profesores" style={styles.teachersCard}>
        <View style={styles.teacherSummary}>
          <View style={styles.teacherStat}>
            <Text style={styles.teacherStatNumber}>{stats.totalTeachers}</Text>
            <Text style={styles.teacherStatLabel}>Total</Text>
          </View>
          <View style={styles.teacherStat}>
            <Text style={styles.teacherStatNumber}>
              {Math.round(stats.totalTeachers * 0.8)}
            </Text>
            <Text style={styles.teacherStatLabel}>Activos</Text>
          </View>
          <View style={styles.teacherStat}>
            <Text style={styles.teacherStatNumber}>
              {Math.round(stats.activeAssignments / stats.totalTeachers)}
            </Text>
            <Text style={styles.teacherStatLabel}>Tareas/Prom</Text>
          </View>
        </View>
        <Button
          title="Ver Desempeño Detallado"
          onPress={() => navigation.navigate('TeacherPerformance')}
          style={styles.detailedButton}
        />
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
  activityCard: {
    margin: 16,
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  activityArrow: {
    fontSize: 18,
    color: '#C7C7CC',
    fontWeight: 'bold',
  },
  seeAllButton: {
    marginTop: 16,
  },
  teachersCard: {
    margin: 16,
    marginTop: 8,
  },
  teacherSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  teacherStat: {
    alignItems: 'center',
  },
  teacherStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  teacherStatLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  detailedButton: {
    marginTop: 8,
  },
});