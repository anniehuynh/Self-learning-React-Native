import React from 'react';
import {StyleSheet, SafeAreaView, Image} from 'react-native';
import {Text, Card} from '@ui-kitten/components';
import PropTypes from 'prop-types';

import {uploadsUrl} from '../utils/variables';

const Single = ({route}) => {
  const {file} = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Image
          source={{uri: uploadsUrl + file.filename}}
          style={styles.image}
          resizeMode="cover"
        />
        <Text>{file.title}</Text>
        <Text>{file.description}</Text>
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
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
