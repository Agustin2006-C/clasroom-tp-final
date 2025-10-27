import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Card from '../../components/common/Card';
import { globalStyles } from '../../styles/globalStyles';

export default function TeacherDetailScreen() {
  const route = useRoute();
  const { teacher } = route.params;

  return (
    <ScrollView style={globalStyles.container}>
      <Card style={styles.teacherCard}>
        <Text style={globalStyles.heading}>{teacher.name}</Text>
        <Text style={[globalStyles.body, styles.email]}>{teacher.email}</Text>
        
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estadísticas de Desempeño</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {teacher.performance?.assignmentsCreated || 0}
              </Text>
              <Text style={styles.statLabel}>Tareas Creadas</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {teacher.performance?.submissionsGraded || 0}
              </Text>
              <Text style={styles.statLabel}>Entregas Calificadas</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {teacher.performance?.averageGradingTime || 0}h
              </Text>
              <Text style={styles.statLabel}>Tiempo Promedio</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {teacher.performance?.studentSatisfaction || 0}/5
              </Text>
              <Text style={styles.statLabel}>Satisfacción</Text>
            </View>
          </View>
        </View>

        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Métricas Clave</Text>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Tasa de Calificación</Text>
            <Text style={styles.metricValue}>
              {teacher.performance?.gradingRate || 0}%
            </Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Feedback Promedio</Text>
            <Text style={styles.metricValue}>
              {teacher.performance?.feedbackQuality || 'N/A'}/5
            </Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Participación Activa</Text>
            <Text style={styles.metricValue}>
              {teacher.performance?.activeParticipation || '85%'}
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  teacherCard: {
    margin: 16,
  },
  email: {
    color: '#666',
    marginBottom: 20,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  metricsSection: {
    marginBottom: 16,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metricLabel: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});