import React from 'react';
import {Layout, Text, Card} from '@ui-kitten/components';
import {ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import List from '../components/List';

const MyFiles = ({navigation}) => {
  return (
    <List navigation={navigation} myFilesOnly="true" />
    // <Layout>
    //   <Text>MyFiles</Text>
    //   <Card>
    //     <ScrollView>

    //     </ScrollView>
    //   </Card>
    // </Layout>
  );
};

MyFiles.propTypes = {
  navigation: PropTypes.object,
};
export default MyFiles;
