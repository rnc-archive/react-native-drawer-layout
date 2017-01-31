/* global test, expect */
import {
  View,
} from 'react-native';
import React from 'react'; // eslint-disable-line
import DrawerLayout from '../DrawerLayout';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('it renders correctly', () => {
  const tree = renderer.create(
    <DrawerLayout
      drawerPosition="left"
      renderNavigationView={() => <View />}>
      <View />
    </DrawerLayout>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
