import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, View, Text, Image, Dimensions, Platform, StatusBar, StyleSheet, PanResponder, TouchableWithoutFeedback } from 'react-native';

import { isIphoneX } from '../utils';

const { width: deviceWidth } = Dimensions.get('window');

const CONTAINER_MARGIN_TOP = (
  Platform.OS === 'ios'
    ?
    isIphoneX() ? 44 : 20
    :
    StatusBar.currentHeight + 10);  // Just to add a bit more padding

const slideOffsetYToTranslatePixelMapping = {
  inputRange: [0, 1],
  outputRange: [-150, 0]
};

const HORIZONTAL_MARGIN = 8; // left/right margin to screen edge

const getAnimatedContainerStyle = ({containerSlideOffsetY, containerDragOffsetY, containerScale}) => {
  // Map 0-1 value to translateY value
  const slideInAnimationStyle = {
    transform: [
      {translateY: containerSlideOffsetY.interpolate(slideOffsetYToTranslatePixelMapping)},
      {translateY: containerDragOffsetY},
      {scale: containerScale},
    ],
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
    renderPopupContent: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      show: false,

      /*
        Slide-in Animation
        Use value 0 - 1 to control the whole animation
        Then map it to actual behaviour in style in render
       */
      containerSlideOffsetY: new Animated.Value(0),
      slideOutTimer: null,

      // Drag Gesture
      containerDragOffsetY: new Animated.Value(0),

      // onPress Feedback
      containerScale: new Animated.Value(1),  // Directly set a scale

      onPressAndSlideOut: null,
      appIconSource: null,
      appTitle: null,
      timeText: null,
      title: null,
      body: null,
      slideOutTime: null,
    };
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => true,
      // onStartShouldSetPanResponderCapture: (e, gestureState) => false,
      onMoveShouldSetPanResponder: (e, gestureState) => true,
      // onMoveShouldSetPanResponderCapture: (e, gestureState) => false,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
    });
  }

  _onPanResponderGrant = (e, gestureState) => {
    // console.log('_onPanResponderGrant', gestureState);  // DEBUG
    this.onPressInFeedback();
  }

  // https://facebook.github.io/react-native/docs/animations.html#tracking-gestures
  _onPanResponderMove = (e, gestureState) => {
    // console.log('_onPanResponderMove', gestureState);  // DEBUG
    const { containerDragOffsetY } = this.state;
    // Prevent dragging down too much
    const newDragOffset = gestureState.dy < 100 ? gestureState.dy : 100;  // TODO: customize
    containerDragOffsetY.setValue(newDragOffset);
  }

  _onPanResponderRelease = (e, gestureState) => {
    // console.log('_onPanResponderRelease', gestureState);  // DEBUG
    const { onPressAndSlideOut, containerDragOffsetY } = this.state;

    // Present feedback
    this.onPressOutFeedback();

    // Check if it is onPress
    // Currently tolerate +-2 movement
    // Note that "move around, back to original position, release" still triggers onPress
    if (gestureState.dy <= 2 && gestureState.dy >= -2 && gestureState.dx <= 2 && gestureState.dx >= -2) {
      onPressAndSlideOut();
    }

    // Check if it is leaving the screen
    if (containerDragOffsetY._value < -30) {  // TODO: turn into constant
      // 1. If leaving screen -> slide out
      this.slideOutAndDismiss(200);
    } else {
      // 2. If not leaving screen -> slide back to original position
      this.clearTimerIfExist();
      Animated.timing(containerDragOffsetY, { toValue: 0, duration: 200 })
        .start(({finished}) => {
          // Reset a new countdown
          this.countdownToSlideOut();
        });
    }
  }
  
  renderPopupContent = () => {
    const { appIconSource, appTitle, timeText, title, body } = this.state;
    const { renderPopupContent } = this.props;
    if (renderPopupContent) {
      return renderPopupContent({ appIconSource, appTitle, timeText, title, body });
    }

    return (
      <View style={styles.popupContentContainer}>
        <View style={styles.popupHeaderContainer}>
          <View style={styles.headerIconContainer}>
            <Image style={styles.headerIcon} source={appIconSource || null} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText} numberOfLines={1}>
              {appTitle || ''}
            </Text>
          </View>
          <View style={styles.headerTimeContainer}>
            <Text style={styles.headerTime} numberOfLines={1}>
              {timeText || ''}
            </Text>
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
      </View>
    );
  }

  render() {
    const {
      show,
      containerSlideOffsetY, containerDragOffsetY, containerScale,
      onPressAndSlideOut,
    } = this.state;

    if (!show) {
      return null;
    }

    return (
      <Animated.View
        style={getAnimatedContainerStyle({containerSlideOffsetY, containerDragOffsetY, containerScale})}
        {...this._panResponder.panHandlers}>
        <TouchableWithoutFeedback onPress={onPressAndSlideOut}>
          <View>
            {this.renderPopupContent()}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }

  onPressInFeedback = () => {
    // console.log('PressIn!');  // DEBUG
    // Show feedback as soon as user press down
    const { containerScale } = this.state;
    Animated.spring(containerScale, { toValue: 0.95, friction: 8 })
      .start();
  }

  onPressOutFeedback = () => {
    // console.log('PressOut!');  // DEBUG
    // Show feedback as soon as user press down
    const { containerScale } = this.state;
    Animated.spring(containerScale, { toValue: 1, friction: 8 })
      .start();
  }

  createOnPressWithCallback = (callback) => {
    return () => {
      // slide out
      this.slideOutAndDismiss(200);

      // Run callback
      if (callback) callback();
    };
  }

  clearTimerIfExist = () => {
    const { slideOutTimer } = this.state;
    if (slideOutTimer) clearTimeout(slideOutTimer);
  }

  slideIn = (duration) => {
    // Animate "this.state.containerSlideOffsetY"
    const { containerSlideOffsetY } = this.state;  // Using the new one is fine
    Animated.timing(containerSlideOffsetY, { toValue: 1, duration: duration || 400, })  // TODO: customize
      .start(({finished}) => {
        this.countdownToSlideOut();
      });
  }

  countdownToSlideOut = () => {
    const slideOutTimer = setTimeout(() => {
      this.slideOutAndDismiss();
    }, this.state.slideOutTime);
    this.setState({ slideOutTimer });
  }

  slideOutAndDismiss = (duration) => {
    const { containerSlideOffsetY } = this.state;

    // Reset animation to 0 && show it && animate
    Animated.timing(containerSlideOffsetY, { toValue: 0, duration: duration || 400, })  // TODO: customize
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
    const {
      onPress: onPressCallback,
      appIconSource,
      appTitle,
      timeText,
      title,
      body,
      slideOutTime
    } = _messageConfig;
    const onPressAndSlideOut = this.createOnPressWithCallback(onPressCallback);
    this.setState({
      show: true,
      containerSlideOffsetY: new Animated.Value(0),
      slideOutTimer: null,
      containerDragOffsetY: new Animated.Value(0),
      containerScale: new Animated.Value(1),
      onPressAndSlideOut,
      appIconSource,
      appTitle,
      timeText,
      title,
      body,
      slideOutTime: typeof slideOutTime !== 'number' ? 4000 : slideOutTime
    }, this.slideIn);
  }
}

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    width: deviceWidth - (HORIZONTAL_MARGIN * 2),
    left: HORIZONTAL_MARGIN,
    right: HORIZONTAL_MARGIN,
    top: CONTAINER_MARGIN_TOP,
  },

  popupContentContainer: {
    backgroundColor: 'white',  // TEMP
    borderRadius: 12,
    minHeight: 86,
    // === Shadows ===
    // Android
    elevation: 2,
    // iOS
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 0,
    },
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
