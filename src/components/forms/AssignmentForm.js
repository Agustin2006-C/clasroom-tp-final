import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../common/Input';
import Button from '../common/Button';
import { globalStyles } from '../../styles/globalStyles';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede tener más de 200 caracteres')
    .required('El título es requerido'),
  description: Yup.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .required('La descripción es requerida'),
  dueDate: Yup.date()
    .min(new Date(), 'La fecha de entrega debe ser futura')
    .required('La fecha de entrega es requerida'),
  maxPoints: Yup.number()
    .min(1, 'Los puntos deben ser al menos 1')
    .max(100, 'Los puntos no pueden ser más de 100')
    .required('Los puntos máximos son requeridos'),
});

const AssignmentForm = ({ 
  initialValues, 
  onSubmit, 
  loading = false,
  submitButtonText = 'Crear Tarea' 
}) => {
  const defaultValues = {
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    maxPoints: '10',
    ...initialValues,
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await onSubmit({
        ...values,
        dueDate: new Date(values.dueDate).toISOString(),
        maxPoints: parseInt(values.maxPoints, 10),
      });
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la tarea');
    }
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <ScrollView style={globalStyles.content}>
          <Input
            label="Título de la tarea"
            placeholder="Ingresa el título de la tarea"
            value={values.title}
            onChangeText={handleChange('title')}
            onBlur={handleBlur('title')}
            error={touched.title && errors.title}
          />

          <Input
            label="Descripción"
            placeholder="Describe la tarea en detalle"
            value={values.description}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            error={touched.description && errors.description}
          />

          <Input
            label="Instrucciones (opcional)"
            placeholder="Instrucciones adicionales para los estudiantes"
            value={values.instructions}
            onChangeText={handleChange('instructions')}
            onBlur={handleBlur('instructions')}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Input
            label="Fecha de entrega"
            placeholder="YYYY-MM-DD"
            value={formatDateForInput(values.dueDate)}
            onChangeText={handleChange('dueDate')}
            onBlur={handleBlur('dueDate')}
            error={touched.dueDate && errors.dueDate}
          />

          <Input
            label="Puntos máximos"
            placeholder="10"
            value={values.maxPoints}
            onChangeText={handleChange('maxPoints')}
            onBlur={handleBlur('maxPoints')}
            keyboardType="numeric"
            error={touched.maxPoints && errors.maxPoints}
          />

          <Button
            title={submitButtonText}
            onPress={handleSubmit}
            loading={loading}
            style={globalStyles.mt16}
          />
        </ScrollView>
      )}
    </Formik>
  );
};

export default AssignmentForm;