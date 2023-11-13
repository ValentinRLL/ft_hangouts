import { StyleSheet, TextInput, View } from 'react-native';
import React from 'react';
import Colors from '../styles/Colors';
import { globalStyles } from '../styles/AppStyles';

const CustomTextInput = ({ style, placeholder, value, onChangeText, inputMode, multiline }) => {
  return (
    <View style={{ ...globalStyles.textInput, ...styles.textInput }}>
      <TextInput
        placeholderTextColor={Colors.inputColor}
        style={{ ...style }}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        inputMode={inputMode || 'text'}
        multiline={multiline || false}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
  },
});
