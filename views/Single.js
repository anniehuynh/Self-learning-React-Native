import React from 'react';
import {StyleSheet, SafeAreaView, Image} from 'react-native';
import {Text, Card, Divider} from '@ui-kitten/components';
import PropTypes from 'prop-types';

import {uploadsUrl} from '../utils/variables';

const Single = ({route}) => {
  const {file} = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Text category="s1" style={styles.title}>
          {file.title}
        </Text>
        <Divider />
        <Image
          source={{uri: uploadsUrl + file.filename}}
          style={styles.image}
          resizeMode="cover"
        />
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
