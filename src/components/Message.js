import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import Colors from '../styles/Colors';
import { ThemeContext, getColor } from '../helpers/functions';

const Message = ({ message }) => {
  const theme = useContext(ThemeContext);
  const { color } = theme;
  const date = new Date(message.sentAt);

  return (
    <View style={styles.messageContainer}>
      <View style={message.sender === 0 ? { ...styles.bubbleSent, backgroundColor: getColor(color) } : styles.bubbleReceived}>
        <Text style={{ color: Colors.white }}>{message.content}</Text>
      </View>
      <View style={message.sender === 0 ? styles.timeSent : styles.timeReceived}>
        <Text style={message.sender === 0 ? styles.textTimeSent : styles.textTimeReceived}>
          {('0' + date.getHours()).slice(-2)}:{('0' + date.getMinutes()).slice(-2)}
        </Text>
      </View>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 10,
  },
  bubbleSent: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.info,
    borderRadius: 20,
    borderBottomRightRadius: 0,
    marginRight: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '60%',
  },
  bubbleReceived: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '60%',
  },
  timeSent: {
    alignSelf: 'flex-end',
    marginRight: 20,
    width: '60%',
    color: Colors.black,
  },
  timeReceived: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    width: '60%',
    color: Colors.black,
  },
  textTimeSent: {
    color: Colors.inputColor,
    textAlign: 'right',
    marginRight: -10,
  },
  textTimeReceived: {
    color: Colors.inputColor,
    textAlign: 'right',
    marginRight: 10,
  },
});
