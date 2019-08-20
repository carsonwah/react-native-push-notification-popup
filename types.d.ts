/// <reference types="react"/>
/// <reference types="react-native"/>

declare module "react-native-push-notification-popup" {
  import { ReactElement, Component } from "react";
  import { StyleProp, ViewStyle, ImageSourcePropType } from "react-native";

  interface ContentOptionsBase {
    appIconSource?: ImageSourcePropType;
    appTitle?: string;
    timeText?: string;
    title?: string;
    body?: string;
  }

  interface ShowOptions extends ContentOptionsBase {
    onPress?: () => void;
    slideOutTime?: number;
  }

  interface PushNotificationPopupProps {
    renderPopupContent?: (options: ContentOptionsBase) => ReactElement;
  }

  export default class ReactNativePushNotificationPopup extends Component<PushNotificationPopupProps, any> {
    public show(options: ShowOptions): void;
  }
}
