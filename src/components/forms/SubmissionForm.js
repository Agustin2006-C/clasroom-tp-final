import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Input from '../common/Input';
import Button from '../common/Button';
import { globalStyles } from '../../styles/globalStyles';

const SubmissionForm = ({ assignment, onSubmit, loading = false }) => {
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });

      if (result.type === 'success') {
        setFiles(prev => [...prev, ...result.output]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0 && !comment.trim()) {
      Alert.alert('Error', 'Debes agregar un archivo o un comentario');
      return;
    }

    onSubmit({
      assignmentId: assignment._id,
      comment: comment.trim(),
      files,
    });
  };

  return (
    <View style={globalStyles.content}>
      <Text style={globalStyles.heading}>
        Entregar: {assignment.title}
      </Text>
      
      <Text style={[globalStyles.body, globalStyles.mb16]}>
        {assignment.description}
      </Text>

      <Input
        label="Comentario (opcional)"
        placeholder="Agrega un comentario sobre tu entrega"
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View style={globalStyles.mb16}>
        <Text style={globalStyles.label}>Archivos</Text>
        <Button
          title="Seleccionar Archivos"
          onPress={pickDocument}
          variant="outline"
          style={globalStyles.mb8}
        />
        
        {files.map((file, index) => (
          <View key={index} style={[globalStyles.row, globalStyles.spaceBetween, globalStyles.mb8]}>
            <Text style={[globalStyles.body, globalStyles.flex1]}>
              {file.name}
            </Text>
            <TouchableOpacity onPress={() => removeFile(index)}>
              <Text style={{ color: '#FF3B30' }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Button
        title="Entregar Tarea"
        onPress={handleSubmit}
        loading={loading}
        disabled={files.length === 0 && !comment.trim()}
      />
    </View>
  );
};

export default SubmissionForm;