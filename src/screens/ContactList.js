import {
  Alert,
  Animated,
  Button,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { addContactInList, getContactList } from '../api/storage';
import SingleProfileSearch from '../components/SingleProfileSearch';
import Header from '../components/Header';
import Loading from '../components/Loading';
import getLocale from '../constants/localization';
import Colors from '../styles/Colors';
import { avatars, blankContact } from '../constants/data';
import CustomButton from '../components/CustomButton';
import { globalStyles } from '../styles/AppStyles';
import Field from '../components/Field';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext, getColor } from '../helpers/functions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ContactList = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);
  const { darkMode, color, language } = theme;
  const stylesDark = darkMode ? darkModeStyles : {};
  const [contact, setContact] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [newContactModalVisible, setNewContactModalVisible] = useState(false);
  const paddingInput = useRef(new Animated.Value(25)).current;
  const [newContact, setNewContact] = useState({ ...blankContact });
  const [addedContact, setAddedContact] = useState();

  useEffect(() => {
    getContactListFromStorage();
    navigation.setOptions({
      headerTitle: getLocale(language, 'contactList'),
      headerRight: () => <CustomButton size={32} color={Colors.white} title='+' onPress={() => handleOpenNewModal()} />,
      headerStyle: { backgroundColor: getColor(color) },
    });
    const showSubscription = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    const hideSubscription = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getLocale(language, 'contactList'),
      headerStyle: { backgroundColor: getColor(color) },
      headerTintColor: Colors.white,
    });
  }, [language, color]);

  const keyboardWillShow = (event) => {
    Animated.timing(paddingInput, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
      useNativeDriver: false,
    }).start();
  };

  const keyboardWillHide = (event) => {
    Animated.timing(paddingInput, {
      duration: event.duration,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const getContactListFromStorage = async () => {
    const result = await getContactList();
    setContact(result);
  };

  const handleAddContact = async () => {
    if (addedContact.firstName.length + addedContact.lastName.length < 1 || addedContact.phones[0].number.length < 1) {
      Alert.alert('Erreur', getLocale(language, 'addContactConditions'));
      return;
    }
    setContact([...contact, addedContact]);
    await addContactInList(addedContact);
    setNewContactModalVisible(false);
  };

  const handleOpenNewModal = () => {
    setNewContactModalVisible(true);
    setNewContact({ ...blankContact, id: new Date().getTime().toString(), phones: [{ number: '', callCode: '+33' }] });
  };

  useEffect(() => {
    const newUser = { ...newContact };
    const phoneKeys = Object.keys(newContact).filter((key) => key.startsWith('phone_'));
    if (phoneKeys.length > 0) {
      const newPhones = [...newContact.phones];
      for (let i = 0; i < phoneKeys.length; i++) {
        const phoneIndex = phoneKeys[i].split('_')[1];
        newPhones[phoneIndex].number = newContact[phoneKeys[i]];
        delete newUser[phoneKeys[i]];
      }
      newUser.phones = newPhones;
    }

    const callCodeKeys = Object.keys(newContact).filter((key) => key.startsWith('callCode_'));
    if (callCodeKeys.length > 0) {
      const newPhones = [...newContact.phones];
      for (let i = 0; i < callCodeKeys.length; i++) {
        const phoneIndex = callCodeKeys[i].split('_')[1];
        newPhones[phoneIndex].callCode = newContact[callCodeKeys[i]];
        delete newUser[callCodeKeys[i]];
      }
      newUser.phones = newPhones;
    }
    if (phoneKeys.length > 0 || callCodeKeys.length > 0) {
      setAddedContact({ ...newUser });
    }
  }, [newContact]);

  return (
    <Header color={color}>
      <View style={[styles.container, stylesDark.container, { paddingLeft: insets.left, paddingRight: insets.right }]}>
        {contact ? (
          contact.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  onRefresh={async () => {
                    setRefreshing(true);
                    await getContactListFromStorage();
                    setRefreshing(false);
                  }}
                  refreshing={refreshing}
                />
              }
              data={contact}
              renderItem={({ item }) => <SingleProfileSearch color={color} user={item} language={language} darkMode={darkMode} contact={contact} />}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[{ fontSize: 24 }, stylesDark.text]}>{getLocale(language, 'noContact')}</Text>
            </ScrollView>
          )
        ) : (
          <Loading />
        )}
      </View>

      <Modal animationType='slide' presentationStyle='pageSheet' onRequestClose={() => setNewContactModalVisible(false)} visible={newContactModalVisible}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <Animated.ScrollView style={[{ ...globalStyles.modalContainer, flex: 1 }, stylesDark.container, { paddingLeft: insets.left || 20, paddingRight: insets.right || 20 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Button color={Platform.OS === 'android' ? getColor(color) : null} title={getLocale(language, 'cancel')} onPress={() => setNewContactModalVisible(false)} />
              <Button color={Platform.OS === 'android' ? getColor(color) : null} title={getLocale(language, 'ok')} onPress={() => handleAddContact()} />
            </View>
            <Text style={[globalStyles.title, stylesDark.title]}>{getLocale(language, 'addContact')}</Text>
            {Field({ name: getLocale(language, 'firstName'), value: newContact.firstName, type: 'firstName', edited: true, editedUser: newContact, setEditedUser: setNewContact })}
            {Field({ name: 'Last Name', value: newContact.lastName, type: 'lastName', edited: true, editedUser: newContact, setEditedUser: setNewContact })}
            {newContact.phones.map((phone, index) => (
              <View key={index}>
                <Text style={stylesDark.title}>
                  {getLocale(language, 'phone')} {index + 1}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  {Field({
                    name: 'Call Code',
                    value: phone.callCode,
                    type: `callCode_${index}`,
                    edited: true,
                    editedUser: newContact,
                    setEditedUser: setNewContact,
                    inputMode: 'numeric',
                  })}
                  {Field({ name: 'Phone', value: phone.number, type: `phone_${index}`, edited: true, editedUser: newContact, setEditedUser: setNewContact, inputMode: 'tel' })}
                </View>
              </View>
            ))}
            {Field({ name: 'Email', value: newContact.email, type: 'email', edited: true, editedUser: newContact, setEditedUser: setNewContact })}
            {Field({ name: 'Notes', value: newContact.email, type: 'notes', edited: true, editedUser: newContact, setEditedUser: setNewContact, multiline: true })}
            <View style={{ marginBottom: 50, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
              {avatars.map((avatar, index) => (
                <Pressable
                  key={index}
                  style={[newContact.image === avatar.id ? { ...styles.selectedImg, borderColor: getColor(color) } : {}, { margin: 5 }]}
                  onPress={() => setNewContact({ ...newContact, image: avatar.id })}
                >
                  <Image source={avatar.img} style={{ width: 75, height: 75 }} />
                </Pressable>
              ))}
            </View>
          </Animated.ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Header>
  );
};

export default ContactList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  selectedImg: {
    borderWidth: 5,
    borderColor: Colors.primary,
    borderRadius: 5,
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBackground,
  },
  title: {
    color: Colors.white,
  },
  text: {
    color: Colors.white,
  },
});
