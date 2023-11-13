import { Button, Modal, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Animated, Keyboard, Image, Pressable, Alert } from 'react-native';
import React, { useEffect, useState, useRef, useContext } from 'react';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import { ThemeContext, capitalize, getColor } from '../helpers/functions';
import Colors from '../styles/Colors';
import CustomButton from '../components/CustomButton';
import Field from '../components/Field';
import { avatars } from '../constants/data';
import { deleteContactFromList, editContactInList } from '../api/storage';
import { globalStyles } from '../styles/AppStyles';
import getLocale from '../constants/localization';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Profile = ({ navigation, route }) => {
  const theme = useContext(ThemeContext);
  const { darkMode, contact, setContact, color, language } = theme;
  const insets = useSafeAreaInsets();
  const stylesDark = darkMode ? darkModeStyles : {};
  const [user, setUser] = useState(route.params.user);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const paddingInput = useRef(new Animated.Value(25)).current;

  const HeaderContent = () => {
    return (
      <View style={styles.avatarContainer}>
        <Avatar image={user.image} size={125} online={user.location} />
        <View>
          <Text style={styles.headerText}>
            {user.favorite ? '⭐️ ' : ''}
            {capitalize(user.firstName)}
          </Text>
          <Text style={styles.subTitle}>{user.notes}</Text>
        </View>
      </View>
    );
  };

  const handleEdit = async () => {
    setUser({ ...editedUser });
    editContactInList(editedUser);
    setEditModalVisible(false);
  };

  const handleOpenEditModal = () => {
    setEditModalVisible(true);
  };

  const handleCancelEdit = () => {
    setEditedUser({ ...user });
    setEditModalVisible(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <CustomButton color={Colors.white} title={getLocale(language, 'edit')} onPress={() => handleOpenEditModal()} />,
      headerStyle: {
        backgroundColor: getColor(color),
      },
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
      headerRight: () => <CustomButton color={Colors.white} title={getLocale(language, 'edit')} onPress={() => handleOpenEditModal()} />,
      headerStyle: {
        backgroundColor: getColor(color),
      },
    });
  }, [color, language]);

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

  useEffect(() => {
    const newUser = { ...user };
    const phoneKeys = Object.keys(user).filter((key) => key.startsWith('phone_'));
    if (phoneKeys.length > 0) {
      const newPhones = [...user.phones];
      for (let i = 0; i < phoneKeys.length; i++) {
        const phoneIndex = phoneKeys[i].split('_')[1];
        newPhones[phoneIndex].number = user[phoneKeys[i]];
        delete newUser[phoneKeys[i]];
      }
      newUser.phones = newPhones;
    }

    const callCodeKeys = Object.keys(user).filter((key) => key.startsWith('callCode_'));
    if (callCodeKeys.length > 0) {
      const newPhones = [...user.phones];
      for (let i = 0; i < callCodeKeys.length; i++) {
        const phoneIndex = callCodeKeys[i].split('_')[1];
        newPhones[phoneIndex].callCode = user[callCodeKeys[i]];
        delete newUser[callCodeKeys[i]];
      }
      newUser.phones = newPhones;
    }
    if (phoneKeys.length > 0 || callCodeKeys.length > 0) {
      setUser({ ...newUser });
    }
  }, [user]);

  const handleDeleteContact = (id) => {
    Alert.alert(getLocale(language, 'deleteContact'), getLocale(language, 'deleteContactConfirm'), [
      {
        text: getLocale(language, 'cancel'),
        style: 'cancel',
      },
      {
        text: getLocale(language, 'delete'),
        style: 'destructive',
        onPress: async () => {
          const newContactList = contact.filter((contact) => contact.id !== id);
          setContact(newContactList);
          await deleteContactFromList(id);
          navigation.pop(2);
        },
      },
    ]);
  };

  return (
    <Header color={color} content={<HeaderContent />} darkMode={darkMode}>
      <ScrollView style={[globalStyles.container, stylesDark.container, { paddingLeft: insets.left, paddingRight: insets.right }]}>
        <Field name={getLocale(language, 'firstName')} value={user.firstName} type='firstName' />
        <Field name={getLocale(language, 'lastName')} value={user.lastName} type='lastName' />
        {user.phones.map((phone, index) => (
          <Field key={index} name={getLocale(language, 'phone')} value={phone} type='phone' />
        ))}
        <Field name={getLocale(language, 'email')} value={user.email} type='email' />
        <Field name={getLocale(language, 'notes')} value={user.notes} type='notes' />

        <Modal animationType='slide' visible={editModalVisible} presentationStyle='pageSheet' onRequestClose={() => handleCancelEdit()}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <Animated.ScrollView
              style={[
                { ...styles.editModalContainer, paddingBottom: paddingInput, flex: 1 },
                stylesDark.container,
                { paddingLeft: insets.left || 20, paddingRight: insets.right || 20 },
              ]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <Button color={Platform.OS === 'android' ? getColor(color) : null} title={getLocale(language, 'cancel')} onPress={() => handleCancelEdit()} />
                <Button color={Platform.OS === 'android' ? getColor(color) : null} title={getLocale(language, 'ok')} onPress={() => handleEdit()} />
              </View>
              <Text style={[styles.editModalTitle, stylesDark.editModalTitle]}>{getLocale(language, 'editProfile')}</Text>
              {Field({ name: getLocale(language, 'firstName'), value: editedUser.firstName, type: 'firstName', edited: true, editedUser, setEditedUser })}
              {Field({ name: getLocale(language, 'lastName'), value: editedUser.lastName, type: 'lastName', edited: true, editedUser, setEditedUser })}
              {editedUser.phones.map((phone, index) => (
                <View key={index}>
                  <Text style={stylesDark.editModalTitle}>
                    {getLocale(language, 'phone')} {index + 1}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    {Field({
                      name: getLocale(language, 'callCode'),
                      value: phone.callCode,
                      type: `callCode_${index}`,
                      edited: true,
                      editedUser,
                      setEditedUser,
                      inputMode: 'numeric',
                    })}
                    {Field({ name: getLocale(language, 'phone'), value: phone.number, type: `phone_${index}`, edited: true, editedUser, setEditedUser, inputMode: 'tel' })}
                  </View>
                </View>
              ))}
              {Field({ name: getLocale(language, 'email'), value: editedUser.email, type: 'email', edited: true, editedUser, setEditedUser })}
              {Field({ name: getLocale(language, 'notes'), value: editedUser.email, type: 'notes', edited: true, editedUser, setEditedUser, multiline: true })}
              <View style={{ marginBottom: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {avatars.map((avatar, index) => (
                  <Pressable
                    key={index}
                    style={[editedUser.image === avatar.id ? { ...styles.selectedImg, borderColor: getColor(color) } : {}, { margin: 5 }]}
                    onPress={() => setEditedUser({ ...editedUser, image: avatar.id })}
                  >
                    <Image source={avatar.img} style={{ width: 75, height: 75 }} />
                  </Pressable>
                ))}
              </View>
              <View style={{ marginBottom: 50, flexDirection: 'row', justifyContent: 'center' }}>
                <CustomButton title={getLocale(language, 'deleteContact')} color={Colors.danger} onPress={() => handleDeleteContact(editedUser.id)} />
              </View>
            </Animated.ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
    </Header>
  );
};

export default Profile;

const styles = StyleSheet.create({
  avatarContainer: {
    padding: 30,
    marginLeft: 10,
    marginTop: -25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 10,
    color: Colors.white,
    fontSize: 18,
  },
  subTitle: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.white,
  },
  login: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  displayname: {
    fontSize: 22,
    fontStyle: 'italic',
  },
  editModalContainer: {
    padding: 20,
  },
  editModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  f1: {
    flex: 1,
  },
  selectedImg: {
    borderWidth: 5,
    borderRadius: 5,
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBackground,
  },
  editModalTitle: {
    color: Colors.white,
  },
});
