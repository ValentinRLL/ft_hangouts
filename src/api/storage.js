import AsyncStorage from '@react-native-async-storage/async-storage';
import { callingCodes } from '../constants/data';

export const getContactList = async () => {
  try {
    const contactList = await AsyncStorage.getItem('contactList');
    const contacts = JSON.parse(contactList);
    const contactsWithFormatedPhones = contacts?.map((contact) => {
      const phones = contact.phones.map((phone) => {
        const countryCode = callingCodes.find((country) => country.callCode === phone.callCode);

        const newPhone = { ...phone, ...countryCode };
        return newPhone;
      });
      const newContact = { ...contact, phones };
      return newContact;
    });
    return contactList ? contactsWithFormatedPhones : [];
  } catch (error) {
    throw error;
  }
};

export const getOneContact = async (id) => {
  try {
    const contactList = await getContactList();
    const contact = contactList.find((contact) => contact.id === id);
    return contact ? contact : null;
  } catch (error) {
    throw error;
  }
};

export const addContactInList = async (newContact) => {
  try {
    const contactList = await getContactList();
    if (!contactList) {
      await AsyncStorage.setItem('contactList', JSON.stringify([newContact]));
    } else {
      await AsyncStorage.setItem('contactList', JSON.stringify([...contactList, newContact]));
    }
  } catch (error) {
    throw error;
  }
};

export const editContactInList = async (contactToEdit) => {
  try {
    const contactList = await getContactList();
    if (contactList) {
      const newContactList = contactList.map((contact) => {
        if (contact.id === contactToEdit.id) {
          return contactToEdit;
        } else {
          return contact;
        }
      });
      await AsyncStorage.setItem('contactList', JSON.stringify(newContactList));
    }
  } catch (error) {
    throw error;
  }
};

export const deleteContactFromList = async (contactToDelete) => {
  try {
    const contactList = await getContactList();
    if (contactList) {
      const newContactList = contactList.filter((contact) => contact.id !== contactToDelete);
      await AsyncStorage.setItem('contactList', JSON.stringify(newContactList));
    }
  } catch (error) {
    throw error;
  }
};

export const getContactMessages = async (contactId) => {
  try {
    const messages = await AsyncStorage.getItem('messages');
    const messagesList = JSON.parse(messages);
    const contactMessages = messagesList?.filter((message) => message.receiver === contactId || message.sender === contactId);
    return messages ? contactMessages : [];
  } catch (error) {
    throw error;
  }
};

export const addMessage = async (message) => {
  try {
    const messages = await AsyncStorage.getItem('messages');
    const messagesList = JSON.parse(messages);
    if (!messagesList) {
      await AsyncStorage.setItem('messages', JSON.stringify([message]));
    } else {
      await AsyncStorage.setItem('messages', JSON.stringify([...messagesList, message]));
    }
  } catch (error) {
    throw error;
  }
};

export const getUserDarkMode = async () => {
  try {
    const darkMode = await AsyncStorage.getItem('darkMode');
    return darkMode ? JSON.parse(darkMode) : false;
  } catch (error) {
    throw error;
  }
};

export const setUserDarkMode = async (darkMode) => {
  try {
    await AsyncStorage.setItem('darkMode', JSON.stringify(darkMode));
  } catch (error) {
    throw error;
  }
};

export const getUserLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem('language');
    return language ? JSON.parse(language) : 'fr';
  } catch (error) {
    throw error;
  }
};

export const setUserLanguage = async (language) => {
  try {
    await AsyncStorage.setItem('language', JSON.stringify(language));
  } catch (error) {
    throw error;
  }
};

export const getUserColor = async () => {
  try {
    const color = await AsyncStorage.getItem('color');
    return color ? JSON.parse(color) : 0;
  } catch (error) {
    throw error;
  }
};

export const setUserColor = async (color) => {
  try {
    await AsyncStorage.setItem('color', JSON.stringify(color));
  } catch (error) {
    throw error;
  }
};
