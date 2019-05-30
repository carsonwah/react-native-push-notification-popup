declare module 'react-native-push-notification-popup' {
  import { Component } from 'react'

  interface ShowOptions {
    onPress?: () => void;
    appIconSource?: string;
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
