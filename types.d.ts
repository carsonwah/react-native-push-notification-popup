declare module 'react-native-push-notification-popup' {
  import { Component } from 'react'
  import { ImageSourcePropType } from 'react-native'

  interface ShowOptions {
    onPress?: () => void;
    appIconSource?: ImageSourcePropType;
    appTitle?: string;
    timeText?: string;
    title?: string;
    body?: string;
    slideOutTime?: number;
  }

  export default class ReactNativePushNotificationPopup extends Component {
    public show(options: ShowOptions): void;
  }
}
