import { Animated, FlatList, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import Colors from '../styles/Colors';
import { ThemeContext, capitalize, getColor } from '../helpers/functions';
import { addMessage, getContactMessages, getOneContact } from '../api/storage';
import Message from '../components/Message';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import getLocale from '../constants/localization';
import { useFocusEffect } from '@react-navigation/native';
import * as SMS from 'expo-sms';

const Chat = ({ route, navigation }) => {
  const [user, setUser] = useState(route.params.user);
  const theme = useContext(ThemeContext);
  const { darkMode, color, language } = theme;
  const stylesDark = darkMode ? darkModeStyles : {};
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const paddingInput = useRef(new Animated.Value(0)).current;

  const fetchMessages = async () => {
    const messages = await getContactMessages(user.id);
    setMessages(messages);
  };

  const onUpdateUser = async () => {
    const newUser = await getOneContact(user.id);
    if (newUser && newUser !== user) {
      setUser(newUser);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onUpdateUser();
    }, [])
  );

  useEffect(() => {
    fetchMessages();
    navigation.setOptions({
      headerRight: () => <CustomButton color={Colors.white} title={getLocale(language, 'checkProfile')} onPress={() => navigation.navigate('Profile', { user: user })} />,
    });

    const showSubscription = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    const hideSubscription = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && trimmedMessage.length > 0) {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync([`${user.phones[0].callCode}${user.phones[0].number}`], trimmedMessage);
        if (result === 'sent') {
          const newMessage = { sender: 0, receiver: user.id, content: trimmedMessage, sentAt: new Date().getTime() };
          setMessages([...messages, newMessage]);
          setMessage('');
          addMessage(newMessage);
        }
      }
    }
  };

  const keyboardWillShow = (event) => {
    Animated.timing(paddingInput, {
      duration: event.duration,
      toValue: event.endCoordinates.height - 100,
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

  const HeaderContent = () => {
    return (
      <Pressable style={styles.avatarContainer} onPress={() => navigation.navigate('Profile', { user: user })}>
        <View>
          <Avatar image={user.image} size={125} online={user.location} />
        </View>
        <View
          style={{
            marginLeft: 10,
            maxWidth: '66%',
          }}
        >
          <Text style={styles.headerText}>{capitalize(user.firstName)}</Text>
          <View style={{}}>
            <Text style={styles.subTitle}>{user.notes}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <Header color={color} content={<HeaderContent />} darkMode={darkMode}>
      <ImageBackground
        source={darkMode ? require('../../assets/messages-background-dark.jpeg') : require('../../assets/messages-background-light.jpeg')}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.messagesContainer}>
          {messages && messages.length > 0 ? (
            <View style={{ flex: 1 }}>
              <FlatList
                data={messages}
                renderItem={({ item }) => <Message message={item} />}
                keyExtractor={(item) => `${item.sender}-${item.sentAt}-${item.receiver}`}
                style={styles.messages}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
              />
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.noMessageText, stylesDark.noMessageText]}>{getLocale(language, 'conversationBegining')}</Text>
            </ScrollView>
          )}
        </View>
        <View style={[styles.sendMessageContainer, stylesDark.sendMessageContainer]}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Animated.View style={{ marginBottom: paddingInput }}>
              <View style={styles.sendMessageBox}>
                <CustomTextInput color={Colors.inputColor} placeholder={getLocale(language, 'writeAMessage')} value={message} onChangeText={(text) => setMessage(text)} />
                <Pressable onPress={() => sendMessage()}>
                  <Ionicons style={{ marginLeft: 15 }} name='ios-send' size={30} color={getColor(color)} onPress={() => sendMessage()} />
                </Pressable>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </Header>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: { flex: 1 },
  avatarContainer: {
    padding: 30,
    marginLeft: 10,
    marginTop: -25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'justify',
  },
  messages: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  messagesContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sendMessageContainer: {
    backgroundColor: Colors.white,
    padding: 10,
    paddingBottom: 25,
  },
  sendMessageBox: {
    flexDirection: 'row',
    marginRight: '12%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noMessageText: { fontSize: 30 },
});

const darkModeStyles = StyleSheet.create({
  sendMessageContainer: {
    backgroundColor: Colors.darkBackground,
  },
  noMessageText: {
    color: Colors.white,
  },
});
