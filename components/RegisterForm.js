import React from 'react';
import {View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Button, Text, Input} from '@ui-kitten/components';

import {useUser} from '../hooks/ApiHooks';

const RegisterForm = () => {
  const {postUser, checkUsername} = useUser();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const userData = await postUser(data);
      console.log('register onSubmit', userData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required!'},
          minLength: {
            value: 3,
            message: 'Username has to be at least 3 characters',
          },
          validate: async (value) => {
            try {
              const available = await checkUsername(value);
              if (available) {
                return true;
              } else {
                return 'Username is already taken!';
              }
            } catch (error) {
              throw new Error(error.message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={{borderWidth: 1, padding: 8, margin: 8, width: 250}}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Username"
          />
        )}
        name="username"
      />
      {errors.username && (
        <Text status="danger">Username is already taken</Text>
      )}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={{borderWidth: 1, padding: 8, margin: 8, width: 250}}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="Password"
          />
        )}
        name="password"
      />
      {errors.password && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={{borderWidth: 1, padding: 8, margin: 8, width: 250}}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Email"
          />
        )}
        name="email"
      />
      {errors.email && <Text>This is required.</Text>}

      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={{borderWidth: 1, padding: 8, margin: 8, width: 250}}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="words"
            placeholder="Full name"
          />
        )}
        name="full_name"
      />

      <Button
        style={{margin: 10, width: 250}}
        title="Submit"
        onPress={handleSubmit(onSubmit)}
      >
        Submit
      </Button>
    </View>
  );
};

export default RegisterForm;
