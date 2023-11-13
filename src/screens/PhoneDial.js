import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import Colors from '../styles/Colors';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext, getColor } from '../helpers/functions';
import getLocale from '../constants/localization';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width } = Dimensions.get('window');
const dialPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#', '', '📞', '⌫'];

const PhoneDial = () => {
  const theme = useContext(ThemeContext);
  const [orientation, setOrientation] = useState(null);
  const { darkMode, language, color } = theme;
  const stylesDark = darkMode ? darkModeStyles : {};
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState();

  const dialPadSize = orientation === 1 ? width * 0.2 : width * 0.12;
  const dialPadButtonSize = dialPadSize * 0.4;
  const _spacing = orientation === 1 ? 20 : 4;

  useEffect(() => {
    checkOrientation();
    const subscription = ScreenOrientation.addOrientationChangeListener(handleOrientationChange);
    return () => {
      ScreenOrientation.removeOrientationChangeListeners(subscription);
    };
  }, []);

  const checkOrientation = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();
    setOrientation(orientation);
  };

  const handleOrientationChange = (o) => {
    setOrientation(o.orientationInfo.orientation);
  };

  const handlePhoneCall = () => {
    if (!phoneNumber) {
      return;
    }
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleDialPadPress = (value) => {
    if (value === '📞') {
      handlePhoneCall();
    } else if (value === '⌫') {
      setPhoneNumber((prev) => (prev ? prev.slice(0, -1) : prev));
    } else {
      setPhoneNumber((prev) => (prev ? prev + value : value));
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: getColor(color) },
      headerTitle: getLocale(language, 'keypad'),
      headerShown: false,
    });
  }, [color, language]);

  const DialPad = () => {
    return (
      <FlatList
        data={dialPad}
        style={{ flexGrow: 0 }}
        scrollEnabled={false}
        keyExtractor={(_, index) => index.toString()}
        columnWrapperStyle={{ gap: _spacing }}
        contentContainerStyle={{ gap: _spacing }}
        numColumns={3}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.dialPadButton} onPress={() => handleDialPadPress(item)}>
            <View
              style={[
                {
                  width: dialPadSize,
                  height: dialPadSize,
                  borderRadius: dialPadSize,
                  backgroundColor: item === '📞' ? Colors.success : getColor(color),
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: orientation === 1 ? 10 : 0,
                },
                item === '' || index === dialPad.length - 1 ? { backgroundColor: 'transparent' } : {},
              ]}
            >
              <Text
                style={[
                  {
                    fontSize: dialPadButtonSize,
                    color: item === '⌫' ? Colors.black : Colors.white,
                  },
                  stylesDark.dialPadButtonText,
                ]}
              >
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };
  return (
    <View style={[styles.container, stylesDark.container]}>
      <View style={{ marginBottom: 0 }}>
        <Text style={[styles.phoneNumber, stylesDark.phoneNumber]}>{phoneNumber}</Text>
      </View>
      <DialPad />
    </View>
  );
};

export default PhoneDial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  phoneNumber: {
    minHeight: 50,
    fontSize: 42,
    letterSpacing: 1,
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBackground,
  },
  phoneNumber: {
    color: Colors.white,
  },
  dialPadButtonText: {
    color: Colors.white,
  },
});
