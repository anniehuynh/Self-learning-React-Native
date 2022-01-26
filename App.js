import React from 'react';
import {StatusBar} from 'expo-status-bar';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
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
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider
      {...eva}
      theme={{...eva.light, ...theme}}
      customMapping={mapping}
    >
      <App />
    </ApplicationProvider>
  </>
);
