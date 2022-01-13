import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, View, Text, ImageBackground} from 'react-native';
import GlobalStyles from './utils/GlobalStyles';
import List from './components/List';
import {Menu, Settings} from 'react-native-feather';

const App = () => {
  return (
    <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
      <StatusBar backgroundColor="goldenrod" barStyle="light" />
      <View style={GlobalStyles.Header}>
        <ImageBackground
          source={require('./assets/cat.jpeg')}
          style={GlobalStyles.BackgroundImage}
          imageStyle={{borderBottomRightRadius: 65}}
        ></ImageBackground>
        <Menu
          stroke="chocolate"
          width={32}
          height={32}
          style={GlobalStyles.Menu}
        ></Menu>
        <Settings
          stroke="sandybrown"
          width={32}
          height={32}
          style={GlobalStyles.Settings}
        />
        <Text style={GlobalStyles.Text}>Hello World</Text>
      </View>
      <List />
    </SafeAreaView>
  );
};

export default App;
