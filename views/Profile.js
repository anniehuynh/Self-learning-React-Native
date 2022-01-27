import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Card,
  Text,
  Avatar,
  Button,
  Layout,
  Divider,
  ListItem,
  Icon,
} from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
    <Layout style={styles.container}>
      <Card style={styles.card}>
        <Text category="h6" style={styles.username}>
          {user.username}
        </Text>
        <Divider />
        <Avatar
          source={{uri: avatar}}
          size="giant"
          style={styles.avatar}
          resizeMode="cover"
        />
        <Divider />
        <ListItem>
          <MaterialCommunityIcons
            name="email"
            color="#135C71"
            size={20}
            style={{marginRight: 5}}
          />
          <Text style={styles.text}>Email: {user.email}</Text>
        </ListItem>
        <Divider />
        <ListItem>
          <MaterialCommunityIcons
            name="card-account-details"
            color="#135C71"
            size={20}
            style={{marginRight: 5}}
          />
          <Text style={styles.text}>Full name: {user.full_name}</Text>
        </ListItem>
        <Divider />
        <Button
          title="Log out!"
          accessoryLeft={<Icon name="log-out-outline" />}
          onPress={async () => {
            await AsyncStorage.clear();
            setIsLoggedIn(false);
          }}
        >
          Log Out
        </Button>
      </Card>
    </Layout>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 200,
    height: 200,
    margin: 15,
    alignSelf: 'center',
  },
  card: {
    width: '90%',
    height: undefined,
    margin: 20,
    borderWidth: 2,
    shadowOffset: {width: 1, height: 2},
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: 40,
  },
  text: {
    padding: 10,
  },
  username: {
    alignSelf: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
});

export default Profile;
