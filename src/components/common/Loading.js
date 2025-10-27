import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

const Loading = ({ size = 'large', color = '#007AFF', text }) => {
  return (
    <View style={[globalStyles.container, globalStyles.center]}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={[globalStyles.body, { marginTop: 16 }]}>
          {text}
        </Text>
      )}
    </View>
  );
};

export default Loading;