import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

const Input = ({ 
  label, 
  error, 
  containerStyle,
  ...props 
}) => {
  return (
    <View style={containerStyle}>
      {label && (
        <Text style={globalStyles.label}>{label}</Text>
      )}
      <TextInput
        style={[
          globalStyles.input,
          error && globalStyles.inputError
        ]}
        placeholderTextColor="#8E8E93"
        {...props}
      />
      {error && (
        <Text style={globalStyles.errorText}>{error}</Text>
      )}
    </View>
  );
};

export default Input;