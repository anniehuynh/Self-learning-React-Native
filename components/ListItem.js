import React, {useContext} from 'react';
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, ButtonGroup, Icon, Text, Card} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import from files
import {uploadsUrl} from '../utils/variables';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const ListItem = ({navigation, singleMedia, myFilesOnly}) => {
  const {deleteMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const doDelete = () => {
    Alert.alert('Delete Post', 'Confirm delete action?', [
      {text: 'Cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await deleteMedia(singleMedia.file_id, token);
            // update the list after deletion
            response && setUpdate(update + 1);
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };
  return (
    <Card>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          myFilesOnly
            ? navigation.navigate('Single', {file: singleMedia})
            : null;
        }}
      >
        <View style={styles.imagebox}>
          <Image
            style={styles.image}
            source={{uri: uploadsUrl + singleMedia.thumbnails?.w160}}
          />
        </View>
        <View style={styles.textbox}>
          <Text style={styles.title}>{singleMedia.title}</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.description}
          >
            {singleMedia.description}
          </Text>
        </View>
        {!myFilesOnly ? (
          <Button
            style={styles.button}
            title="View"
            onPress={() => {
              navigation.navigate('Single', {file: singleMedia});
            }}
          >
            View
          </Button>
        ) : null}
        {myFilesOnly && (
          <ButtonGroup style={styles.buttonGroup}>
            <Button
              accessoryLeft={<Icon name="edit-outline" />}
              onPress={() => {
                navigation.navigate('Modify', {file: singleMedia});
              }}
            />
            <Button
              accessoryLeft={<Icon name="trash-2-outline" />}
              onPress={() => {
                doDelete();
              }}
            />
          </ButtonGroup>
        )}
      </TouchableOpacity>
    </Card>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  button: {
    flex: 1,
    margin: 5,
    right: -30,
    width: 40,
    height: 50,
    alignSelf: 'center',
  },
  buttonGroup: {
    flex: 2.5,
    right: -20,
    alignSelf: 'flex-end',
  },
  imagebox: {
    flex: 1,
    alignSelf: 'center',
  },
  image: {
    flex: 1,
    marginStart: -25,
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
  },
  textbox: {
    flex: 3,
    alignSelf: 'center',
    marginLeft: 35,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  myFilesOnly: PropTypes.bool,
};

export default ListItem;
