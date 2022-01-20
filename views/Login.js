import React, {useContext, useEffect} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginForm from '../components/LoginForm';
import {MainContext} from '../contexts/MainContext';
import {useLogin, useUser} from '../hooks/ApiHooks';

const Login = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);
  const {postLogin} = useLogin();
  const {getUserByToken} = useUser();

  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken'); // read userTOken from AsyncStorage
    if (!userToken) {
      return;
    }
    try {
      const userData = await getUserByToken(userToken);
      console.log('checktoken and userData', userData);
      if (userToken === 'abcdef') {
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const logIn = async () => {
    const data = {username: 'anhuynh', password: 'postmanpassword'};
    try {
      const userData = await postLogin(data);
      if (userData) {
        await AsyncStorage.setItem('userToken', userData.token);
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <LoginForm />
      <Button title="Sign in!" onPress={logIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
