import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  StatusBar 
} from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userRole, setUserRole] = useState(null);

  // Pantalla de Login
  const LoginScreen = () => (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#007AFF" />
      <Text style={styles.title}>🎓 Classroom App</Text>
      <Text style={styles.subtitle}>Sistema de Gestión Educativa</Text>
      
      <View style={styles.loginContainer}>
        <TouchableOpacity 
          style={[styles.roleButton, styles.studentButton]}
          onPress={() => {
            setUserRole('student');
            setCurrentScreen('dashboard');
            Alert.alert('✅ Éxito', 'Bienvenido Estudiante');
          }}
        >
          <Text style={styles.roleIcon}>👨‍🎓</Text>
          <Text style={styles.roleButtonText}>Estudiante</Text>
          <Text style={styles.roleDescription}>Ver tareas y entregar trabajos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.roleButton, styles.teacherButton]}
          onPress={() => {
            setUserRole('teacher');
            setCurrentScreen('dashboard');
            Alert.alert('✅ Éxito', 'Bienvenido Profesor');
          }}
        >
          <Text style={styles.roleIcon}>👨‍🏫</Text>
          <Text style={styles.roleButtonText}>Profesor</Text>
          <Text style={styles.roleDescription}>Crear tareas y calificar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.roleButton, styles.directorButton]}
          onPress={() => {
            setUserRole('director');
            setCurrentScreen('dashboard');
            Alert.alert('✅ Éxito', 'Bienvenido Director');
          }}
        >
          <Text style={styles.roleIcon}>👨‍💼</Text>
          <Text style={styles.roleButtonText}>Director</Text>
          <Text style={styles.roleDescription}>Monitorear y generar reportes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>✅ Frontend funcionando</Text>
        <Text style={styles.statusText}>📱 Escanea el código QR</Text>
        <Text style={styles.statusText}>🚀 Listo para usar</Text>
      </View>
    </View>
  );

  // Pantalla de Dashboard
  const DashboardScreen = () => (
    <View style={styles.screen}>
      <StatusBar backgroundColor={userRole === 'student' ? '#34C759' : userRole === 'teacher' ? '#007AFF' : '#5856D6'} />
      
      <View style={styles.header}>
        <Text style={styles.welcomeTitle}>Bienvenido</Text>
        <Text style={styles.roleTitle}>
          {userRole === 'student' ? 'Estudiante' : 
           userRole === 'teacher' ? 'Profesor' : 'Director'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {userRole === 'student' && (
          <>
            {/* Tareas Pendientes */}
            <Text style={styles.sectionTitle}>📚 Tareas Pendientes</Text>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Matemáticas - Álgebra</Text>
                <Text style={styles.dueDate}>Vence: 30 Oct</Text>
              </View>
              <Text style={styles.cardDescription}>Resolver ecuaciones cuadráticas y problemas aplicados</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>📤 Entregar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>📄 Detalles</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Historia - Revolución</Text>
                <Text style={styles.dueDate}>Vence: 1 Nov</Text>
              </View>
              <Text style={styles.cardDescription}>Ensayo sobre causas y consecuencias de la revolución</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>📤 Entregar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>📄 Detalles</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tareas Calificadas */}
            <Text style={styles.sectionTitle}>✅ Tareas Calificadas</Text>
            <View style={[styles.card, styles.gradedCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Biología - Células</Text>
                <Text style={styles.grade}>9/10</Text>
              </View>
              <Text style={styles.feedback}>¡Excelente trabajo! Análisis muy detallado y preciso.</Text>
            </View>
          </>
        )}
        
        {userRole === 'teacher' && (
          <>
            {/* Acciones Rápidas */}
            <Text style={styles.sectionTitle}>🎯 Acciones Rápidas</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>➕</Text>
                <Text style={styles.quickActionText}>Nueva Tarea</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>📋</Text>
                <Text style={styles.quickActionText}>Calificar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>📊</Text>
                <Text style={styles.quickActionText}>Estadísticas</Text>
              </TouchableOpacity>
            </View>

            {/* Tareas Activas */}
            <Text style={styles.sectionTitle}>📝 Tareas Activas</Text>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Examen Matemáticas</Text>
                <View style={styles.stats}>
                  <Text style={styles.stat}>📊 15/23</Text>
                </View>
              </View>
              <Text style={styles.cardDescription}>Examen parcial de álgebra y geometría</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '65%' }]} />
                </View>
                <Text style={styles.progressText}>65% calificado</Text>
              </View>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>📋 Calificar Entregas</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        
        {userRole === 'director' && (
          <>
            {/* Estadísticas */}
            <Text style={styles.sectionTitle}>📈 Dashboard General</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>156</Text>
                <Text style={styles.statLabel}>Tareas Totales</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>892</Text>
                <Text style={styles.statLabel}>Entregas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>87%</Text>
                <Text style={styles.statLabel}>Tasa Entrega</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>7.8</Text>
                <Text style={styles.statLabel}>Promedio</Text>
              </View>
            </View>

            {/* Reportes */}
            <Text style={styles.sectionTitle}>📊 Reportes</Text>
            <TouchableOpacity style={[styles.card, styles.reportCard]}>
              <Text style={styles.cardTitle}>📈 Desempeño Profesores</Text>
              <Text style={styles.cardDescription}>Métricas y estadísticas de actividad docente</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.card, styles.reportCard]}>
              <Text style={styles.cardTitle}>🎓 Rendimiento Estudiantes</Text>
              <Text style={styles.cardDescription}>Análisis de progreso académico general</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Botón de cerrar sesión */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => {
          setCurrentScreen('login');
          Alert.alert('👋 Sesión cerrada', '¡Vuelve pronto!');
        }}
      >
        <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentScreen === 'login' ? <LoginScreen /> : <DashboardScreen />}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  screen: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  loginContainer: {
    marginBottom: 40,
  },
  roleButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  studentButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  teacherButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  directorButton: {
    borderLeftWidth: 4,
    borderLeftColor: '#5856D6',
  },
  roleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  roleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: '#f0f9f0',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  statusText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  gradedCard: {
    backgroundColor: '#f8fff8',
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  reportCard: {
    backgroundColor: '#f0f7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  dueDate: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '600',
  },
  grade: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  feedback: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 2,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  stats: {
    alignItems: 'flex-end',
  },
  stat: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
