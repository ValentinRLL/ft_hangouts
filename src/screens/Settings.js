import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { globalStyles } from '../styles/AppStyles';
import getLocale from '../constants/localization';
import Colors from '../styles/Colors';
import { heroBannerColors } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../helpers/functions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Settings = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [languageBoolean, setLanguageBoolean] = useState(false);
  const theme = useContext(ThemeContext);
  const { darkMode, language, color, setLanguage, setDarkMode, setColor } = theme;
  const stylesDark = darkMode ? darkModeStyles : {};

  const handleDarkMode = (value) => {
    setDarkMode(value);
  };

  const handleLanguage = (value) => {
    setLanguage(value ? 'en' : 'fr');
    setLanguageBoolean(value);
  };

  const handleColor = (index) => {
    setColor(index);
  };

  useEffect(() => {
    navigation.setOptions({ headerStyle: { backgroundColor: heroBannerColors[color].color } });
  }, [color]);

  return (
    <ScrollView>
      <View style={[styles.container, { flex: 1, padding: 20 }, stylesDark.container, { paddingLeft: insets.left || 20, paddingRight: insets.right }]}>
        <Text style={[globalStyles.title, stylesDark.title]}>{getLocale(language, 'settings')}</Text>
        <View style={{ marginTop: 20 }}>
          <Text style={[globalStyles.subTitle, stylesDark.subTitle]}>{getLocale(language, 'language')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={stylesDark.text}>{getLocale(language, 'french')}</Text>
            <Switch style={{ marginHorizontal: 20 }} value={languageBoolean} onValueChange={(value) => handleLanguage(value)} />
            <Text style={stylesDark.text}>{getLocale(language, 'english')}</Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={[globalStyles.subTitle, stylesDark.subTitle]}>{getLocale(language, 'darkmode')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>☀️</Text>
            <Switch style={{ marginHorizontal: 20 }} value={darkMode} onValueChange={(value) => handleDarkMode(value)} />
            <Text>🌙</Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={[globalStyles.subTitle, stylesDark.subTitle]}>{getLocale(language, 'favoriteColor')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {heroBannerColors.map((color, index) => {
              return (
                <TouchableOpacity style={{ padding: 5 }} key={index} onPress={() => handleColor(index)}>
                  <View style={{ width: 100, height: 50, backgroundColor: color.color }}></View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBackground,
  },
  title: {
    color: Colors.white,
  },
  subTitle: {
    color: Colors.white,
  },
  text: {
    color: Colors.white,
  },
});
