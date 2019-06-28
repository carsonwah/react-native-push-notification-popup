import { Dimensions, Platform } from 'react-native';

// Code borrowed from https://github.com/ptelad/react-native-iphone-x-helper
export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
  );
}