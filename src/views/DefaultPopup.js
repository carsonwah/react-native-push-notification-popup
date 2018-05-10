import React, { Component } from 'react';
import { Animated, View, Text, Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { isIphoneX } from 'react-native-iphone-x-helper';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const CONTAINER_MARGIN_TOP = (
  Platform.OS === 'ios'
    ?
    isIphoneX() ? 44 : 20
    :
    StatusBar.currentHeight);

// // Main Container
// const CONTAINER_MARGIN_HORIZONTAL = 8;
// const CONTAINER_BORDER_RADIUS = 12;
// const CONTAINER_MIN_HEIGHT = 86;

// // Header
// const HEADER_CONTAINER_HEIGHT = 32;
// const HEADER_CONTENT_HEIGHT = 20;
// const HEADER_CONTENT_MARGIN_VERTICAL = 6;
// const HEADER_ICON_MARGIN_HORIZONTAL = 6;
// const HEADER_TIME_MARGIN_HORIZONTAL = 16;

// // Content
// const CONTENT_MARGIN_TOP = 8;
// const CONTENT_MARGIN_BOTTOM = 10;
// const CONTENT_MARGIN_HORIZONTAL = 16;

export default class DefaultPopup extends Component {

  static propTypes = {
    onPress: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      slideInAnimationValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const slideDownFromTopAnimation = Animated.timing(this.state.slideInAnimationValue, { toValue: 1, duration: 500, });
    slideDownFromTopAnimation.start();
  }

  render() {
    const { slideInAnimationValue } = this.state;
    const slideInAnimationStyle = {
      transform: [{
        translateY: slideInAnimationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-130, 0]
        }),
      }],
    };
    const animatedContainerStyle = [
      styles.popupContainer,
      slideInAnimationStyle,
    ];

    return (
      <View style={styles.fullScreenContainer}>

        <View style={styles.fullScreenOverlay} />

        <Animated.View style={animatedContainerStyle}>
          <View style={styles.popupHeaderContainer}>
            <View style={styles.headerIconContainer}>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText} numberOfLines={1}>{'Hello World'}</Text>
            </View>
            <View style={styles.headerTimeContainer}>
              <Text style={styles.headerTime} numberOfLines={1}>{'Now'}</Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.contentTitleContainer}>
              <Text style={styles.contentTitle}>{'Hello'}</Text>
            </View>
            <View style={styles.contentTextContainer}>
              <Text style={styles.contentText}>{'Line 1\nLine 2\nLine 3\nblahblahblah...'}</Text>
            </View>
          </View>
        </Animated.View>

      </View>
    );
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
    backgroundColor: 'red',  // TEMP
    borderRadius: 4,
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
