import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTextInput from './CustomTextInput';
import { ThemeContext, capitalize, displayPhoneNumber } from '../helpers/functions';
import Colors from '../styles/Colors';
import { globalStyles } from '../styles/AppStyles';
import { Linking } from 'react-native';
import { useContext } from 'react';

const Field = ({ name, value, type, edited, inputMode, multiline, editedUser, setEditedUser }) => {
  const theme = useContext(ThemeContext);
  const { darkMode } = theme;
  const stylesDark = darkMode ? darkModeStyles : {};
  let displayValue = '';

  switch (type) {
    case 'phone':
      displayValue = displayPhoneNumber(value, true, true);
      break;
    case 'email':
      displayValue = value.toLowerCase();
      break;
    case 'firstName':
      displayValue = capitalize(value);
      break;
    case 'lastName':
      displayValue = capitalize(value);
      break;
    default:
      displayValue = value;
  }

  if (edited) {
    editedUser[type] = editedUser[type] === undefined ? value : editedUser[type];
    const updateField = (newValue) => {
      setEditedUser({ ...editedUser, [type]: newValue });
    };

    return (
      <View style={[styles.field, stylesDark.editField, type.startsWith('phone_') ? globalStyles.f1 : {}]}>
        <Text style={[styles.fieldName, stylesDark.fieldName]}>{name}</Text>
        <CustomTextInput
          style={{ ...styles.fieldValue, ...stylesDark.fieldValue }}
          placeholder={`Ajouter un ${name}`}
          value={editedUser[type]}
          onChangeText={(text) => updateField(text)}
          inputMode={inputMode}
          multiline={multiline}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={() => (type === 'phone' ? Linking.openURL(`tel:${value.callCode ? value.callCode : ''}${value.number}`) : null)}>
      <View style={[styles.field, stylesDark.field]}>
        <Text style={[styles.fieldName, stylesDark.fieldName]}>{name}</Text>
        <Text style={[styles.fieldValue, stylesDark.fieldValue]}>{displayValue}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Field;

const styles = StyleSheet.create({
  field: {
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 9,
    marginVertical: 10,
  },
  fieldName: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fieldValue: {
    color: Colors.primary,
    fontSize: 18,
  },
});

const darkModeStyles = StyleSheet.create({
  field: {
    backgroundColor: Colors.darkBackground2,
  },
  editField: {
    backgroundColor: Colors.darkBackground,
  },
  fieldName: {
    color: Colors.white,
  },
  fieldValue: {
    color: Colors.white,
  },
});
