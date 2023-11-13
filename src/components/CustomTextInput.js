import { StyleSheet, TextInput, View } from 'react-native';
import React, { useContext } from 'react';
import Colors from '../styles/Colors';
import { globalStyles } from '../styles/AppStyles';
import { ThemeContext } from '../helpers/functions';

const CustomTextInput = ({ style, placeholder, value, onChangeText, inputMode, multiline }) => {
  const theme = useContext(ThemeContext);
  const { darkMode } = theme;
  const stylesDark = darkMode ? darkModeStyles : {};
  return (
    <View style={{ ...globalStyles.textInput, ...styles.textInput, ...stylesDark.textInput }}>
      <TextInput
        placeholderTextColor={Colors.inputColor}
        style={{ ...style, ...stylesDark.text }}
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

const darkModeStyles = StyleSheet.create({
  textInput: {
    backgroundColor: Colors.darkBackground2,
  },
  text: {
    color: Colors.white,
  },
});
