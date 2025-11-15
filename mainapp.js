import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert,
  StatusBar, Modal, KeyboardAvoidingView, Platform, Dimensions,
  useWindowDimensions, Linking
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from './store/slices/authSlice';
import { globalStyles } from './styles/globalStyles';
import { COLORS } from './utils/constants';

// Importa Google OAuth para Expo
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { jwtDecode } from 'jwt-decode';

// Configuración de WebBrowser
WebBrowser.maybeCompleteAuthSession();

// ========== HOOK RESPONSIVE ==========
const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;
  const isTablet = width >= 768;
  const isLandscape = width > height;
  
  return {
    width,
    height,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isTablet,
    isLandscape
  };
};

// ========== SERVICIO DE AUTENTICACIÓN COMPLETO ==========
const AuthService = {
  async loginUser(credentials) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const demoUsers = {
          'profesor@demo.com': {
            id: '1',
            name: 'Profesor Demo',
            email: 'profesor@demo.com',
            role: 'teacher',
            authProvider: 'email'
          },
          'director@demo.com': {
            id: '2', 
            name: 'Director Demo',
            email: 'director@demo.com',
            role: 'director',
            authProvider: 'email'
          },
          'estudiante@demo.com': {
            id: '3',
            name: 'Estudiante Demo',
            email: 'estudiante@demo.com',
            role: 'student',
            authProvider: 'email'
          }
        };

        const user = demoUsers[credentials.email];
        
        if (user && credentials.password === '123456') {
          resolve({
            success: true,
            user: user
          });
        } else {
          resolve({
            success: false,
            error: 'Credenciales inválidas'
          });
        }
      }, 1000);
    });
  },

  async registerUser(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          role: userData.role,
          authProvider: 'email'
        };

        resolve({
          success: true,
          user: newUser
        });
      }, 1000);
    });
  },

  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};

// ========== COMPONENTES DE MODAL COMPLETOS ==========

const AssignmentModal = React.memo(({ visible, onClose, onSubmit }) => {
  const { isSmallScreen, isTablet } = useResponsive();
  const [assignment, setAssignment] = useState({
    title: '', subject: '', description: '', dueDate: ''
  });

  const handleSubmit = () => {
    if (!assignment.title || !assignment.subject) {
      Alert.alert('Error', 'Por favor completa título y materia');
      return;
    }
    onSubmit(assignment);
    handleClose();
  };

  const handleClose = () => {
    setAssignment({ title: '', subject: '', description: '', dueDate: '' });
    onClose();
  };

  const modalWidth = isSmallScreen ? '95%' : isTablet ? '60%' : '85%';
  const modalMaxHeight = isSmallScreen ? '90%' : '85%';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      presentationStyle={isTablet ? 'pageSheet' : 'fullScreen'}
    >
      <View style={[globalStyles.container, globalStyles.center, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
        <View style={[globalStyles.card, { 
          width: modalWidth, 
          maxHeight: modalMaxHeight,
          marginHorizontal: isSmallScreen ? 10 : 0,
          borderRadius: isTablet ? 16 : 12,
        }]}>
          <ScrollView 
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={isSmallScreen ? { padding: 16 } : { padding: 20 }}
          >
            <View style={[globalStyles.rowBetween, globalStyles.mb16]}>
              <Text style={[
                globalStyles.heading, 
                isSmallScreen && { fontSize: 22 },
                isTablet && { fontSize: 26 }
              ]}>📝 Crear Tarea</Text>
              <TouchableOpacity onPress={handleClose} style={[globalStyles.buttonCircle, { backgroundColor: COLORS.danger + '20' }]}>
                <Text style={[globalStyles.buttonText, { color: COLORS.danger }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={globalStyles.mb16}>
              <Text style={[globalStyles.label, globalStyles.mb8]}>Título de la tarea</Text>
              <TextInput
                style={[
                  globalStyles.input, 
                  isSmallScreen && { fontSize: 16, padding: 14 },
                  isTablet && { fontSize: 18, padding: 16 }
                ]}
                placeholder="Ej: Matemáticas - Álgebra Lineal"
                value={assignment.title}
                onChangeText={(text) => setAssignment(prev => ({...prev, title: text}))}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
            
            <View style={globalStyles.mb16}>
              <Text style={[globalStyles.label, globalStyles.mb8]}>Materia</Text>
              <TextInput
                style={[
                  globalStyles.input, 
                  isSmallScreen && { fontSize: 16, padding: 14 },
                  isTablet && { fontSize: 18, padding: 16 }
                ]}
                placeholder="Ej: Matemáticas, Historia, Biología"
                value={assignment.subject}
                onChangeText={(text) => setAssignment(prev => ({...prev, subject: text}))}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
            
            <View style={globalStyles.mb16}>
              <Text style={[globalStyles.label, globalStyles.mb8]}>Descripción</Text>
              <TextInput
                style={[
                  globalStyles.input, 
                  { minHeight: isSmallScreen ? 100 : 120, textAlignVertical: 'top' },
                  isSmallScreen && { fontSize: 16, padding: 14 },
                  isTablet && { fontSize: 18, padding: 16 }
                ]}
                placeholder="Describe los detalles de la tarea..."
                value={assignment.description}
                onChangeText={(text) => setAssignment(prev => ({...prev, description: text}))}
                multiline
                numberOfLines={4}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
            
            <View style={globalStyles.mb24}>
              <Text style={[globalStyles.label, globalStyles.mb8]}>Fecha de entrega</Text>
              <TextInput
                style={[
                  globalStyles.input, 
                  isSmallScreen && { fontSize: 16, padding: 14 },
                  isTablet && { fontSize: 18, padding: 16 }
                ]}
                placeholder="YYYY-MM-DD"
                value={assignment.dueDate}
                onChangeText={(text) => setAssignment(prev => ({...prev, dueDate: text}))}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <View style={[
              globalStyles.rowBetween,
              isSmallScreen && { flexDirection: 'column' }
            ]}>
              <TouchableOpacity 
                style={[
                  globalStyles.button, 
                  globalStyles.buttonDanger, 
                  isSmallScreen ? globalStyles.fullWidth : globalStyles.flex1,
                  isSmallScreen ? globalStyles.mb12 : globalStyles.mr12,
                  isTablet && { paddingVertical: 16 }
                ]}
                onPress={handleClose}
              >
                <Text style={[
                  globalStyles.buttonText,
                  isSmallScreen && { fontSize: 16 },
                  isTablet && { fontSize: 18 }
                ]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  globalStyles.button, 
                  isSmallScreen ? globalStyles.fullWidth : globalStyles.flex1,
                  isSmallScreen ? null : globalStyles.ml12,
                  isTablet && { paddingVertical: 16 }
                ]}
                onPress={handleSubmit}
              >
                <Text style={[
                  globalStyles.buttonText,
                  isSmallScreen && { fontSize: 16 },
                  isTablet && { fontSize: 18 }
                ]}>Crear Tarea</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

const SubmissionModal = React.memo(({ visible, onClose, assignments, onSubmit, user }) => {
  const { isSmallScreen, isLargeScreen } = useResponsive();
  const [submission, setSubmission] = useState({ assignmentId: '', comments: '' });

  const handleSubmit = () => {
    if (!submission.assignmentId) {
      Alert.alert('Error', 'Por favor selecciona una tarea');
      return;
    }
    onSubmit(submission);
    handleClose();
  };

  const handleClose = () => {
    setSubmission({ assignmentId: '', comments: '' });
    onClose();
  };

  const modalWidth = isSmallScreen ? '95%' : isLargeScreen ? '70%' : '90%';
  const modalMaxHeight = isSmallScreen ? '85%' : '80%';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={[globalStyles.container, globalStyles.center, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[globalStyles.card, { 
          width: modalWidth, 
          maxHeight: modalMaxHeight 
        }]}>
          <ScrollView 
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={isSmallScreen ? { padding: 12 } : {}}
          >
            <Text style={[
              globalStyles.heading, 
              globalStyles.textCenter, 
              globalStyles.mb16,
              isSmallScreen && { fontSize: 20 }
            ]}>📤 Entregar Tarea</Text>
            
            <Text style={[
              globalStyles.label, 
              globalStyles.mb8,
              isSmallScreen && { fontSize: 14 }
            ]}>Selecciona la tarea:</Text>
            
            {assignments.map(assignment => (
              <TouchableOpacity 
                key={assignment.id}
                style={[
                  globalStyles.card,
                  globalStyles.mb8,
                  submission.assignmentId === assignment.id && { backgroundColor: COLORS.primary + '20' },
                  isSmallScreen && { padding: 10 }
                ]}
                onPress={() => setSubmission(prev => ({...prev, assignmentId: assignment.id}))}
              >
                <Text style={[
                  globalStyles.cardTitle,
                  submission.assignmentId === assignment.id && globalStyles.textPrimary,
                  isSmallScreen && { fontSize: 14 }
                ]}>
                  {assignment.title}
                </Text>
                <Text style={[
                  globalStyles.cardSubtitle,
                  submission.assignmentId === assignment.id && globalStyles.textPrimary,
                  isSmallScreen && { fontSize: 12 }
                ]}>
                  Vence: {assignment.dueDate}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TextInput
              style={[
                globalStyles.input, 
                globalStyles.mb16, 
                { minHeight: 80, textAlignVertical: 'top' },
                isSmallScreen && { fontSize: 14, padding: 10, minHeight: 60 }
              ]}
              placeholder="Comentarios (opcional)"
              value={submission.comments}
              onChangeText={(text) => setSubmission(prev => ({...prev, comments: text}))}
              multiline
              numberOfLines={3}
              placeholderTextColor={COLORS.textSecondary}
            />

            <View style={[
              globalStyles.rowBetween,
              isSmallScreen && { flexDirection: 'column' }
            ]}>
              <TouchableOpacity 
                style={[
                  globalStyles.button, 
                  globalStyles.buttonDanger, 
                  isSmallScreen ? globalStyles.fullWidth : globalStyles.flex1,
                  isSmallScreen ? globalStyles.mb8 : globalStyles.mr8
                ]}
                onPress={handleClose}
              >
                <Text style={[
                  globalStyles.buttonText,
                  isSmallScreen && { fontSize: 14 }
                ]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  globalStyles.button, 
                  isSmallScreen ? globalStyles.fullWidth : globalStyles.flex1,
                  isSmallScreen ? null : globalStyles.ml8
                ]}
                onPress={handleSubmit}
              >
                <Text style={[
                  globalStyles.buttonText,
                  isSmallScreen && { fontSize: 14 }
                ]}>Entregar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

const GradesModal = React.memo(({ visible, onClose, assignments, onGradeAssignment }) => {
  const { isSmallScreen, isLargeScreen } = useResponsive();
  const [grading, setGrading] = useState({ assignmentId: '', studentId: '', grade: '', feedback: '' });

  const handleGradeSubmit = (assignmentId, studentId) => {
    if (!grading.grade) {
      Alert.alert('Error', 'Por favor ingresa una calificación');
      return;
    }
    onGradeAssignment(assignmentId, studentId, grading);
    setGrading({ assignmentId: '', studentId: '', grade: '', feedback: '' });
  };

  const assignmentsToGrade = assignments.filter(assignment =>
    assignment.submissions.some(sub => sub.status === 'submitted')
  );

  const modalWidth = isSmallScreen ? '95%' : isLargeScreen ? '70%' : '90%';
  const modalMaxHeight = isSmallScreen ? '85%' : '80%';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[globalStyles.container, globalStyles.center, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[globalStyles.card, { 
          width: modalWidth, 
          maxHeight: modalMaxHeight 
        }]}>
          <ScrollView 
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={isSmallScreen ? { padding: 12 } : {}}
          >
            <Text style={[
              globalStyles.heading, 
              globalStyles.textCenter, 
              globalStyles.mb16,
              isSmallScreen && { fontSize: 20 }
            ]}>📋 Calificar Tareas</Text>
            
            {assignmentsToGrade.length > 0 ? (
              assignmentsToGrade.map(assignment => (
                <View key={assignment.id} style={globalStyles.mb16}>
                  <Text style={[
                    globalStyles.cardTitle, 
                    globalStyles.mb8,
                    isSmallScreen && { fontSize: 16 }
                  ]}>{assignment.title}</Text>
                  {assignment.submissions
                    .filter(sub => sub.status === 'submitted')
                    .map((submission, index) => (
                      <View key={index} style={[
                        globalStyles.card, 
                        globalStyles.mb8,
                        isSmallScreen && { padding: 10 }
                      ]}>
                        <Text style={[
                          globalStyles.cardTitle, 
                          globalStyles.mb8,
                          isSmallScreen && { fontSize: 14 }
                        ]}>
                          {submission.studentName}
                        </Text>
                        
                        <Text style={[
                          globalStyles.label, 
                          globalStyles.mb4,
                          isSmallScreen && { fontSize: 12 }
                        ]}>Comentarios del estudiante:</Text>
                        <Text style={[
                          globalStyles.body, 
                          globalStyles.mb8,
                          isSmallScreen && { fontSize: 12 }
                        ]}>{submission.comments || 'Sin comentarios'}</Text>
                        
                        <TextInput
                          style={[
                            globalStyles.input, 
                            globalStyles.mb8,
                            isSmallScreen && { fontSize: 14, padding: 10 }
                          ]}
                          placeholder="Calificación (ej: 9/10)"
                          value={grading.studentId === submission.studentId ? grading.grade : ''}
                          onChangeText={(text) => setGrading(prev => ({
                            ...prev, 
                            grade: text,
                            assignmentId: assignment.id,
                            studentId: submission.studentId
                          }))}
                          placeholderTextColor={COLORS.textSecondary}
                        />
                        
                        <TextInput
                          style={[
                            globalStyles.input, 
                            globalStyles.mb8, 
                            { minHeight: 60, textAlignVertical: 'top' },
                            isSmallScreen && { fontSize: 14, padding: 10, minHeight: 50 }
                          ]}
                          placeholder="Comentarios de retroalimentación"
                          value={grading.studentId === submission.studentId ? grading.feedback : ''}
                          onChangeText={(text) => setGrading(prev => ({...prev, feedback: text}))}
                          multiline
                          numberOfLines={2}
                          placeholderTextColor={COLORS.textSecondary}
                        />
                        
                        <TouchableOpacity 
                          style={[
                            globalStyles.button,
                            isSmallScreen && { paddingVertical: 10 }
                          ]}
                          onPress={() => handleGradeSubmit(assignment.id, submission.studentId)}
                        >
                          <Text style={[
                            globalStyles.buttonText,
                            isSmallScreen && { fontSize: 14 }
                          ]}>Calificar</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              ))
            ) : (
              <Text style={[
                globalStyles.body, 
                globalStyles.textCenter,
                isSmallScreen && { fontSize: 14 }
              ]}>
                No hay tareas pendientes por calificar.
              </Text>
            )}

            <TouchableOpacity 
              style={[
                globalStyles.button, 
                globalStyles.buttonDanger, 
                globalStyles.mt16,
                isSmallScreen && { paddingVertical: 10 }
              ]}
              onPress={onClose}
            >
              <Text style={[
                globalStyles.buttonText,
                isSmallScreen && { fontSize: 14 }
              ]}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

const ReportsModal = React.memo(({ visible, onClose, stats, onGenerateReport }) => {
  const { isSmallScreen, isLargeScreen } = useResponsive();

  const modalWidth = isSmallScreen ? '95%' : isLargeScreen ? '70%' : '90%';
  const modalMaxHeight = isSmallScreen ? '85%' : '80%';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[globalStyles.container, globalStyles.center, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[globalStyles.card, { 
          width: modalWidth, 
          maxHeight: modalMaxHeight 
        }]}>
          <ScrollView 
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={isSmallScreen ? { padding: 12 } : {}}
          >
            <Text style={[
              globalStyles.heading, 
              globalStyles.textCenter, 
              globalStyles.mb16,
              isSmallScreen && { fontSize: 20 }
            ]}>📊 Generar Reportes</Text>
            
            <View style={globalStyles.mb16}>
              <TouchableOpacity 
                style={[
                  globalStyles.card, 
                  globalStyles.mb8,
                  isSmallScreen && { padding: 12 }
                ]}
                onPress={() => onGenerateReport('general')}
              >
                <Text style={[
                  globalStyles.cardTitle, 
                  globalStyles.mb4,
                  isSmallScreen && { fontSize: 16 }
                ]}>📈 Reporte de Desempeño General</Text>
                <Text style={[
                  globalStyles.cardSubtitle,
                  isSmallScreen && { fontSize: 12 }
                ]}>Estadísticas completas del instituto</Text>
                <Text style={[
                  globalStyles.caption, 
                  globalStyles.mt4,
                  isSmallScreen && { fontSize: 11 }
                ]}>
                  Tareas: {stats.totalAssignments} | Entregas: {stats.totalSubmissions} | Tasa: {stats.submissionRate}%
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  globalStyles.card, 
                  globalStyles.mb8,
                  isSmallScreen && { padding: 12 }
                ]}
                onPress={() => onGenerateReport('teachers')}
              >
                <Text style={[
                  globalStyles.cardTitle, 
                  globalStyles.mb4,
                  isSmallScreen && { fontSize: 16 }
                ]}>👨‍🏫 Desempeño de Profesores</Text>
                <Text style={[
                  globalStyles.cardSubtitle,
                  isSmallScreen && { fontSize: 12 }
                ]}>Métricas de actividad docente</Text>
                <Text style={[
                  globalStyles.caption, 
                  globalStyles.mt4,
                  isSmallScreen && { fontSize: 11 }
                ]}>
                  Tareas creadas: {stats.totalAssignments} | Calificadas: {stats.gradedAssignments}%
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  globalStyles.card, 
                  globalStyles.mb8,
                  isSmallScreen && { padding: 12 }
                ]}
                onPress={() => onGenerateReport('students')}
              >
                <Text style={[
                  globalStyles.cardTitle, 
                  globalStyles.mb4,
                  isSmallScreen && { fontSize: 16 }
                ]}>🎓 Rendimiento Estudiantil</Text>
                <Text style={[
                  globalStyles.cardSubtitle,
                  isSmallScreen && { fontSize: 12 }
                ]}>Análisis de progreso académico general</Text>
                <Text style={[
                  globalStyles.caption, 
                  globalStyles.mt4,
                  isSmallScreen && { fontSize: 11 }
                ]}>
                  Promedio: {stats.averageGrade} | Entregas: {stats.totalSubmissions}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[
                globalStyles.button, 
                globalStyles.buttonDanger,
                isSmallScreen && { paddingVertical: 10 }
              ]}
              onPress={onClose}
            >
              <Text style={[
                globalStyles.buttonText,
                isSmallScreen && { fontSize: 14 }
              ]}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

// ========== BOTONES DE LOGIN SOCIAL COMPLETOS ==========

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState(null);
  const { isSmallScreen, isTablet } = useResponsive();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '688842671785-6ehdfm8u06u26k01h522ko5bqj02ir6e.apps.googleusercontent.com',
    webClientId: '688842671785-6ehdfm8u06u26k01h522ko5bqj02ir6e.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleSuccess(response);
    } else if (response?.type === 'error') {
      handleGoogleError(response);
    }
  }, [response]);

  const handleGoogleSuccess = async (response) => {
    setIsLoading(true);
    setGoogleError(null);
    dispatch(loginStart());
    
    try {
      const { authentication } = response;
      const decoded = jwtDecode(authentication.accessToken);
      
      const user = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        role: 'student',
        authProvider: 'google',
        emailVerified: decoded.email_verified,
        locale: decoded.locale,
        accessToken: authentication.accessToken
      };

      dispatch(loginSuccess(user));
      Alert.alert('✅ Éxito', `¡Bienvenido ${user.name}!`);
      
    } catch (error) {
      console.error('Google Login Error:', error);
      setGoogleError(error.message);
      dispatch(loginFailure(error.message));
      Alert.alert('❌ Error', 'Error al procesar el login con Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (errorResponse) => {
    console.log('Google Login Failed:', errorResponse);
    const errorMsg = errorResponse.error?.message || 'Error en autenticación de Google';
    setGoogleError(errorMsg);
    dispatch(loginFailure(errorMsg));
    Alert.alert('❌ Error', 'No se pudo completar el login con Google');
  };

  const handleGooglePress = () => {
    setGoogleError(null);
    promptAsync();
  };

  return (
    <View style={[globalStyles.flex1, isSmallScreen && globalStyles.mb12]}>
      <TouchableOpacity 
        style={[
          globalStyles.buttonSocial, 
          globalStyles.bgGoogle,
          globalStyles.flex1,
          !isSmallScreen && globalStyles.mr4,
          (isLoading || !request) && globalStyles.buttonDisabled,
          isSmallScreen && { paddingVertical: 16 },
          isTablet && { paddingVertical: 18 }
        ]}
        onPress={handleGooglePress}
        disabled={isLoading || !request}
      >
        <View style={[globalStyles.rowCenter, { justifyContent: 'center' }]}>
          <Text style={[
            globalStyles.buttonSocialText,
            isSmallScreen && { fontSize: 16 },
            isTablet && { fontSize: 18 }
          ]}>
            {isLoading ? '🔄' : '🔵'} {isLoading ? 'Conectando...' : 'Continuar con Google'}
          </Text>
        </View>
      </TouchableOpacity>
      
      {googleError && (
        <Text style={[globalStyles.captionSmall, globalStyles.textDanger, globalStyles.mt8, globalStyles.textCenter]}>
          {googleError}
        </Text>
      )}
    </View>
  );
};

const DiscordLoginButton = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [discordError, setDiscordError] = useState(null);
  const { isSmallScreen, isTablet } = useResponsive();

  const handleDiscordLoginAlternative = async () => {
    setIsLoading(true);
    setDiscordError(null);
    dispatch(loginStart());
    
    try {
      setTimeout(() => {
        const demoUser = {
          id: 'discord_' + Date.now(),
          name: 'Usuario Discord',
          email: 'usuario.discord@demo.com',
          role: 'student',
          authProvider: 'discord',
          picture: null,
          emailVerified: true,
          locale: 'es'
        };
        
        dispatch(loginSuccess(demoUser));
        Alert.alert('✅ Éxito', `¡Bienvenido ${demoUser.name}! (Demo)`);
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Discord Login Error:', error);
      setDiscordError(error.message);
      dispatch(loginFailure(error.message));
      Alert.alert('❌ Error', 'Error al iniciar sesión con Discord');
      setIsLoading(false);
    }
  };

  return (
    <View style={[globalStyles.flex1, isSmallScreen && globalStyles.mb12]}>
      <TouchableOpacity 
        style={[
          globalStyles.buttonSocial, 
          globalStyles.bgDiscord,
          globalStyles.flex1,
          !isSmallScreen && globalStyles.ml4,
          isLoading && globalStyles.buttonDisabled,
          isSmallScreen && { paddingVertical: 16 },
          isTablet && { paddingVertical: 18 }
        ]}
        onPress={handleDiscordLoginAlternative}
        disabled={isLoading}
      >
        <View style={[globalStyles.rowCenter, { justifyContent: 'center' }]}>
          <Text style={[
            globalStyles.buttonSocialText,
            isSmallScreen && { fontSize: 16 },
            isTablet && { fontSize: 18 }
          ]}>
            {isLoading ? '🔄' : '🟣'} {isLoading ? 'Conectando...' : 'Continuar con Discord'}
          </Text>
        </View>
      </TouchableOpacity>
      
      {discordError && (
        <Text style={[globalStyles.captionSmall, globalStyles.textDanger, globalStyles.mt8, globalStyles.textCenter]}>
          {discordError}
        </Text>
      )}
    </View>
  );
};

// ========== COMPONENTE PRINCIPAL COMPLETO ==========

const MainApp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', role: 'student'
  });
  const [modals, setModals] = useState({
    assignment: false, submission: false, grades: false, reports: false
  });
  
  // ESTADO LOCAL PARA AUTENTICACIÓN
  const [localAuth, setLocalAuth] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  const [assignments, setAssignments] = useState([
    { 
      id: '1', 
      title: 'Matemáticas - Álgebra Lineal', 
      subject: 'Matemáticas', 
      dueDate: '2024-12-30',
      description: 'Resolver problemas de ecuaciones lineales y matrices',
      submissions: [
        {
          studentId: 'estudiante@demo.com',
          studentName: 'Estudiante Demo',
          comments: 'Tuve dificultades con las matrices inversas',
          submittedAt: '2024-10-25',
          grade: '8/10',
          feedback: 'Buen trabajo, pero revisa el cálculo de matrices inversas',
          status: 'graded'
        }
      ]
    },
    { 
      id: '2', 
      title: 'Historia - Revolución Industrial', 
      subject: 'Historia', 
      dueDate: '2024-12-15',
      description: 'Ensayo sobre el impacto de la revolución industrial en la sociedad moderna',
      submissions: [
        {
          studentId: 'estudiante2@demo.com',
          studentName: 'Carlos López',
          comments: 'Enfoqué en los cambios sociales',
          submittedAt: '2024-10-28',
          grade: '',
          feedback: '',
          status: 'submitted'
        }
      ]
    }
  ]);

  const [stats, setStats] = useState({
    totalAssignments: 2,
    totalSubmissions: 2,
    submissionRate: 33,
    averageGrade: 8,
    gradedAssignments: 50
  });

  const dispatch = useDispatch();
  const reduxAuth = useSelector(state => state.auth);
  
  // USAR REDUX O ESTADO LOCAL
  const authState = reduxAuth.user ? reduxAuth : localAuth;
  const { user, isAuthenticated, isLoading } = authState;

  const { isSmallScreen, isMediumScreen, isLargeScreen, isTablet, isLandscape } = useResponsive();

  // ========== USE EFFECTS ==========
  useEffect(() => {
    updateStats();
  }, [assignments]);

  const updateStats = () => {
    const totalAssignments = assignments.length;
    const totalSubmissions = assignments.reduce((total, assignment) => 
      total + assignment.submissions.length, 0
    );
    
    const submissionRate = totalAssignments > 0 ? 
      Math.round((totalSubmissions / (totalAssignments * 3)) * 100) : 0;

    const allGrades = [];
    assignments.forEach(assignment => {
      assignment.submissions.forEach(submission => {
        if (submission.status === 'graded' && submission.grade) {
          if (submission.grade.includes('/')) {
            const [obtained, total] = submission.grade.split('/').map(Number);
            const numericGrade = total > 0 ? (obtained / total) * 10 : 0;
            if (numericGrade > 0) {
              allGrades.push(numericGrade);
            }
          }
        }
      });
    });

    const averageGrade = allGrades.length > 0 ? 
      allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length : 0;

    const gradedSubmissions = assignments.reduce((total, assignment) => 
      total + assignment.submissions.filter(sub => sub.status === 'graded').length, 0
    );
    
    const gradedAssignments = totalSubmissions > 0 ? 
      Math.round((gradedSubmissions / totalSubmissions) * 100) : 0;

    setStats({
      totalAssignments,
      totalSubmissions,
      submissionRate,
      averageGrade: Math.round(averageGrade * 10) / 10,
      gradedAssignments
    });
  };

  // ========== FUNCIÓN DE CERRAR SESIÓN COMPLETA ==========
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      `¿Estás seguro de que quieres cerrar sesión${user?.name ? `, ${user.name}` : ''}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, Cerrar Sesión', 
          style: 'destructive',
          onPress: () => {
            // 1. Cerrar sesión en Redux
            if (dispatch) {
              dispatch(logout());
            }
            
            // 2. Limpiar estado local
            setLocalAuth({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
            
            // 3. Limpiar formularios y estados
            setFormData({
              email: '',
              password: '',
              name: '',
              role: 'student'
            });
            
            setModals({
              assignment: false,
              submission: false,
              grades: false,
              reports: false
            });
            
            setIsLogin(true);
            
            setTimeout(() => {
              Alert.alert('✅ Sesión Cerrada', '¡Hasta pronto!');
            }, 300);
          }
        }
      ]
    );
  };

  // ========== FUNCIONES DE AUTENTICACIÓN COMPLETAS ==========
  const handleAuth = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa email y contraseña');
      return;
    }

    if (!isLogin && !formData.name) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return;
    }

    // Usar Redux si está disponible
    if (dispatch) {
      dispatch(loginStart());
    } else {
      setLocalAuth(prev => ({...prev, isLoading: true}));
    }

    try {
      let result;

      if (isLogin) {
        result = await AuthService.loginUser({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await AuthService.registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      }

      if (result.success) {
        if (dispatch) {
          dispatch(loginSuccess(result.user));
        } else {
          setLocalAuth({
            user: result.user,
            isAuthenticated: true,
            isLoading: false
          });
        }
        
        Alert.alert('✅ Éxito', `¡Bienvenido ${result.user.name}!`);
        
        if (!isLogin) {
          setFormData({
            email: '',
            password: '',
            name: '',
            role: 'student'
          });
        }
      } else {
        if (dispatch) {
          dispatch(loginFailure(result.error));
        } else {
          setLocalAuth(prev => ({...prev, isLoading: false}));
        }
        Alert.alert('❌ Error', result.error);
      }
    } catch (error) {
      if (dispatch) {
        dispatch(loginFailure(error.message));
      } else {
        setLocalAuth(prev => ({...prev, isLoading: false}));
      }
      Alert.alert('❌ Error', error.message);
    }
  };

  // ========== FUNCIONES DE GESTIÓN DE TAREAS COMPLETAS ==========
  const handleCreateAssignment = useCallback((assignmentData) => {
    const newAssignment = {
      id: Date.now().toString(),
      ...assignmentData,
      submissions: []
    };

    setAssignments(prev => [...prev, newAssignment]);
    Alert.alert('✅ Éxito', 'Tarea creada correctamente');
    setModals(prev => ({...prev, assignment: false}));
  }, []);

  const handleSubmitAssignment = useCallback((submissionData) => {
    const submission = {
      studentId: user.email,
      studentName: user.name,
      comments: submissionData.comments,
      submittedAt: new Date().toISOString().split('T')[0],
      grade: '',
      feedback: '',
      status: 'submitted'
    };

    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === submissionData.assignmentId
          ? { ...assignment, submissions: [...assignment.submissions, submission] }
          : assignment
      )
    );

    Alert.alert('✅ Éxito', 'Tarea entregada correctamente');
    setModals(prev => ({...prev, submission: false}));
  }, [user]);

  const handleGradeAssignment = useCallback((assignmentId, studentId, gradingData) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              submissions: assignment.submissions.map(submission =>
                submission.studentId === studentId
                  ? {
                      ...submission,
                      grade: gradingData.grade,
                      feedback: gradingData.feedback,
                      status: 'graded'
                    }
                  : submission
              )
            }
          : assignment
      )
    );

    Alert.alert('✅ Éxito', 'Tarea calificada correctamente');
    setModals(prev => ({...prev, grades: false}));
  }, []);

  const handleGenerateReport = useCallback((reportType) => {
    const reportTitles = {
      'general': 'Reporte de Desempeño General',
      'teachers': 'Desempeño de Profesores', 
      'students': 'Rendimiento Estudiantil'
    };

    const reportMessage = `
📊 ${reportTitles[reportType] || 'REPORTE'}

• Tareas Totales: ${stats.totalAssignments}
• Entregas Realizadas: ${stats.totalSubmissions}
• Tasa de Entrega: ${stats.submissionRate}%
• Promedio General: ${stats.averageGrade}/10
• Tareas Calificadas: ${stats.gradedAssignments}%

Estadísticas generadas el: ${new Date().toLocaleDateString()}
    `.trim();

    Alert.alert('📊 Reporte Generado', reportMessage);
    setModals(prev => ({...prev, reports: false}));
  }, [stats]);

  // ========== FUNCIONES AUXILIARES COMPLETAS ==========
  const getStudentAssignments = useCallback(() => {
    return assignments.map(assignment => {
      const studentSubmission = assignment.submissions.find(
        sub => sub.studentId === user?.email
      );
      return { ...assignment, studentSubmission };
    });
  }, [assignments, user]);

  const getAssignmentsToGrade = useCallback(() => {
    return assignments.filter(assignment =>
      assignment.submissions.some(sub => sub.status === 'submitted')
    );
  }, [assignments]);

  const renderQuickActions = useCallback((actions) => {
    if (isSmallScreen) {
      return (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={globalStyles.mb20}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          {actions.map((action, index) => (
            <View key={index} style={[globalStyles.mr12, { width: 140 }]}>
              {action}
            </View>
          ))}
        </ScrollView>
      );
    } else if (isMediumScreen) {
      return (
        <View style={[
          globalStyles.rowBetween, 
          globalStyles.mb20,
          { flexWrap: 'wrap', gap: 12 }
        ]}>
          {actions.map((action, index) => (
            <View key={index} style={{ width: '48%' }}>
              {action}
            </View>
          ))}
        </View>
      );
    } else {
      return (
        <View style={[
          globalStyles.rowBetween, 
          globalStyles.mb20,
          { gap: 16 }
        ]}>
          {actions.map((action, index) => (
            <View key={index} style={{ flex: 1 }}>
              {action}
            </View>
          ))}
        </View>
      );
    }
  }, [isSmallScreen, isMediumScreen, isLargeScreen]);

  // ========== RENDERIZADO DE PANTALLA DE LOGIN COMPLETO ==========
  const renderLoginScreen = () => {
    return (
      <KeyboardAvoidingView 
        style={globalStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={[
            globalStyles.flexGrow1, 
            globalStyles.justifyCenter,
            isLandscape && { paddingVertical: 40 },
            isTablet && { paddingVertical: 60 }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[
            globalStyles.p16, 
            globalStyles.center,
            isTablet && { maxWidth: 600, alignSelf: 'center', width: '100%' }
          ]}>
            <StatusBar backgroundColor={COLORS.primary} />
            
            {/* Header */}
            <View style={[globalStyles.mb24, globalStyles.center]}>
              <Text style={[
                globalStyles.title, 
                globalStyles.textCenter, 
                globalStyles.mb12,
                { 
                  fontSize: isSmallScreen ? 28 : isTablet ? 36 : 32,
                  fontWeight: '800'
                }
              ]}>🎓 Classroom Pro</Text>
              
              <Text style={[
                globalStyles.subtitle, 
                globalStyles.textCenter,
                { 
                  fontSize: isSmallScreen ? 18 : isTablet ? 22 : 20,
                  color: COLORS.textSecondary
                }
              ]}>
                {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta nueva'}
              </Text>
            </View>

            {/* Login con redes sociales */}
            <View style={[globalStyles.fullWidth, globalStyles.mb24]}>
              <View style={[
                globalStyles.rowBetween,
                isSmallScreen && { flexDirection: 'column' }
              ]}>
                <GoogleLoginButton />
                <DiscordLoginButton />
              </View>
              
              {/* Separador */}
              <View style={[globalStyles.dividerContainer, globalStyles.mt20, globalStyles.mb20]}>
                <View style={globalStyles.dividerLine} />
                <Text style={[
                  globalStyles.dividerText,
                  { fontSize: isSmallScreen ? 14 : 16 }
                ]}>o continúa con</Text>
                <View style={globalStyles.dividerLine} />
              </View>
            </View>

            {/* Formulario de login/registro */}
            <View style={[globalStyles.fullWidth]}>
              {!isLogin && (
                <View style={globalStyles.mb16}>
                  <Text style={[
                    globalStyles.label, 
                    globalStyles.mb8,
                    { fontSize: isSmallScreen ? 16 : 18 }
                  ]}>Nombre completo</Text>
                  <TextInput
                    style={[
                      globalStyles.input, 
                      isSmallScreen && { fontSize: 16, padding: 14 },
                      isTablet && { fontSize: 18, padding: 16 }
                    ]}
                    placeholder="Ingresa tu nombre completo"
                    value={formData.name}
                    onChangeText={(value) => setFormData(prev => ({...prev, name: value}))}
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>
              )}

              <View style={globalStyles.mb16}>
                <Text style={[
                  globalStyles.label, 
                  globalStyles.mb8,
                  { fontSize: isSmallScreen ? 16 : 18 }
                ]}>Correo electrónico</Text>
                <TextInput
                  style={[
                    globalStyles.input, 
                    isSmallScreen && { fontSize: 16, padding: 14 },
                    isTablet && { fontSize: 18, padding: 16 }
                  ]}
                  placeholder="tu.email@ejemplo.com"
                  value={formData.email}
                  onChangeText={(value) => setFormData(prev => ({...prev, email: value}))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>
              
              <View style={globalStyles.mb24}>
                <Text style={[
                  globalStyles.label, 
                  globalStyles.mb8,
                  { fontSize: isSmallScreen ? 16 : 18 }
                ]}>Contraseña</Text>
                <TextInput
                  style={[
                    globalStyles.input, 
                    isSmallScreen && { fontSize: 16, padding: 14 },
                    isTablet && { fontSize: 18, padding: 16 }
                  ]}
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChangeText={(value) => setFormData(prev => ({...prev, password: value}))}
                  secureTextEntry
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>

              {!isLogin && (
                <View style={globalStyles.mb24}>
                  <Text style={[
                    globalStyles.label, 
                    globalStyles.mb12,
                    { fontSize: isSmallScreen ? 16 : 18 }
                  ]}>Selecciona tu rol:</Text>
                  <View style={[
                    globalStyles.rowBetween, 
                    { gap: 12 },
                    isSmallScreen && { flexDirection: 'column' }
                  ]}>
                    <TouchableOpacity 
                      style={[
                        globalStyles.buttonRole,
                        globalStyles.flex1,
                        formData.role === 'student' && globalStyles.buttonRoleSelected
                      ]}
                      onPress={() => setFormData(prev => ({...prev, role: 'student'}))}
                    >
                      <Text style={[
                        globalStyles.buttonRoleText,
                        formData.role === 'student' && globalStyles.buttonRoleTextSelected,
                        { fontSize: isSmallScreen ? 14 : 16 }
                      ]}>
                        🎓 Estudiante
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        globalStyles.buttonRole,
                        globalStyles.flex1,
                        formData.role === 'teacher' && globalStyles.buttonRoleSelected
                      ]}
                      onPress={() => setFormData(prev => ({...prev, role: 'teacher'}))}
                    >
                      <Text style={[
                        globalStyles.buttonRoleText,
                        formData.role === 'teacher' && globalStyles.buttonRoleTextSelected,
                        { fontSize: isSmallScreen ? 14 : 16 }
                      ]}>
                        👨‍🏫 Profesor
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[
                        globalStyles.buttonRole,
                        globalStyles.flex1,
                        formData.role === 'director' && globalStyles.buttonRoleSelected
                      ]}
                      onPress={() => setFormData(prev => ({...prev, role: 'director'}))}
                    >
                      <Text style={[
                        globalStyles.buttonRoleText,
                        formData.role === 'director' && globalStyles.buttonRoleTextSelected,
                        { fontSize: isSmallScreen ? 14 : 16 }
                      ]}>
                        👨‍💼 Director
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TouchableOpacity 
                style={[
                  globalStyles.button, 
                  globalStyles.mb16,
                  isLoading && globalStyles.buttonDisabled,
                  isSmallScreen && { paddingVertical: 16 },
                  isTablet && { paddingVertical: 18 }
                ]}
                onPress={handleAuth}
                disabled={isLoading}
              >
                <Text style={[
                  globalStyles.buttonText,
                  isLoading && globalStyles.buttonDisabledText,
                  { fontSize: isSmallScreen ? 16 : 18 }
                ]}>
                  {isLoading ? '🔄 Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[globalStyles.center, globalStyles.py12]}
                onPress={() => {
                  setIsLogin(!isLogin);
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    role: 'student'
                  });
                }}
              >
                <Text style={[
                  globalStyles.textPrimary, 
                  globalStyles.bodySmall,
                  { fontSize: isSmallScreen ? 14 : 16, fontWeight: '500' }
                ]}>
                  {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                  <Text style={{ fontWeight: '700', textDecorationLine: 'underline' }}>
                    {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                  </Text>
                </Text>
              </TouchableOpacity>

              {/* Demo Login Buttons */}
              {isLogin && (
                <View style={[globalStyles.card, globalStyles.mt16]}>
                  <Text style={[globalStyles.caption, globalStyles.textCenter, globalStyles.mb8]}>
                    Acceso Rápido Demo:
                  </Text>
                  <View style={[
                    globalStyles.rowBetween,
                    isSmallScreen && { flexDirection: 'column' }
                  ]}>
                    <TouchableOpacity 
                      style={[
                        globalStyles.buttonSmall, 
                        globalStyles.bgPrimary, 
                        isSmallScreen ? globalStyles.fullWidth : globalStyles.flex1,
                        isSmallScreen ? globalStyles.mb8 : globalStyles.mr4
                      ]}
                      onPress={() => {
                        setFormData({
                          email: 'profesor@demo.com',
                          password: '123456',
                          name: '',
                          role: 'teacher'
                        });
                      }}
                    >
                      <Text style={globalStyles.buttonText}>👨‍🏫 Profesor</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        globalStyles.buttonSmall, 
                        globalStyles.bgWarning, 
                        isSmallScreen ? globalStyles.fullWidth : globalStyles.flex1,
                        isSmallScreen ? globalStyles.mb8 : globalStyles.mr4
                      ]}
                      onPress={() => {
                        setFormData({
                          email: 'director@demo.com',
                          password: '123456',
                          name: '',
                          role: 'director'
                        });
                      }}
                    >
                      <Text style={globalStyles.buttonText}>👨‍💼 Director</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[
                        globalStyles.buttonSmall, 
                        globalStyles.bgSuccess, 
                        isSmallScreen ? globalStyles.fullWidth : globalStyles.flex1,
                        isSmallScreen ? null : globalStyles.ml4
                      ]}
                      onPress={() => {
                        setFormData({
                          email: 'estudiante@demo.com',
                          password: '123456',
                          name: '',
                          role: 'student'
                        });
                      }}
                    >
                      <Text style={globalStyles.buttonText}>🎓 Estudiante</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  // ========== RENDERIZADO DEL DASHBOARD COMPLETO ==========
  const renderDashboard = () => {
    return (
      <View style={[globalStyles.container, { backgroundColor: COLORS.background }]}>
        <StatusBar backgroundColor={
          user?.role === 'student' ? COLORS.student : 
          user?.role === 'teacher' ? COLORS.teacher : COLORS.director
        } />
        
        {/* Header del Dashboard */}
        <View style={[
          globalStyles.content, 
          globalStyles.center,
          { 
            paddingTop: isSmallScreen ? 20 : 30, 
            paddingBottom: 20,
            backgroundColor: user?.role === 'student' ? COLORS.student : 
                            user?.role === 'teacher' ? COLORS.teacher : COLORS.director,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }
        ]}>
          <View style={[globalStyles.card, globalStyles.center]}>
            <View style={[
              globalStyles.rowBetween,
              globalStyles.fullWidth,
              isSmallScreen && { flexDirection: 'column' }
            ]}>
              <View style={[
                globalStyles.flex1,
                isSmallScreen && { marginBottom: 12, alignItems: 'center' }
              ]}>
                <Text style={[globalStyles.heading, globalStyles.mb8]}>¡Bienvenido de vuelta!</Text>
                <Text style={[globalStyles.subheading, globalStyles.textPrimary, globalStyles.mb8]}>
                  {user?.name || 'Usuario'}
                </Text>
                <Text style={globalStyles.body}>
                  {user?.role === 'student' ? '🎓 Estudiante' : 
                   user?.role === 'teacher' ? '👨‍🏫 Profesor' : 
                   user?.role === 'director' ? '👨‍💼 Director' : '👤 Usuario'}
                </Text>
              </View>
              
              {/* BOTÓN DE CERRAR SESIÓN CORREGIDO */}
              <TouchableOpacity 
                style={[
                  globalStyles.button, 
                  globalStyles.buttonDanger,
                  { 
                    minWidth: isSmallScreen ? '100%' : 120,
                    alignSelf: isSmallScreen ? 'stretch' : 'center'
                  }
                ]}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={globalStyles.buttonText}>
                  🚪 Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </View>
            
            {user?.authProvider && (
              <Text style={[globalStyles.caption, globalStyles.mb8]}>
                Conectado con: {user.authProvider === 'google' ? '🔵 Google' : 
                              user.authProvider === 'discord' ? '🟣 Discord' : '📧 Email'}
              </Text>
            )}
            <Text style={globalStyles.caption}>{user?.email || 'No email'}</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={globalStyles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* ESTUDIANTE */}
          {user?.role === 'student' && (
            <>
              <Text style={[globalStyles.subheading, globalStyles.mb8]}>📚 Mis Tareas</Text>
              
              {getStudentAssignments().length > 0 ? (
                getStudentAssignments().map(assignment => {
                  const studentSub = assignment.studentSubmission;
                  const isSubmitted = studentSub && studentSub.status !== 'pending';
                  
                  return (
                    <View key={assignment.id} style={[globalStyles.card, globalStyles.mb8]}>
                      <View style={[globalStyles.rowBetween, isSmallScreen && { flexDirection: 'column', alignItems: 'flex-start' }]}>
                        <Text style={[globalStyles.cardTitle, isSmallScreen && globalStyles.mb4]}>{assignment.title}</Text>
                        <Text style={[
                          globalStyles.caption, 
                          studentSub?.status === 'graded' ? globalStyles.textSuccess : 
                          studentSub?.status === 'submitted' ? globalStyles.textWarning : globalStyles.textDanger
                        ]}>
                          {studentSub?.status === 'graded' ? '✅ Calificada' : 
                           studentSub?.status === 'submitted' ? '📤 En revisión' : `Vence: ${assignment.dueDate}`}
                        </Text>
                      </View>
                      <Text style={[globalStyles.cardSubtitle, globalStyles.mb8]}>
                        Materia: {assignment.subject}
                      </Text>
                      
                      {studentSub?.status === 'graded' && (
                        <View style={[globalStyles.bgSuccess, globalStyles.p8, globalStyles.mb8, { borderRadius: 8, opacity: 0.9 }]}>
                          <View style={globalStyles.rowBetween}>
                            <Text style={[globalStyles.cardTitle, globalStyles.textWhite]}>Calificación: {studentSub.grade}</Text>
                          </View>
                          <Text style={[globalStyles.cardSubtitle, globalStyles.textWhite]}>
                            Feedback: {studentSub.feedback}
                          </Text>
                        </View>
                      )}
                      
                      <View style={[globalStyles.rowBetween, isSmallScreen && { flexDirection: 'column' }]}>
                        {!isSubmitted && (
                          <TouchableOpacity 
                            style={[
                              globalStyles.button, 
                              isSmallScreen ? globalStyles.fullWidth : globalStyles.flex1,
                              isSmallScreen ? globalStyles.mb8 : globalStyles.mr4
                            ]}
                            onPress={() => setModals(prev => ({...prev, submission: true}))}
                          >
                            <Text style={globalStyles.buttonText}>📤 Entregar</Text>
                          </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity 
                          style={[
                            globalStyles.buttonOutline, 
                            isSmallScreen ? globalStyles.fullWidth : globalStyles.flex1,
                            isSubmitted ? globalStyles.mr0 : (isSmallScreen ? null : globalStyles.ml4)
                          ]}
                        >
                          <Text style={globalStyles.buttonOutlineText}>📄 Detalles</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={[globalStyles.card, globalStyles.center, globalStyles.p16]}>
                  <Text style={[globalStyles.body, globalStyles.textCenter]}>
                    No tienes tareas asignadas actualmente.
                  </Text>
                </View>
              )}
            </>
          )}
          
          {/* PROFESOR */}
          {user?.role === 'teacher' && (
            <>
              <Text style={[globalStyles.subheading, globalStyles.mb8]}>🎯 Acciones Rápidas</Text>
                
              {renderQuickActions([
                <TouchableOpacity 
                  key="new-assignment"
                  style={[globalStyles.card, globalStyles.center, { height: 80 }]}
                  onPress={() => setModals(prev => ({...prev, assignment: true}))}
                >
                  <Text style={[globalStyles.heading, globalStyles.mb4]}>➕</Text>
                  <Text style={[globalStyles.caption, globalStyles.textCenter]}>Nueva Tarea</Text>
                </TouchableOpacity>,
                
                <TouchableOpacity 
                  key="grade"
                  style={[globalStyles.card, globalStyles.center, { height: 80 }]}
                  onPress={() => {
                    if (getAssignmentsToGrade().length > 0) {
                      setModals(prev => ({...prev, grades: true}));
                    } else {
                      Alert.alert('Info', 'No hay tareas pendientes por calificar');
                    }
                  }}
                >
                  <Text style={[globalStyles.heading, globalStyles.mb4]}>📋</Text>
                  <Text style={[globalStyles.caption, globalStyles.textCenter]}>Calificar</Text>
                </TouchableOpacity>,
                
                <TouchableOpacity 
                  key="stats"
                  style={[globalStyles.card, globalStyles.center, { height: 80 }]}
                  onPress={() => setModals(prev => ({...prev, reports: true}))}
                >
                  <Text style={[globalStyles.heading, globalStyles.mb4]}>📊</Text>
                  <Text style={[globalStyles.caption, globalStyles.textCenter]}>Estadísticas</Text>
                </TouchableOpacity>
              ])}

              <Text style={[globalStyles.subheading, globalStyles.mb8]}>📝 Tareas Activas</Text>
              {assignments.map(assignment => {
                const submittedCount = assignment.submissions.filter(sub => sub.status === 'submitted' || sub.status === 'graded').length;
                const gradedCount = assignment.submissions.filter(sub => sub.status === 'graded').length;
                const progress = submittedCount > 0 ? (gradedCount / submittedCount) * 100 : 0;
                
                return (
                  <View key={assignment.id} style={[globalStyles.card, globalStyles.mb8]}>
                    <View style={globalStyles.rowBetween}>
                      <Text style={globalStyles.cardTitle}>{assignment.title}</Text>
                      <Text style={globalStyles.caption}>📊 {submittedCount} entregados</Text>
                    </View>
                    <Text style={[globalStyles.cardSubtitle, globalStyles.mb8]}>
                      {assignment.description}
                    </Text>
                    
                    {/* Progress Bar */}
                    <View style={globalStyles.mb8}>
                      <View style={[globalStyles.bgLight, { height: 6, borderRadius: 3 }]}>
                        <View style={[
                          globalStyles.bgPrimary, 
                          { width: `${progress}%`, height: '100%', borderRadius: 3 }
                        ]} />
                      </View>
                      <Text style={[globalStyles.captionSmall, globalStyles.mt4]}>
                        {Math.round(progress)}% calificado ({gradedCount}/{submittedCount})
                      </Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={globalStyles.button}
                      onPress={() => {
                        if (submittedCount > 0) {
                          setModals(prev => ({...prev, grades: true}));
                        } else {
                          Alert.alert('Info', 'No hay entregas para esta tarea');
                        }
                      }}
                    >
                      <Text style={globalStyles.buttonText}>📋 Calificar Entregas</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </>
          )}
          
          {/* DIRECTOR */}
          {user?.role === 'director' && (
            <>
              <Text style={[globalStyles.subheading, globalStyles.mb8]}>📈 Dashboard General</Text>
                
              <View style={[globalStyles.rowBetween, globalStyles.mb16, isSmallScreen && { flexDirection: 'column' }]}>
                {[
                  { value: stats.totalAssignments, label: 'Tareas Totales', color: COLORS.primary },
                  { value: stats.totalSubmissions, label: 'Entregas', color: COLORS.success },
                  { value: `${stats.submissionRate}%`, label: 'Tasa Entrega', color: COLORS.warning },
                  { value: stats.averageGrade, label: 'Promedio', color: COLORS.info }
                ].map((stat, index) => (
                  <View 
                    key={index}
                    style={[
                      globalStyles.card, 
                      globalStyles.center, 
                      globalStyles.flex1,
                      globalStyles.m4,
                      { backgroundColor: stat.color + '15', borderColor: stat.color + '30' },
                      isSmallScreen && { width: '48%', marginBottom: 8 }
                    ]}
                  >
                    <Text style={[globalStyles.heading, { color: stat.color }]}>{stat.value}</Text>
                    <Text style={[globalStyles.caption, { color: stat.color }]}>{stat.label}</Text>
                  </View>
                ))}
              </View>

              {renderQuickActions([
                <TouchableOpacity 
                  key="reports"
                  style={[globalStyles.card, globalStyles.center, { height: 80 }]}
                  onPress={() => setModals(prev => ({...prev, reports: true}))}
                >
                  <Text style={[globalStyles.heading, globalStyles.mb4]}>📊</Text>
                  <Text style={[globalStyles.caption, globalStyles.textCenter]}>Reportes</Text>
                </TouchableOpacity>,
                
                <TouchableOpacity 
                  key="analytics"
                  style={[globalStyles.card, globalStyles.center, { height: 80 }]}
                  onPress={() => {
                    Alert.alert('📈 Análisis', 'Funcionalidad de análisis en desarrollo');
                  }}
                >
                  <Text style={[globalStyles.heading, globalStyles.mb4]}>📈</Text>
                  <Text style={[globalStyles.caption, globalStyles.textCenter]}>Análisis</Text>
                </TouchableOpacity>,
                
                <TouchableOpacity 
                  key="management"
                  style={[globalStyles.card, globalStyles.center, { height: 80 }]}
                  onPress={() => {
                    Alert.alert('👥 Gestión', 'Panel de gestión de usuarios en desarrollo');
                  }}
                >
                  <Text style={[globalStyles.heading, globalStyles.mb4]}>👥</Text>
                  <Text style={[globalStyles.caption, globalStyles.textCenter]}>Gestión</Text>
                </TouchableOpacity>
              ])}

              <Text style={[globalStyles.subheading, globalStyles.mb8]}>📋 Resumen de Tareas</Text>
              
              {assignments.map(assignment => {
                const submissionCount = assignment.submissions.length;
                const gradedCount = assignment.submissions.filter(sub => sub.status === 'graded').length;
                const pendingCount = assignment.submissions.filter(sub => sub.status === 'submitted').length;
                
                return (
                  <View key={assignment.id} style={[globalStyles.card, globalStyles.mb8]}>
                    <View style={globalStyles.rowBetween}>
                      <Text style={globalStyles.cardTitle}>{assignment.title}</Text>
                      <Text style={globalStyles.caption}>📅 {assignment.dueDate}</Text>
                    </View>
                    
                    <Text style={[globalStyles.cardSubtitle, globalStyles.mb8]}>
                      {assignment.subject} • {assignment.description}
                    </Text>
                    
                    <View style={[globalStyles.rowBetween, isSmallScreen && { flexDirection: 'column' }]}>
                      <View style={[globalStyles.flex1, globalStyles.mr8, isSmallScreen && { marginRight: 0, marginBottom: 8 }]}>
                        <Text style={globalStyles.caption}>
                          ✅ Calificadas: {gradedCount} | 📤 Pendientes: {pendingCount} | 👥 Total: {submissionCount}
                        </Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={[globalStyles.buttonSmall, isSmallScreen && { width: '100%' }]}
                        onPress={() => setModals(prev => ({...prev, grades: true}))}
                      >
                        <Text style={globalStyles.buttonText}>Ver Detalles</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </>
          )}

          {/* BOTÓN DE LOGOUT ADICIONAL EN EL FOOTER */}
          <View style={[globalStyles.mt24, globalStyles.mb40]}>
            <TouchableOpacity 
              style={[globalStyles.button, globalStyles.buttonDanger]}
              onPress={handleLogout}
            >
              <Text style={globalStyles.buttonText}>🚪 Cerrar Sesión</Text>
            </TouchableOpacity>
            
            <Text style={[globalStyles.captionSmall, globalStyles.textCenter, globalStyles.mt8]}>
              Versión 1.0.0 • Classroom Pro
            </Text>
          </View>
        </ScrollView>

        {/* ========== MODALES ========== */}
        
        <AssignmentModal
          visible={modals.assignment}
          onClose={() => setModals(prev => ({...prev, assignment: false}))}
          onSubmit={handleCreateAssignment}
        />

        <SubmissionModal
          visible={modals.submission}
          onClose={() => setModals(prev => ({...prev, submission: false}))}
          assignments={assignments}
          onSubmit={handleSubmitAssignment}
          user={user}
        />

        <GradesModal
          visible={modals.grades}
          onClose={() => setModals(prev => ({...prev, grades: false}))}
          assignments={assignments}
          onGradeAssignment={handleGradeAssignment}
        />

        <ReportsModal
          visible={modals.reports}
          onClose={() => setModals(prev => ({...prev, reports: false}))}
          stats={stats}
          onGenerateReport={handleGenerateReport}
        />
      </View>
    );
  };

  // ========== RENDER PRINCIPAL ==========
  return (
    <View style={globalStyles.container}>
      {isAuthenticated && user ? renderDashboard() : renderLoginScreen()}
    </View>
  );
};

export default MainApp;
