import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text, Card} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';

const ListItem = ({navigation, singleMedia}) => {
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

        <Text style={styles.title}>{singleMedia.title}</Text>

        <Button style={styles.button} title="View">
          View
        </Button>
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
  imagebox: {
    flex: 1,
    alignSelf: 'center',
  },
  image: {
    flex: 1,
    marginStart: -30,
    width: 100,
    height: 100,
  },
  title: {
    flex: 2,
    alignSelf: 'center',
    margin: 30,
    fontWeight: '500',
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default ListItem;
