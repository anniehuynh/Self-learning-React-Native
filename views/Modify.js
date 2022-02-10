import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Input, Text} from '@ui-kitten/components';

import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Video} from 'expo-av';

const Modify = ({navigation, route}) => {
  const {file} = route.params;
  const {putMedia, loading} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: file.title,
      description: file.description,
    },
  });

  const onSubmit = async (data) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await putMedia(data, token, file.file_id);
      console.log('modify post response', response);

      response &&
        Alert.alert('File', 'edited', [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('My Files');
            },
          },
        ]);
    } catch (e) {
      // let the user know the problem
      console.log('onSubmit edit post problem', e.message);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
    >
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <Card
          style={{
            flex: 1,
            width: 340,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ScrollView>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label="Title"
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  placeholder="Title"
                />
              )}
              name="title"
            />
            {errors.title && <Text status="danger">This is required.</Text>}

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label="Description"
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  placeholder="Description"
                />
              )}
              name="description"
            />
            {errors.description && (
              <Text status="danger">This is required.</Text>
            )}

            <Button
              loading={loading}
              style={styles.button}
              size="medium"
              title="Save"
              onPress={handleSubmit(onSubmit)}
            >
              Save Changes
            </Button>
          </ScrollView>
        </Card>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    marginTop: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 15,
  },
  input: {
    margin: 10,
  },
});

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;
