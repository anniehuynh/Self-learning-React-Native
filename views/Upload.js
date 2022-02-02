import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ScrollView, StyleSheet, Image, Alert} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Input, Text} from '@ui-kitten/components';
import * as ImagePicker from 'expo-image-picker';

import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Upload = ({navigation}) => {
  const [image, setImage] = useState(
    'https://place-hold.it/300x300&text=Choose'
  );
  const [type, setType] = useState('');
  const [imageSelected, setImageSelected] = useState(false);
  const {postMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setImageSelected(true);
      setType(result.type);
    }
  };

  const onSubmit = async (data) => {
    if (!imageSelected) {
      Alert.alert('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    const filename = image.split('/').pop();
    let fileExtension = filename.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
    formData.append('file', {
      uri: image,
      name: filename,
      type: type + '/' + fileExtension,
    });
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postMedia(formData, token);
      console.log('upload response', response);
      Alert.alert('File', 'Uploaded', [
        {
          text: 'OK',
          onPress: () => {
            // TODO: clear form value after submission
            setUpdate(update + 1);
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (e) {
      // let the user know the problem
      console.log('onSubmit upload image problem');
    }
  };

  return (
    <ScrollView>
      <Card>
        <Image
          source={{uri: image}}
          style={styles.image}
          onPress={pickImage}
        ></Image>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
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
        {errors.title && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
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
        {errors.description && <Text>This is required.</Text>}

        <Button
          style={styles.button}
          size="medium"
          title="Choose image"
          onPress={pickImage}
        >
          Choose Image
        </Button>
        <Button
          style={styles.button}
          size="medium"
          title="Upload"
          onPress={handleSubmit(onSubmit)}
        >
          Upload
        </Button>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    marginTop: 15,
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

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
