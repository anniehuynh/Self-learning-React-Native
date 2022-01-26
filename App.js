import React from 'react';
import {StatusBar} from 'expo-status-bar';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {FeatherIconsPack} from './utils/feather-icons';

import {default as theme} from './theme.json';
import {default as mapping} from './mapping.json';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';

const App = () => {
  return (
    <>
      <MainProvider>
        <Navigator />
      </MainProvider>
      <StatusBar style="auto" />
    </>
  );
};

// eslint-disable-next-line react/display-name
export default () => (
  <>
    <IconRegistry icons={FeatherIconsPack} />
    <ApplicationProvider
      {...eva}
      theme={{...eva.light, ...theme}}
      customMapping={mapping}
    >
      <App />
    </ApplicationProvider>
  </>
);
