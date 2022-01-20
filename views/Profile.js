import React, {useContext} from 'react';
import {StyleSheet, SafeAreaView, Text, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {MainContext} from '../contexts/MainContext';

const Profile = () => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  console.log('Profile', user); // to be removed
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <Text>{user.username}</Text>
      <Text>{user.email}</Text>
      <Text>{user.full_name}</Text>
      <Button
        title="Log out!"
        onPress={async () => {
          await AsyncStorage.clear();
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
