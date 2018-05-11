import React, { Component } from 'react';
import { Animated, View, Text, Image, Dimensions, Platform, StatusBar, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';

import { isIphoneX } from 'react-native-iphone-x-helper';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const CONTAINER_MARGIN_TOP = (
  Platform.OS === 'ios'
    ?
    isIphoneX() ? 44 : 20
    :
    StatusBar.currentHeight);

const getAnimatedContainerStyle = (slideInAnimationValue) => {
  // Map 0-1 value to translateY value
  const slideInAnimationStyle = {
    transform: [{
      translateY: slideInAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-150, 0]
      }),
    }],
  };

  // Combine with original container style
  const animatedContainerStyle = [
    styles.popupContainer,
    slideInAnimationStyle,
  ];

  return animatedContainerStyle;
};

export default class DefaultPopup extends Component {

  static propTypes = {
    // show: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.initialState = {
      show: false,
      /*
        Use value 0 - 1 to control the whole animation
        Then map it to actual behaviour in style in render
       */
      slideInAnimationValue: new Animated.Value(0),
      slideOutTimer: null,

      onPress: null,
      appIconSource: null,
      appTitle: null,
      timeText: null,
      title: null,
      body: null,
    };
    this.state = {
      ...this.initialState,
    };
  }

  // componentDidMount() {
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   // Check if "show" prop has changed from false to true
  //   if (!prevProps.show && this.props.show) {
  //     // console.log('props.show changes from true to false!');  // DEBUG
  //     const { slideOutTimer } = this.state;
  //     clearTimeout(slideOutTimer);
  //     this.showAndSlideIn();
  //   }

  //   // From true to false
  //   if (prevProps.show && !this.props.show) {
  //     // console.log('props.show changes from false to true!');  // DEBUG
  //     const { slideOutTimer } = this.state;
  //     if (slideOutTimer) {
  //       clearTimeout(slideOutTimer);
  //       this.slideOutAndDismiss();
  //     }
  //   }
  // }

  render() {
    // const { onPress, appIconSource, appTitle, timeText, title, body } = this.props;
    const {
      show, slideInAnimationValue,
      onPress, appIconSource, appTitle, timeText, title, body
    } = this.state;

    return (
      <View style={styles.fullScreenContainer}>

        <View style={styles.fullScreenOverlay} />

        {
          !!show &&
          <TouchableWithoutFeedback onPress={onPress || function(){}}>
            <Animated.View style={getAnimatedContainerStyle(slideInAnimationValue)}>
              <View style={styles.popupHeaderContainer}>
                <View style={styles.headerIconContainer}>
                  <Image style={styles.headerIcon} source={appIconSource || null} />
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerText} numberOfLines={1}>{appTitle || ''}</Text>
                </View>
                <View style={styles.headerTimeContainer}>
                  <Text style={styles.headerTime} numberOfLines={1}>{timeText || ''}</Text>
                </View>
              </View>
              <View style={styles.contentContainer}>
                <View style={styles.contentTitleContainer}>
                  <Text style={styles.contentTitle}>{title || ''}</Text>
                </View>
                <View style={styles.contentTextContainer}>
                  <Text style={styles.contentText}>{body || ''}</Text>
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        }

      </View>
    );
  }

  clearTimerIfExist = () => {
    const { slideOutTimer } = this.state;
    if (slideOutTimer) clearTimeout(slideOutTimer);
  }

  slideIn = () => {
    // Animate "this.state.slideInAnimationValue"
    const { slideInAnimationValue } = this.state;  // Using the new one is fine
    Animated.timing(slideInAnimationValue, { toValue: 1, duration: 400, })  // TODO: customize
      .start(({finished}) => {
        this.countdownToSlideOut();
      });
  }

  countdownToSlideOut = () => {
    const slideOutTimer = setTimeout(() => {
      this.slideOutAndDismiss();
    }, 4000);  // TODO: customize
    this.setState({ slideOutTimer });
  }

  slideOutAndDismiss = () => {
    const { slideInAnimationValue } = this.state;

    // Reset animation to 0 && show it && animate
    Animated.timing(slideInAnimationValue, { toValue: 0, duration: 400, })  // TODO: customize
      .start(({finished}) => {
        // Reset everything and hide the popup
        this.setState({ show: false });
      });
  }

  // Public method
  show = (messageConfig) => {
    this.clearTimerIfExist();

    // Put message configs into state && show popup
    const _messageConfig = messageConfig || {};
    const { onPress, appIconSource, appTitle, timeText, title, body } = _messageConfig;
    this.setState({
      show: true,
      slideInAnimationValue: new Animated.Value(0),
      slideOutTimer: null,
      onPress, appIconSource, appTitle, timeText, title, body
    }, this.slideIn);
  }
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
    width: deviceWidth,
    height: deviceHeight,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1000,
  },
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'grey',  // TEMP
  },
  popupContainer: {
    minHeight: 86,
    width: deviceWidth - (8 * 2),
    top: CONTAINER_MARGIN_TOP,
    // marginTop: CONTAINER_MARGIN_TOP,
    // marginHorizontal: 8,
    backgroundColor: 'white',  // TEMP
    borderRadius: 12,
    overflow: 'hidden',
  },
  popupHeaderContainer: {
    height: 32,
    backgroundColor: '#F1F1F1',  // TEMP
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconContainer: {
    height: 20,
    width: 20,
    marginLeft: 12,
    marginRight: 8,
    borderRadius: 4,
  },
  headerIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 13,
    color: '#808080',
    lineHeight: 20,
  },
  headerTimeContainer: {
    marginHorizontal: 16,
  },
  headerTime: {
    fontSize: 12,
    color: '#808080',
    lineHeight: 14,
  },
  contentContainer: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  contentTitleContainer: {
  },
  contentTitle: {
    fontSize: 15,
    lineHeight: 18,
    color: 'black',
  },
  contentTextContainer: {
  },
  contentText: {
    fontSize: 12,
    lineHeight: 14,
    color: '#808080',
    marginTop: 5,
  },
});
