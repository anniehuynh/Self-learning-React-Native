import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {ScrollView, StyleSheet, Image, Alert} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Input, Text} from '@ui-kitten/components';
import * as ImagePicker from 'expo-image-picker';

const Upload = ({navigation}) => {
  const [image, setImage] = useState(
    'https://place-hold.it/300x300&text=Choose'
  );
  const [imageSelected, setImageSelected] = useState(false);

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

    formData.append('file', {
      uri: image,
      name: 'image.jpg',
      type: 'image/jpg',
    });
    console.log(formData);
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
