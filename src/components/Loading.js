import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import Colors from '../styles/Colors';

const Loading = () => {
  return (
    <View style={{ marginTop: 50 }}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
