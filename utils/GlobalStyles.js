import {StyleSheet, Platform, StatusBar} from 'react-native';

export default StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    height: '100%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  Header: {
    height: 300,
    backgroundColor: '#e1edf7',
  },
  Text: {
    backgroundColor: 'sandybrown',
    padding: 10,
    color: 'white',
    bottom: 40,
    fontSize: 18,
    position: 'absolute',
  },
  BackgroundImage: {
    width: '100%',
    height: 300,
  },
  Menu: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  Settings: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
});
