import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ContactList from './src/screens/ContactList';
import Chat from './src/screens/Chat';
import Profile from './src/screens/Profile';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import PhoneDial from './src/screens/PhoneDial';
import Settings from './src/screens/Settings';
import { useEffect, useRef, useState } from 'react';
import { getUserColor, getUserDarkMode, getUserLanguage } from './src/api/storage';
import getLocale from './src/constants/localization';
import { ThemeContext, getColor } from './src/helpers/functions';
import Colors from './src/styles/Colors';
import { Alert, AppState, StatusBar } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MyStack = ({ user }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: Colors.white,
      }}
    >
      <Stack.Screen name='ContactList' children={() => <ContactList user={user} />} />
      <Stack.Screen
        name='Chat'
        component={Chat}
        options={{
          headerTitle: getLocale(user.language, 'chat'),
        }}
      />
      <Stack.Screen
        name='Profile'
        component={Profile}
        options={{
          headerTitle: getLocale(user.language, 'profile'),
        }}
      />
    </Stack.Navigator>
  );
};

const MyBottomTab = ({ user }) => {
  return (
    <ThemeContext.Provider value={user}>
      <Tab.Navigator
        screenOptions={{
          headerTintColor: Colors.white,
          tabBarStyle: { backgroundColor: user.darkMode ? Colors.darkBackground : Colors.white, borderTopColor: user.darkMode ? Colors.darkBackground2 : Colors.black },
          tabBarActiveTintColor: getColor(user.color),
        }}
      >
        <Tab.Screen
          name='Contacts'
          children={() => <MyStack user={user} />}
          options={{
            headerShown: false,
            tabBarLabel: getLocale(user.language, 'contacts'),
            tabBarIcon: ({ color, size }) => <AntDesign name='message1' color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name='PhoneDial'
          children={() => <PhoneDial user={user} />}
          options={{
            headerLabel: getLocale(user.language, 'keypad'),
            tabBarLabel: getLocale(user.language, 'keypad'),
            tabBarIcon: ({ color, size }) => <MaterialIcons name='dialpad' color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name='Settings'
          children={() => <Settings user={user} />}
          options={{
            tabBarLabel: getLocale(user.language, 'settings'),
            headerTitle: getLocale(user.language, 'settings'),
            tabBarIcon: ({ color, size }) => <Ionicons name='ios-settings-outline' size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </ThemeContext.Provider>
  );
};

export default function App() {
  const [language, setLanguage] = useState('fr');
  const [darkMode, setDarkMode] = useState(false);
  const [color, setColor] = useState(0);
  const appState = useRef(AppState.currentState);
  const appTimer = useRef(new Date().getTime());

  const getUserValues = async () => {
    try {
      const userLanguage = await getUserLanguage();
      const userDarkMode = await getUserDarkMode();
      const userColor = await getUserColor();
      setLanguage(userLanguage);
      setDarkMode(userDarkMode);
      setColor(userColor);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getUserValues();
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        Alert.alert('🕣', `${(new Date().getTime() - appTimer.current) / 1000}s`);
      } else {
        appTimer.current = new Date().getTime();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <StatusBar hidden={true} />
      <MyBottomTab user={{ language, darkMode, color, setLanguage, setDarkMode, setColor }} />
    </NavigationContainer>
  );
}
