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
import Loading from '../../components/common/Loading';
import { globalStyles } from '../../styles/globalStyles';
import { userAPI } from '../../services/api';

export default function TeacherPerformanceScreen({ navigation }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTeachersPerformance();
  }, []);

  const loadTeachersPerformance = async () => {
    try {
      const response = await userAPI.getUsers('teacher');
      const teachersData = response.data.users || [];

      // Simular datos de desempeño (en una app real esto vendría del backend)
      const teachersWithPerformance = teachersData.map(teacher => ({
        ...teacher,
        performance: {
          assignmentsCreated: Math.floor(Math.random() * 20) + 5,
          submissionsGraded: Math.floor(Math.random() * 50) + 10,
          averageGradingTime: (Math.random() * 48).toFixed(1),
          studentSatisfaction: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
          gradingRate: Math.floor(Math.random() * 40) + 60, // 60% - 100%
        }
      }));

      setTeachers(teachersWithPerformance);
    } catch (error) {
      const message = error.response?.data?.message || 'Error al cargar el desempeño';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeachersPerformance();
    setRefreshing(false);
  };

  const getPerformanceColor = (value, type) => {
    switch (type) {
      case 'satisfaction':
        return value >= 4.5 ? '#34C759' : value >= 3.5 ? '#FF9500' : '#FF3B30';
      case 'gradingRate':
        return value >= 90 ? '#34C759' : value >= 70 ? '#FF9500' : '#FF3B30';
      case 'gradingTime':
        return value <= 24 ? '#34C759' : value <= 48 ? '#FF9500' : '#FF3B30';
      default:
        return '#007AFF';
    }
  };

  const renderTeacher = ({ item }) => (
    <Card style={styles.teacherCard}>
      <View style={styles.teacherHeader}>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName}>{item.name}</Text>
          <Text style={styles.teacherEmail}>{item.email}</Text>
        </View>
        <View style={styles.satisfactionBadge}>
          <Text style={[styles.satisfactionText, { 
            color: getPerformanceColor(item.performance.studentSatisfaction, 'satisfaction') 
          }]}>
            ⭐ {item.performance.studentSatisfaction}
          </Text>
        </View>
      </View>

      <View style={styles.performanceGrid}>
        <View style={styles.performanceItem}>
          <Text style={styles.performanceValue}>
            {item.performance.assignmentsCreated}
          </Text>
          <Text style={styles.performanceLabel}>Tareas</Text>
        </View>
        <View style={styles.performanceItem}>
          <Text style={styles.performanceValue}>
            {item.performance.submissionsGraded}
          </Text>
          <Text style={styles.performanceLabel}>Calificadas</Text>
        </View>
        <View style={styles.performanceItem}>
          <Text style={[styles.performanceValue, { 
            color: getPerformanceColor(item.performance.averageGradingTime, 'gradingTime') 
          }]}>
            {item.performance.averageGradingTime}h
          </Text>
          <Text style={styles.performanceLabel}>Tiempo Prom.</Text>
        </View>
        <View style={styles.performanceItem}>
          <Text style={[styles.performanceValue, { 
            color: getPerformanceColor(item.performance.gradingRate, 'gradingRate') 
          }]}>
            {item.performance.gradingRate}%
          </Text>
          <Text style={styles.performanceLabel}>Tasa Calif.</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.detailsButton}
        onPress={() => navigation.navigate('TeacherDetail', { teacher: item })}
      >
        <Text style={styles.detailsButtonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </Card>
  );

  if (loading) {
    return <Loading text="Cargando desempeño de profesores..." />;
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={teachers}
        renderItem={renderTeacher}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={globalStyles.heading}>Desempeño de Profesores</Text>
            <Text style={[globalStyles.body, styles.subtitle]}>
              Monitoreo del rendimiento y actividad docente
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  teacherCard: {
    marginBottom: 16,
  },
  teacherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  teacherEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  satisfactionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
  },
  satisfactionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  performanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  detailsButton: {
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailsButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});