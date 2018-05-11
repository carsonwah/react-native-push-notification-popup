# React Native Push Notification Popup

[TODO] preview gif

## Features

- Support "pan" gesture
- Support "onPress" gesture feedback
- Written in pure-JS using official react-native `Animation` package
    - *Which means it supports all Expo/CRNA apps*
- Support iPhone X (yeah that notch)

## Motivations

1. In some apps, you may just want to display reminders to user, without going through those troublesome push notification setups
2. Expo/CNRA apps [cannot display push notification while app is in foreground](https://docs.expo.io/versions/v27.0.0/guides/push-notifications#notification-handling-timing)
3. Even if you eject, you still need to configure [iOS](https://stackoverflow.com/questions/14872088/get-push-notification-while-app-in-foreground-ios) and [Android](https://stackoverflow.com/questions/38451235/how-to-handle-the-fire-base-notification-when-app-is-in-foreground) separately with native codes

This package is here to help. Just show your own notification popup to your users!

## Installation

```bash
yarn add react-native-push-notification-popup  # recommended
npm install react-native-push-notification-popup --save
```

## Usage

### Declare Component

Put it in a wrapper component. (Maybe where you handle your incoming push notifications)

```javascript
  render() {
    return (
      <View style={styles.container}>
        <NotificationPopup ref={ref => this.popup = ref} />
        <MaybeYourNavigator />
      </View>
    );
  }
```

### Show it!

```javascript
componentDidMount() {
  this.popup.show({
    onPress: function() {console.log('Pressed')},
    appIconSource: require('./assets/icon.jpg'),
    appTitle: 'Some App',
    timeText: 'Now',
    title: 'Hello World',
    body: 'This is a sample message.\nTesting emoji 😀',
  });
}
```

### Props

*(Customizing options coming soon)*

### Methods

#### .show()

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| **`onPress`** | Function | null |  |
| **`appIconSource`** | [Image source](https://facebook.github.io/react-native/docs/image.html#source) | null |  |
| **`appTitle`** | String | '' |  |
| **`timeText`** | String | '' |  |
| **`title`** | String | '' |  |
| **`body`** | String | '' |  |


## Roadmap

- [ ] Customizing props: speed, duration, etc
- [ ] Android material design style
- [ ] Other types of popup, e.g. without app icon
- [ ] More usage examples
- [ ] Transparent Background
- [ ] Identify peerDependencies on react-native

## License

[MIT License](https://opensource.org/licenses/mit-license.html). © Carson Wah 2018


