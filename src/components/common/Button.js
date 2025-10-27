import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  style,
  textStyle,
  ...props 
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return [globalStyles.button, globalStyles.buttonOutline];
      case 'danger':
        return [globalStyles.button, { backgroundColor: '#FF3B30' }];
      default:
        return globalStyles.button;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return [globalStyles.buttonText, globalStyles.buttonOutlineText];
      default:
        return globalStyles.buttonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && globalStyles.buttonDisabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;