import { Text } from 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

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
    describe('componentWillMount', () => {
      it('should add a listener to the open value');
      it('the listener should set the drawerShown value value');
      it('the listener should dismiss the keyboard');
      it('the listener should call on drawer slide');
    });
  });

  describe('pan responder', () => {
    // TODO: also test _getOpenValueForX here

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
      it('should return false if locked');
      // TODO: more test cases
    });
  });

  describe('external methods', () => {
    describe('openDrawer', () => {
      it('should emit event');
      it('should start animation');
      it('should emit idle event when done with animation');
      it('should call callback when done with animation');
    });
    describe('closeDrawer', () => {
      it('should emit event');
      it('should start animation');
      it('should emit idle event when done with animation');
      it('should call callback when done with animation');
    });
  });
});
