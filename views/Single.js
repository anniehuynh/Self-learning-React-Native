import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, SafeAreaView, Image, ActivityIndicator} from 'react-native';
import {Text, Card, Divider, Avatar} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {Video} from 'expo-av';

import {uploadsUrl} from '../utils/variables';
import {ListItem} from 'react-native-elements/dist/list/ListItem';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Single = ({route}) => {
  const {file} = route.params;
  const videoRef = useRef(null);
  const {getUserById} = useUser();
  const [user, setUser] = useState({username: 'Loading User...'});

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getUserById(file.user_id, token);
      setUser(userData);
    } catch (e) {
      console.error('fetch owner error', e);
      setUser({username: '[not available]'});
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Text category="h6" style={styles.title}>
          {file.title}
        </Text>
        <Text category="s1" style={styles.title}>
          {file.time_added}
        </Text>
        <Divider />
        {file.media_type === 'image' ? (
          <Image
            source={{uri: uploadsUrl + file.filename}}
            style={styles.image}
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator />}
          />
        ) : (
          <Video
            ref={videoRef}
            style={styles.video}
            source={{uri: uploadsUrl + file.filename}}
            posterSource={{uri: uploadsUrl + file.screenshot}}
            useNativeControls={true}
            isLooping
            resizeMode="contain"
            onError={(error) => {
              console.error('video error', error);
            }}
          ></Video>
        )}
        <Divider />
        <Text>{file.description}</Text>
        <ListItem>
          <Avatar source={{uri: 'http://placekitten.com/180'}} />
          <Text>{user.username}</Text>
        </ListItem>
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  card: {
    width: '95%',
    height: '90%',
    marginTop: 10,
  },
  image: {
    width: 370,
    height: 450,
    alignSelf: 'center',
    margin: 20,
  },
  video: {
    width: 370,
    height: 350,
    alignSelf: 'center',
    margin: 20,
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    marginVertical: 10,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
