// @flow
import React, { Component } from 'react';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  I18nManager,
} from 'react-native';

const MIN_SWIPE_DISTANCE = 3;
const DEVICE_WIDTH = parseFloat(Dimensions.get('window').width);
const THRESHOLD = DEVICE_WIDTH / 2;
const VX_MAX = 0.1;

const IDLE = 'Idle';
const DRAGGING = 'Dragging';
const SETTLING = 'Settling';

export type PropType = {
  children: any,
  drawerBackgroundColor?: string,
  drawerLockMode?: 'unlocked' | 'locked-closed' | 'locked-open',
  drawerPosition: 'left' | 'right',
  drawerWidth: number,
  keyboardDismissMode?: 'none' | 'on-drag',
  onDrawerClose?: Function,
  onDrawerOpen?: Function,
  onDrawerSlide?: Function,
  onDrawerStateChanged?: Function,
  renderNavigationView: () => any,
  statusBarBackgroundColor?: string,
  useNativeAnimations?: boolean,
};

export type StateType = {
  drawerShown: boolean,
  openValue: any,
};

export type EventType = {
  stopPropagation: Function,
};

export type PanResponderEventType = {
  dx: number,
  dy: number,
  moveX: number,
  moveY: number,
  vx: number,
  vy: number,
};

export type DrawerMovementOptionType = {
  velocity?: number,
};

export default class DrawerLayout extends Component {
  props: PropType;
  state: StateType;
  _lastOpenValue: number;
  _panResponder: any;
  _isClosing: boolean;
  _closingAnchorValue: number;
  _isRTL: boolean;

  static defaultProps = {
    drawerWidth: 0,
    drawerPosition: 'left',
    useNativeAnimations: false,
  };

  static positions = {
    Left: 'left',
    Right: 'right',
  };

  constructor(props: PropType, context: any) {
    super(props, context);

    this.state = {
      openValue: new Animated.Value(0),
      drawerShown: false,
    };
  }

  componentWillMount() {
    const { openValue } = this.state;

    this._isRTL = I18nManager.isRTL;

    openValue.addListener(({ value }) => {
      const drawerShown = value > 0;
      if (drawerShown !== this.state.drawerShown) {
        this.setState({ drawerShown });
      }

      if (this.props.keyboardDismissMode === 'on-drag') {
        dismissKeyboard();
      }

      this._lastOpenValue = value;
      if (this.props.onDrawerSlide) {
        this.props.onDrawerSlide({ nativeEvent: { offset: value } });
      }
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._shouldSetPanResponder,
      onPanResponderGrant: this._panResponderGrant,
      onPanResponderMove: this._panResponderMove,
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: this._panResponderRelease,
      onPanResponderTerminate: () => {},
    });
  }

  render() {
    const {
      drawerShown,
      openValue,
    } = this.state;

    const {
      drawerBackgroundColor,
      drawerPosition,
      drawerWidth,
    } = this.props;

    const dynamicDrawerStyles = {
      backgroundColor: drawerBackgroundColor,
      width: drawerWidth,
      left: drawerPosition === 'left' ? 0 : null,
      right: drawerPosition === 'right' ? 0 : null,
    };

    /* Drawer styles */
    let outputRange;

    if (drawerPosition === 'left') {
      outputRange = this._isRTL ? [drawerWidth, 0] : [-drawerWidth, 0];
    } else {
      outputRange = this._isRTL ? [-drawerWidth, 0] : [drawerWidth, 0];
    }

    const drawerTranslateX = openValue.interpolate({
      inputRange: [0, 1],
      outputRange,
      extrapolate: 'clamp',
    });
    const animatedDrawerStyles = {
      transform: [{ translateX: drawerTranslateX }],
    };

    /* Overlay styles */
    const overlayOpacity = openValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7],
      extrapolate: 'clamp',
    });
    const animatedOverlayStyles = { opacity: overlayOpacity };
    const pointerEvents = drawerShown ? 'auto' : 'none';

    return (
      <View
        style={{ flex: 1, backgroundColor: 'transparent' }}
        {...this._panResponder.panHandlers}
      >
        <Animated.View style={styles.main}>
          {this.props.children}
        </Animated.View>
        <TouchableWithoutFeedback
          pointerEvents={pointerEvents}
          onPress={this._onOverlayClick}
        >
          <Animated.View
            pointerEvents={pointerEvents}
            style={[styles.overlay, animatedOverlayStyles]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[styles.drawer, dynamicDrawerStyles, animatedDrawerStyles]}
        >
          {this.props.renderNavigationView()}
        </Animated.View>
      </View>
    );
  }

  _onOverlayClick = (e: EventType) => {
    e.stopPropagation();
    if (!this._isLockedClosed() && !this._isLockedOpen()) {
      this.closeDrawer();
    }
  };

  _emitStateChanged = (newState: string) => {
    if (this.props.onDrawerStateChanged) {
      this.props.onDrawerStateChanged(newState);
    }
  };

  openDrawer = (options: DrawerMovementOptionType = {}) => {
    this._emitStateChanged(SETTLING);
    Animated.spring(this.state.openValue, {
        toValue: 1,
        bounciness: 0,
        restSpeedThreshold: 0.1,
        useNativeDriver: this.props.useNativeAnimations,
        ...options,
      })
      .start(() => {
        if (this.props.onDrawerOpen) {
          this.props.onDrawerOpen();
        }
        this._emitStateChanged(IDLE);
      });
  };

  closeDrawer = (options: DrawerMovementOptionType = {}) => {
    this._emitStateChanged(SETTLING);
    Animated.spring(this.state.openValue, {
        toValue: 0,
        bounciness: 0,
        restSpeedThreshold: 1,
        useNativeDriver: this.props.useNativeAnimations,
        ...options,
      })
      .start(() => {
        if (this.props.onDrawerClose) {
          this.props.onDrawerClose();
        }
        this._emitStateChanged(IDLE);
      });
  };

  _handleDrawerOpen = () => {
    if (this.props.onDrawerOpen) {
      this.props.onDrawerOpen();
    }
  };

  _handleDrawerClose = () => {
    if (this.props.onDrawerClose) {
      this.props.onDrawerClose();
    }
  };

  _shouldSetPanResponder = (
    e: EventType,
    { moveX, dx, dy }: PanResponderEventType,
  ) => {
    if (!dx || !dy || Math.abs(dx) < MIN_SWIPE_DISTANCE) {
      return false;
    }

    const { drawerPosition } = this.props;

    if (this._isLockedClosed() || this._isLockedOpen()) {
      return false;
    }

    if (drawerPosition === 'left') {
      const overlayArea = DEVICE_WIDTH -
        (DEVICE_WIDTH - this.props.drawerWidth);

      if (this._lastOpenValue === 1) {
        if (
          (dx < 0 && Math.abs(dx) > Math.abs(dy) * 3) || moveX > overlayArea
        ) {
          this._isClosing = true;
          this._closingAnchorValue = this._getOpenValueForX(moveX);
          return true;
        }
      } else {
        if (moveX <= 35 && dx > 0) {
          this._isClosing = false;
          return true;
        }

        return false;
      }
    } else {
      const overlayArea = DEVICE_WIDTH - this.props.drawerWidth;

      if (this._lastOpenValue === 1) {
        if (
          (dx > 0 && Math.abs(dx) > Math.abs(dy) * 3) || moveX < overlayArea
        ) {
          this._isClosing = true;
          this._closingAnchorValue = this._getOpenValueForX(moveX);
          return true;
        }
      } else {
        if (moveX >= DEVICE_WIDTH - 35 && dx < 0) {
          this._isClosing = false;
          return true;
        }

        return false;
      }
    }
  };

  _panResponderGrant = () => {
    this._emitStateChanged(DRAGGING);
  };

  _panResponderMove = (e: EventType, { moveX }: PanResponderEventType) => {
    let openValue = this._getOpenValueForX(moveX);

    if (this._isClosing) {
      openValue = 1 - (this._closingAnchorValue - openValue);
    }

    if (openValue > 1) {
      openValue = 1;
    } else if (openValue < 0) {
      openValue = 0;
    }

    this.state.openValue.setValue(openValue);
  };

  _panResponderRelease = (
    e: EventType,
    { moveX, vx }: PanResponderEventType,
  ) => {
    const { drawerPosition } = this.props;
    const previouslyOpen = this._isClosing;
    const isWithinVelocityThreshold = vx < VX_MAX && vx > -VX_MAX;

    if (drawerPosition === 'left') {
      if (
        (vx > 0 && moveX > THRESHOLD) ||
        vx >= VX_MAX ||
        (isWithinVelocityThreshold && previouslyOpen && moveX > THRESHOLD)
      ) {
        this.openDrawer({ velocity: vx });
      } else if (
        (vx < 0 && moveX < THRESHOLD) ||
        vx < -VX_MAX ||
        (isWithinVelocityThreshold && !previouslyOpen)
      ) {
        this.closeDrawer({ velocity: vx });
      } else if (previouslyOpen) {
        this.openDrawer();
      } else {
        this.closeDrawer();
      }
    }

    if (drawerPosition === 'right') {
      if (
        (vx < 0 && moveX < THRESHOLD) ||
        vx <= -VX_MAX ||
        (isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD)
      ) {
        this.openDrawer({ velocity: (-1) * vx });
      } else if (
        (vx > 0 && moveX > THRESHOLD) ||
        vx > VX_MAX ||
        (isWithinVelocityThreshold && !previouslyOpen)
      ) {
        this.closeDrawer({ velocity: (-1) * vx });
      } else if (previouslyOpen) {
        this.openDrawer();
      } else {
        this.closeDrawer();
      }
    }
  };

  _isLockedClosed = () => {
    return this.props.drawerLockMode === 'locked-closed' &&
      !this.state.drawerShown;
  };

  _isLockedOpen = () => {
    return this.props.drawerLockMode === 'locked-open' &&
      this.state.drawerShown;
  };

  _getOpenValueForX(x: number): number {
    const { drawerPosition, drawerWidth } = this.props;

    if (drawerPosition === 'left') {
      return x / drawerWidth;
    }

    // position === 'right'
    return (DEVICE_WIDTH - x) / drawerWidth;
  }
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 1001,
  },
  main: {
    flex: 1,
    zIndex: 0,
  },
  overlay: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000,
  },
});
