import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text, Card} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';

const ListItem = ({navigation, singleMedia}) => {
  return (
    <Card>
      <TouchableOpacity style={styles.row}>
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
        <Button
          style={styles.button}
          title="View"
          onPress={() => {
            navigation.navigate('Single', {file: singleMedia});
          }}
        >
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
    flex: 2,
    alignSelf: 'center',
    marginLeft: 10,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default ListItem;
