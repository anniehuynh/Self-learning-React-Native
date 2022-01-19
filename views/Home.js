import React from 'react';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import List from '../components/List';

const Home = () => {
  return (
    <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
      <List />
    </SafeAreaView>
  );
};

export default Home;
