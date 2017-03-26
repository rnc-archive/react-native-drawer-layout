import { Animated, Text } from 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import DrawerLayout from '../DrawerLayout';

describe('DrawerLayout', () => {
  it('renders closed correctly', () => {
    const tree = renderer
      .create(
        <DrawerLayout
          drawerWidth={300}
          drawerPosition={DrawerLayout.positions.Left}
          renderNavigationView={() => <Text>Drawer</Text>}
        >
          <Text>Content!</Text>
        </DrawerLayout>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('lifecycle methods', () => {
    let rendered = null;
    const onDrawerSlide = jest.fn();

    beforeEach(() => {
      rendered = shallow(
        <DrawerLayout
          drawerPosition={DrawerLayout.positions.Left}
          drawerWidth={300}
          onDrawerSlide={onDrawerSlide}
          renderNavigationView={() => <Text>Drawer</Text>}
        >
          <Text>Content!</Text>
        </DrawerLayout>,
      );
    });
    describe('componentWillMount', () => {
      it('should add a listener to the open value', () => {
        const openValue = {
          addListener: jest.fn(),
          interpolate: jest.fn(),
        };
        rendered.setState({ openValue });
        rendered.instance().componentWillMount();
        expect(openValue.addListener).toHaveBeenCalled();
      });

      it('the listener should set the drawerShown value', () => {
        const callbacks = [];
        const openValue = {
          addListener: item => callbacks.push(item),
          interpolate: jest.fn(),
        };
        rendered.setState({ openValue, drawerShown: false });
        rendered.instance().componentWillMount();
        expect(callbacks.length).toBe(1);

        // call callback
        const cb = callbacks[0];
        cb({ value: 0.5 });

        expect(rendered.state('drawerShown')).toBeTruthy();
      });

      it('the listener should call on drawer slide', () => {
        const callbacks = [];
        const openValue = {
          addListener: item => callbacks.push(item),
          interpolate: jest.fn(),
        };
        rendered.setState({ openValue, drawerShown: false });
        rendered.instance().componentWillMount();
        expect(callbacks.length).toBe(1);

        // call callback
        const cb = callbacks[0];
        cb({ value: 0.5 });

        expect(onDrawerSlide).toHaveBeenCalled();
      });

      it('the listener should dismiss the keyboard');
    });
  });

  describe('pan responder', () => {
    describe('_getOpenValueForX', () => {
      it('should return 1 if the drawer is fully opened');
      it('should return 0 if the drawer is fully closed');
      it('should work for left and right');
    });

    describe('panResponderRelease', () => {
      it('should open the drawer after threshold for left');
      it('should open the drawer according to speed for left');
      it('should close the drawer after threshold for left');
      it('should close the drawer according to speed for left');
      it('should open the drawer after threshold for right');
      it('should open the drawer according to speed for right');
      it('should close the drawer after threshold for right');
      it('should close the drawer according to speed for right');
    });
    describe('panResponderMove', () => {
      it('should set the open value');
      it('should set the open value to max 1');
      it('should set the open value to min 0');
    });
    describe('panResponderGrant', () => {
      it('should emit dragging');
    });
    describe('shouldSetPanResponder', () => {
      it('returns false if locked');
      describe('open', () => {
        it('returns true if significant swipe to right, position left');
        it('returns true if significant swipe to left, position right');
      });

      describe('closed', () => {
        it('returns true if significant sw to right, position right');
        it('returns true if significant swipe to left, position left');
      });

      it('returns false if vertical swipe');
    });
  });

  describe('external methods', () => {
    let rendered = null;
    let onDrawerStateChanged = null;

    beforeEach(() => {
      onDrawerStateChanged = jest.fn();
      onDrawerOpen = jest.fn();

      rendered = shallow(
        <DrawerLayout
          drawerPosition={DrawerLayout.positions.Left}
          drawerWidth={300}
          onDrawerStateChanged={onDrawerStateChanged}
          renderNavigationView={() => <Text>Drawer</Text>}
        >
          <Text>Content!</Text>
        </DrawerLayout>,
      );
    });

    describe('openDrawer', () => {
      it('should emit event', () => {
        rendered.instance().openDrawer();
        expect(onDrawerStateChanged).toHaveBeenCalledWith('Settling');
      });

      it('should start animation');
      it('should emit idle event when done with animation');
      it('should call callback when done with animation');
    });

    describe('closeDrawer', () => {
      it('should emit event', () => {
        rendered.instance().closeDrawer();
        expect(onDrawerStateChanged).toHaveBeenCalledWith('Settling');
      });

      it('should start animation');
      it('should emit idle event when done with animation');
      it('should call callback when done with animation');
    });
  });
});
