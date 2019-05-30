declare module 'react-native-push-notification-popup' {
  import { Component } from 'react'
  import { ViewStyle, ImageStyle, TextStyle } from 'react-native'

  interface ShowOptions {
    onPress?: () => void;
    appIconSource?: string;
    appTitle?: string;
    timeText?: string;
    title?: string;
    body?: string;
    slideOutTime?: number;
  }

  interface Style {
    popupContainer?: ViewStyle;
    popupHeaderContainer?: ViewStyle;
    headerIconContainer?: ViewStyle;
    headerIcon?: ImageStyle;
    headerTextContainer?: ViewStyle;
    headerText?: TextStyle;
    headerTimeContainer?: ViewStyle;
    headerTime?: TextStyle;
    contentContainer?: ViewStyle;
    contentTitleContainer?: ViewStyle;
    contentTitle?: TextStyle;
    contentTextContainer?: ViewStyle;
    contentText?: TextStyle;
  }

  interface Props {
    style?: Style
  }

  export default class ReactNativePushNotificationPopup extends Component<Props> {
    public show(options: ShowOptions): void;
  }
}
