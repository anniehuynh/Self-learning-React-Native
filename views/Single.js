import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Text, Card, Divider, Avatar, Button, Icon} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {Video} from 'expo-av';

import {uploadsUrl} from '../utils/variables';
import {ListItem} from 'react-native-elements/dist/list/ListItem';
import {useFavourite, useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const Single = ({route}) => {
  const {file} = route.params;
  const videoRef = useRef(null);
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const {postFavourite, getFavourtiesByFileId, deleteFavourite} =
    useFavourite();
  const [username, setUsername] = useState({username: 'Loading User...'});
  const [avatar, setAvatar] = useState('http://placekitten.com/180');
  const [likes, setLikes] = useState([]);
  const [userLike, setUserLike] = useState(false);
  const {user} = useContext(MainContext);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await getUserById(file.user_id, token);
      setUsername(userData);
    } catch (e) {
      console.error('fetch owner error', e);
      setUsername({username: '[not available]'});
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + file.user_id);
      if (avatarList.length === 0) {
        return;
      }
      const avatar = avatarList.pop();
      setAvatar(uploadsUrl + avatar.filename);
      console.log('single.js avatar', avatar);
    } catch (e) {
      console.error(e.message);
    }
  };

  // add to favourite
  const fetchLikes = async () => {
    try {
      const likesData = await getFavourtiesByFileId(file.file_id);
      setLikes(likesData);
      likesData.forEach((like) => {
        like.user_id === user.user_id && setUserLike(true);
      });
    } catch (e) {
      // TODO: Notify user
      console.error('fetch like error', e);
    }
  };

  const addLike = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postFavourite(file.file_id, token);
      response && setUserLike(true);
    } catch (e) {
      console.error('Add Like error', e);
    }
  };
  const unlike = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await deleteFavourite(file.file_id, token);
      response && setUserLike(false);
    } catch (e) {
      console.error('Remove Like error', e);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAvatar();
  }, []);

  useEffect(() => {
    fetchLikes();
  }, [userLike]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
          <Text>{file.description}</Text>

          <Divider />
          <ListItem>
            <Avatar source={{uri: avatar}} />
            <Text>{username.username}</Text>
          </ListItem>

          <ListItem>
            <Button
              style={styles.button}
              disabled={userLike}
              appearance="ghost"
              onPress={() => {
                addLike();
              }}
              accessoryLeft={<Icon name="heart" />}
            >
              Like
            </Button>
            <Button
              style={styles.button}
              disabled={!userLike}
              appearance="ghost"
              onPress={() => {
                unlike();
              }}
              accessoryLeft={<Icon name="heart-outline" />}
            >
              Unlike
            </Button>
          </ListItem>
          <ListItem>
            <Text>Likes count: {likes.length}</Text>
          </ListItem>
        </Card>
      </ScrollView>
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
    height: '95%',
    marginTop: 10,
  },
  image: {
    width: 370,
    height: 300,
    alignSelf: 'center',
    margin: 20,
  },
  video: {
    width: 370,
    height: 300,
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
