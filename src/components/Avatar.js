import { Image, ImageBackground, StyleSheet } from 'react-native';
import React from 'react';
import { avatars } from '../constants/data';
const Avatar = ({ image, size, online }) => {
  const avatarSize = size && size > 0 ? size : 100;
  const status = {
    online: require('../../assets/frames/online.png'),
    offline: require('../../assets/frames/offline.png'),
  };

  return (
    <ImageBackground style={{ ...styles.frame, width: avatarSize, height: avatarSize }} defaultSource={status[online ? 'online' : 'offline']}>
      <Image
        style={{ ...styles.image, width: avatarSize * 0.85, height: avatarSize * 0.85 }}
        source={avatars[!isNaN(image) ? image : 0].img}
        defaultSource={avatars[!isNaN(image) ? image : 0].img}
      />
    </ImageBackground>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  frame: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 6,
    width: 85,
    height: 85,
  },
});
