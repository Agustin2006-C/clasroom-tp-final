import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

const Card = ({ 
  children, 
  title, 
  subtitle,
  onPress,
  style,
  ...props 
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[globalStyles.card, style]}
      onPress={onPress}
      {...props}
    >
      {title && (
        <View style={globalStyles.mb8}>
          <Text style={globalStyles.cardTitle}>{title}</Text>
          {subtitle && (
            <Text style={globalStyles.caption}>{subtitle}</Text>
          )}
        </View>
      )}
      {children}
    </CardComponent>
  );
};

export default Card;