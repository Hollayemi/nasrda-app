import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export const NASRDA_LOGO_URI =
  'https://upload.wikimedia.org/wikipedia/en/1/1c/National_Space_Research_and_Development_Agency_logo.png';

export const NavLogo: React.FC<{ height?: number }> = ({ height = 28 }) => (
  <View style={[styles.pill, { height: height + 8 }]}>
    <Image
      source={{ uri: NASRDA_LOGO_URI }}
      style={{ width: height, height }}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  pill: {
    // backgroundColor: '#FFFFFF',
    borderRadius: 8,
    // paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
