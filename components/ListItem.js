import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';

const ListItem = (props) => {
  return (
    <TouchableOpacity style={styles.row}>
      <View style={styles.imagebox}>
        <Image
          source={{uri: props.singleMedia.thumbnails.w160}}
          style={styles.image}
        />
      </View>
      <View style={styles.textbox}>
        <Text style={styles.listTitle}>{props.singleMedia.title}</Text>
        <Text style={styles.description}>{props.singleMedia.description}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 15,
    height: 150,
    top: 20,
    backgroundColor: 'wheat',
    borderRadius: 6,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  imagebox: {
    flex: 5,
    height: 100,
    alignSelf: 'center',
  },
  image: {
    flex: 2,
    borderRadius: 6,
  },
  textbox: {
    flex: 6,
    padding: 2,
    left: 10,
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    top: 0,
    paddingBottom: 5,
    color: 'chocolate',
  },
  description: {
    fontSize: 14,
    color: 'sienna',
    bottom: 10,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
};

export default ListItem;
