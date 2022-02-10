import React, {useCallback, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

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
import * as ImagePicker from 'expo-image-picker';

import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appId} from '../utils/variables';
import {Video} from 'expo-av';

const Modify = ({navigation}) => {
  const [image, setImage] = useState(
    'https://place-hold.it/300x300&text=Choose'
  );
  const [type, setType] = useState('image');
  const [imageSelected, setImageSelected] = useState(false);
  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
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

  const resetUpload = () => {
    setImage('https://place-hold.it/300x300&text=Choose');
    setImageSelected(false);
    setValue('title', '');
    setValue('description', '');
    setType('image');
  };

  useFocusEffect(
    useCallback(() => {
      return () => resetUpload();
    }, [])
  );

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
      const tagResponse = await postTag(
        {
          file_id: response.file_id,
          tag: appId,
        },
        token
      );
      console.log('tag response', tagResponse);
      tagResponse &&
        Alert.alert('File', 'uploaded', [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Home');
            },
          },
        ]);
    } catch (e) {
      // let the user know the problem
      console.log('onSubmit upload image problem', e.message);
    }
  };
  console.log('type', type);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
    >
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <Card
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}
        >
          <ScrollView>
            {type === 'image' ? (
              <Image
                source={{uri: image}}
                style={styles.image}
                onPress={pickImage}
              ></Image>
            ) : (
              <Video
                source={{uri: image}}
                style={styles.image}
                useNativeControls={true}
                resizeMode="cover"
                onError={(error) => {
                  console.error('video', error);
                }}
              />
            )}

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
            {errors.title && <Text status="danger">This is required.</Text>}

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
            {errors.description && (
              <Text status="danger">This is required.</Text>
            )}

            <Button
              style={styles.button}
              size="medium"
              title="Choose image"
              onPress={pickImage}
            >
              Choose Image
            </Button>
            <Button
              disabled={!imageSelected}
              loading={loading}
              style={styles.button}
              size="medium"
              title="Upload"
              onPress={handleSubmit(onSubmit)}
            >
              Upload
            </Button>
            <Button
              style={styles.button}
              size="medium"
              title="Reset form"
              onPress={resetUpload}
            >
              Reset Form
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
};

export default Modify;
