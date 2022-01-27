import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, Avatar, Button} from '@ui-kitten/components';

import {MainContext} from '../contexts/MainContext';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

const Profile = () => {
  const {setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {getFilesByTag} = useTag();

  console.log('Profile', user); // to be removed

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + user.user_id);
      const avatar = avatarList.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (e) {
      console.error(e.message);
    }
  };
  useEffect(() => {
    fetchAvatar();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
      <Text>{user.username}</Text>
      <Avatar source={{uri: avatar}} size="giant" resizeMode="cover" />
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
