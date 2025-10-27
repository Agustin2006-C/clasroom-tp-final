import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { globalStyles } from '../../styles/globalStyles';

export default function ReportsScreen() {
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    {
      id: 1,
      title: 'Reporte de Actividad General',
      description: 'Resumen completo de tareas, entregas y calificaciones',
      icon: '📊',
      duration: 'Últimos 30 días',
    },
    {
      id: 2,
      title: 'Desempeño de Profesores',
      description: 'Análisis detallado del rendimiento docente',
      icon: '👨‍🏫',
      duration: 'Este mes',
    },
    {
      id: 3,
      title: 'Rendimiento de Estudiantes',
      description: 'Promedios y progreso académico',
      icon: '🎓',
      duration: 'Periodo actual',
    },
    {
      id: 4,
      title: 'Tareas y Entregas',
      description: 'Estadísticas de cumplimiento y calificaciones',
      icon: '📝',
      duration: 'Últimos 90 días',
    },
  ];

  const handleGenerateReport = (reportType) => {
    setGenerating(true);
    
    // Simular generación de reporte
    setTimeout(() => {
      setGenerating(false);
      Alert.alert(
        'Reporte Generado',
        `El reporte "${reportType.title}" ha sido generado exitosamente.`,
        [
          {
            text: 'Descargar PDF',
            onPress: () => Alert.alert('Descarga', 'Iniciando descarga...'),
          },
          {
            text: 'Ver Online',
            onPress: () => Alert.alert('Vista Online', 'Abriendo reporte...'),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    }, 2000);
  };

  const handleQuickReport = (type) => {
    Alert.alert(
      'Reporte Rápido',
      `Generando reporte ${type}...`,
      [
        {
          text: 'OK',
          onPress: () => Alert.alert('Listo', `Reporte ${type} generado`),
        },
      ]
    );
  };

  const handleExport = (format) => {
    Alert.alert(
      'Exportar Datos',
      `Exportando datos en formato ${format}...`,
      [
        {
          text: 'OK',
          onPress: () => Alert.alert('Éxito', `Datos exportados en ${format}`),
        },
      ]
    );
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={globalStyles.title}>Reportes y Analytics</Text>
        <Text style={globalStyles.subtitle}>
          Genera reportes detallados del sistema
        </Text>
      </View>

      {/* Reportes Rápidos */}
      <Card title="Reportes Rápidos" style={styles.quickReportsCard}>
        <View style={styles.quickReportsGrid}>
          <TouchableOpacity 
            style={styles.quickReportButton}
            onPress={() => handleQuickReport('de actividad')}
          >
            <Text style={styles.quickReportIcon}>🚀</Text>
            <Text style={styles.quickReportText}>Actividad</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickReportButton}
            onPress={() => handleQuickReport('de profesores')}
          >
            <Text style={styles.quickReportIcon}>👨‍🏫</Text>
            <Text style={styles.quickReportText}>Profesores</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickReportButton}
            onPress={() => handleQuickReport('de estudiantes')}
          >
            <Text style={styles.quickReportIcon}>🎓</Text>
            <Text style={styles.quickReportText}>Estudiantes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickReportButton}
            onPress={() => handleQuickReport('de tareas')}
          >
            <Text style={styles.quickReportIcon}>📚</Text>
            <Text style={styles.quickReportText}>Tareas</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Reportes Detallados */}
      <Card title="Reportes Detallados" style={styles.detailedReportsCard}>
        {reportTypes.map((report) => (
          <View key={report.id} style={styles.reportItem}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportIcon}>{report.icon}</Text>
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDescription}>{report.description}</Text>
                <Text style={styles.reportDuration}>{report.duration}</Text>
              </View>
            </View>
            <Button
              title={generating ? "Generando..." : "Generar Reporte"}
              onPress={() => handleGenerateReport(report)}
              loading={generating}
              variant="outline"
              style={styles.generateButton}
            />
          </View>
        ))}
      </Card>

      {/* Estadísticas Generales */}
      <Card title="Estadísticas Generales" style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Tareas Totales</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>892</Text>
            <Text style={styles.statLabel}>Entregas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>87%</Text>
            <Text style={styles.statLabel}>Tasa de Entrega</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>7.8</Text>
            <Text style={styles.statLabel}>Promedio General</Text>
          </View>
        </View>
      </Card>

      {/* Exportar Datos */}
      <Card title="Exportar Datos" style={styles.exportCard}>
        <Text style={[globalStyles.body, styles.exportDescription]}>
          Exporta los datos del sistema en diferentes formatos para análisis externos.
        </Text>
        <View style={styles.exportButtons}>
          <Button
            title="Exportar CSV"
            onPress={() => handleExport('CSV')}
            variant="outline"
            style={styles.exportButton}
          />
          <Button
            title="Exportar PDF"
            onPress={() => handleExport('PDF')}
            variant="outline"
            style={styles.exportButton}
          />
          <Button
            title="Exportar Excel"
            onPress={() => handleExport('Excel')}
            variant="outline"
            style={styles.exportButton}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  quickReportsCard: {
    margin: 16,
    marginTop: 8,
  },
  quickReportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickReportButton: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },
  quickReportIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickReportText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  detailedReportsCard: {
    margin: 16,
    marginTop: 8,
  },
  reportItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  reportDuration: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  generateButton: {
    marginTop: 8,
  },
  statsCard: {
    margin: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  exportCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  exportDescription: {
    marginBottom: 16,
    color: '#666',
    textAlign: 'center',
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exportButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});