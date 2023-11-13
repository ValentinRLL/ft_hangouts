import { callingCodes, heroBannerColors } from '../constants/data';
import { createContext } from 'react';

export const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const displayPhoneNumber = (phone, showCountryCode, showFlag) => {
  if (!phone) return '';
  let number = String(phone.number);
  number = number.replace(/\B(?=(\d{2})+(?!\d))/g, ' ');
  if (showCountryCode) {
    if (number.startsWith('0')) {
      number = number.substring(1);
    }
    number = phone.callCode + ' ' + number;
  }
  if (showFlag) {
    const country = callingCodes.find((country) => country.callCode === phone.callCode);
    if (country && country.emoji) {
      number = country.emoji + ' ' + number;
    } else {
      number = number;
    }
  }
  return number;
};

export const getColor = (color) => {
  if (!color || isNaN(color) || color < 0 || color > heroBannerColors.length - 1) {
    return heroBannerColors[0].color;
  }
  return heroBannerColors[color].color;
};

export const ThemeContext = createContext(null);
