import React from 'react';
import {View, KeyboardAvoidingView, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Button, Text, Input} from '@ui-kitten/components';
import {PropTypes} from 'prop-types';

import {useUser} from '../hooks/ApiHooks';

const RegisterForm = ({setFormToggle}) => {
  const {postUser, checkUsername} = useUser();

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      delete data.confirmPassword;
      const userData = await postUser(data);
      console.log('register onSubmit', userData);
      if (userData) {
        Alert.alert('Succes', 'Sign up successfully');
        setFormToggle(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView>
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
          <Text status="danger">{errors.username.message}</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            minLength: {
              value: 5,
              message: 'Password has to be at least 5 characters.',
            },
            /*
          pattern: {
            value: /(?=.*[\p{Lu}])(?=.*[0-9]).{8,}/u,
            message: 'Min 8, Uppercase, Number',
          },
          */
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
              errorMessage={errors.password && errors.password.message}
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text status="danger">{errors.password.message}</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            validate: (value) => {
              const {password} = getValues();
              if (value === password) {
                return true;
              } else {
                return 'Password do not match';
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
              secureTextEntry={true}
              placeholder="Confirm Password"
              errorMessage={
                errors.confirmPassword && errors.confirmPassword.message
              }
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && (
          <Text status="danger">{errors.confirmPassword.message}</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            pattern: {
              value: /\S+@\S+\.\S+$/,
              message: 'Has to be valid email.',
            },
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
        {errors.email && <Text status="danger">{errors.email.message}</Text>}
        <Controller
          control={control}
          rules={{
            minLength: {
              value: 3,
              message: 'Full name has to be at least 3 characters.',
            },
          }}
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
        {errors.full_name && (
          <Text status="danger">{errors.full_name.message}</Text>
        )}

        <Button
          style={{margin: 10, width: 250}}
          title="Submit"
          onPress={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};
RegisterForm.propTypes = {
  setFormToggle: PropTypes.func,
};
export default RegisterForm;
