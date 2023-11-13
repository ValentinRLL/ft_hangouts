import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import Colors from '../styles/Colors';

const CustomButton = ({ title, onPress, plainColor, block, color, size }) => {
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      style={[plainColor ? styles.plainColor : {}, block ? styles.block : {}, color ? { backgroundColor: color, borderColor: color } : {}]}
    >
      <Text style={{ fontSize: size || 16, color: color ? color : Colors.primary }}>{title}</Text>
    </TouchableWithoutFeedback>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  plainColor: {
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: Colors.primary,
    borderRadius: 7,
    marginVertical: 10,
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  block: {
    width: '100%',
  },
});
