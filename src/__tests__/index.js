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
});
