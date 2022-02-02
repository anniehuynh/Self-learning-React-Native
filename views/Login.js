import React, {useContext, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, Icon, Card, ButtonGroup} from '@ui-kitten/components';

import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = ({navigation}) => {
  const [formToggle, setFormToggle] = useState(true);
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {getUserByToken} = useUser();

  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      return;
    }
    try {
      const userData = await getUserByToken(userToken);
      console.log('checkToken', userData);
      console.log('token', userToken);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={{flex: 1}}
      activeOpacity={1}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
      >
        <View>
          <Text category={'h6'} style={styles.appTitle}>
            My App
          </Text>
        </View>
        <View style={styles.form}>
          <Card>
            <ButtonGroup
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              selectedIndex={formToggle ? 0 : 1}
            >
              <Button onPress={() => setFormToggle(!formToggle)}>Login</Button>
              <Button onPress={() => setFormToggle(!formToggle)} r>
                Register
              </Button>
            </ButtonGroup>
          </Card>
          {formToggle ? (
            <Card style={styles.card}>
              <Text category="s1" style={styles.text}>
                Login
              </Text>
              <LoginForm />
              <Button accessoryLeft={<Icon name="facebook" />}>
                Login with Facebook
              </Button>
            </Card>
          ) : (
            <Card style={styles.card}>
              <Text category="s1" style={styles.text}>
                Sign up
              </Text>
              <RegisterForm setFormToggle={setFormToggle} />
            </Card>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  appTitle: {
    marginTop: 70,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {marginTop: 20},
  form: {
    flex: 8,
  },
  text: {
    fontWeight: '500',
    fontSize: 18,
    marginVertical: 10,
    alignSelf: 'center',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
