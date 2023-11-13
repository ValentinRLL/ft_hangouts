import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 50,
    paddingVertical: 15,
    paddingLeft: 20,
    fontSize: 20,
    color: Colors.black,
  },
  mv10: {
    marginVertical: 10,
  },
  modalContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  f1: {
    flex: 1,
  },
});
