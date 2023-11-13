import { StyleSheet, View } from 'react-native';
import React from 'react';
import { globalStyles } from '../styles/AppStyles';
import { getColor } from '../helpers/functions';

const Header = ({ content, children, color }) => {
  return (
    <View style={{ ...globalStyles.container, ...styles.container }}>
      <View style={{ ...globalStyles.headerContainer, ...styles.gradient, backgroundColor: getColor(color) }}>{content}</View>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    marginTop: -105,
  },
  gradient: {
    paddingTop: 105,
  },
});
