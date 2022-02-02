import React, {useContext, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  Text,
  Icon,
  Card,
  ButtonGroup,
  Layout,
} from '@ui-kitten/components';

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
    >
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <Layout style={styles.inner}>
          <Text category={'h6'} style={styles.appTitle}>
            My App
          </Text>

          <ButtonGroup
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            selectedIndex={formToggle ? 0 : 1}
          >
            <Button onPress={() => setFormToggle(!formToggle)}>Login</Button>
            <Button onPress={() => setFormToggle(!formToggle)}>Register</Button>
          </ButtonGroup>

          {formToggle ? (
            <Card style={styles.form}>
              <Text category="s1" style={styles.text}>
                Login
              </Text>
              <LoginForm />
              <Button accessoryLeft={<Icon name="facebook" />}>
                Login with Facebook
              </Button>
            </Card>
          ) : (
            <Card style={styles.form}>
              <ScrollView>
                <Text category="s1" style={styles.text}>
                  Sign up
                </Text>
                <RegisterForm setFormToggle={setFormToggle} />
              </ScrollView>
            </Card>
          )}
        </Layout>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  appTitle: {
    marginBottom: 25,
    alignSelf: 'center',
  },
  inner: {
    flex: 1,
    top: 70,
  },
  card: {marginTop: 20},
  form: {
    flex: 1,
    justifyContent: 'flex-start',
    marginBottom: 100,
    marginTop: 40,
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
