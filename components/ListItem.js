import React from 'react';
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, ButtonGroup, Icon, Text, Card} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';

const ListItem = ({navigation, singleMedia, myFilesOnly}) => {
  return (
    <Card>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          navigation.navigate('Single', {file: singleMedia});
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
              onPress={(index) => {
                if (index === 0) {
                  Alert.alert('Modified');
                } else {
                  Alert.alert('Delete');
                }
              }}
            />
            <Button
              accessoryLeft={<Icon name="trash-2-outline" />}
              onPress={(index) => {
                if (index === 0) {
                  Alert.alert('Modified');
                } else {
                  Alert.alert('Delete');
                }
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
