import React, {useContext} from 'react';
import {StyleSheet, SafeAreaView, Text} from 'react-native';
import {Button} from 'react-native-web';

import {MainContext} from '../contexts/MainContext';

const Profile = () => {
  const {setIsLoggedIn} = useContext(MainContext);
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <Button
        title="Log out!"
        onPress={() => {
          setIsLoggedIn(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
});

export default Profile;
