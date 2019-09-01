# React Native Push Notification Popup

[![npm version](https://badge.fury.io/js/react-native-push-notification-popup.svg)](https://badge.fury.io/js/react-native-push-notification-popup)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://GitHub.com/Naereen/ama)

![iOS Preview](https://github.com/carsonwah/_file_hosting/blob/master/react-native-push-notification-popup/ios-example.gif?raw=true) ![Android Preview](https://github.com/carsonwah/_file_hosting/blob/master/react-native-push-notification-popup/android-example.gif?raw=true)

## Features

- Support "pan" gesture
- Support "onPress" gesture feedback
- Written in pure-JS using official react-native `Animation` package
    - *Which means it supports all Expo/CRNA apps*
- Support iPhone X, XS, Max (yeah that notch)
- Support Android native "elevation"

## Motivations

[Blog post](https://medium.com/@carsonwah/show-push-notification-popup-in-react-native-19db965a5603)

1. In some apps, you may just want to display reminders to user, without going through those troublesome push notification setups
2. Expo/CNRA apps [cannot display push notification while app is in foreground](https://docs.expo.io/versions/v27.0.0/guides/push-notifications#notification-handling-timing)
3. Even if you eject, you still need to configure [iOS](https://stackoverflow.com/questions/14872088/get-push-notification-while-app-in-foreground-ios) and [Android](https://stackoverflow.com/questions/38451235/how-to-handle-the-fire-base-notification-when-app-is-in-foreground) separately with native codes

This package is here to help. Just show your own notification popup to your users!

## Installation

```bash
# yarn, recommended
yarn add react-native-push-notification-popup

# or npm
npm install react-native-push-notification-popup --save
```

## Usage

### Declare Component

Put it in a wrapper component. (Maybe where you handle your incoming push notifications)

```javascript
import NotificationPopup from 'react-native-push-notification-popup';

class MyComponent extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MaybeYourNavigator />
        <NotificationPopup ref={ref => this.popup = ref} />
      </View>
    );
  }
// ...
```

> **IMPORTANT**: Remember to put it on the **bottom of other components**, because React render from back to front in order of declaration. We do not use `zIndex` becuase it is [problematic on Android](https://github.com/carsonwah/react-native-push-notification-popup/issues/21).

#### Optional: Customize your popup

```javascript
// Render function
const renderCustomPopup = ({ appIconSource, appTitle, timeText, title, body }) => (
  <View>
    <Text>{title}</Text>
    <Text>{body}</Text>
  </View>
);

class MyComponent extends React.Component {
  render() {
      return (
        <View style={styles.container}>
          <NotificationPopup
            ref={ref => this.popup = ref}
            renderPopupContent={renderCustomPopup} />
        </View>
      );
    }
// ...
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
    slideOutTime: 5000
  });
}
```

### Props

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| **`renderPopupContent`** | function <br /> `(options?: { appIconSource?: ImageSourcePropType; appTitle?: string; timeText?: string; title?: string;body?: string; }) => React.ReactElement<any>` | null | Render your own custom popup body (Optional) |

### Methods

#### .show()

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| **`onPress`** | Function | null | Callback to be called when user press the popup |
| **`appIconSource`** | [Image source](https://facebook.github.io/react-native/docs/image.html#source) | null | Icon on the upper left |
| **`appTitle`** | String | '' | Usually your app name, but you can also customize it |
| **`timeText`** | String | '' | Text on the upper right |
| **`title`** | String | '' | Message title |
| **`body`** | String | '' | Message body (support multi-line) |
| **`slideOutTime`** | Number | 4000 | Time until notification slides out |


## Roadmap

- [ ] Add testing
- [ ] Add example/ project
- [ ] Support showing it globally
- [ ] Customizing props: speed, duration, etc
- [ ] Support image on the right-side
- [ ] Android material design style
- [ ] Other types of popup, e.g. without app icon
- [ ] More usage examples
- [ ] Identify peerDependencies on react-native

## Contributing

### Debugging

1. Clone this repo
2. Run `yarn --production`
   1. *(Installing dependencies without --production will include devDependencies (e.g. react-native), which causes crashes)*
3. Create a react-native project next to it
4. Add dependency to package.json
   1. `"react-native-push-notification-popup": "file:../react-native-push-notification-popup"`
5. Try it
6. Re-run `yarn --production` whenever there is any code change

### Linting

1. Run `yarn` (Install devDependencies)
2. Run `yarn run lint`

## License

[MIT License](https://opensource.org/licenses/mit-license.html). © Carson Wah 2018


