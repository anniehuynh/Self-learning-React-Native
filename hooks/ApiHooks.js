import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';

import {apiUrl} from '../utils/variables';

const doFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      const message = json.error
        ? `${json.message} + ': ' + ${json.error} `
        : `${json.message}`;

      throw new Error(message || response.statusText);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update} = useContext(MainContext);
  const loadMedia = async (start = 0, limit = 10) => {
    try {
      const response = await fetch(
        `${apiUrl}media?start=${start}&limit=${limit}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(apiUrl + 'media/' + item.file_id);
          const mediaData = await response.json();
          return mediaData;
        })
      );
      setMediaArray(media);
      // console.log(mediaArray);
    } catch (error) {
      console.error(error);
    }
  };
  // Call loadMedia() only once when the component is loaded
  // Or when the update state(MainContext) is changed
  useEffect(() => {
    loadMedia(0, 10);
  }, [update]);

  const postMedia = async (formData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    };
    return await doFetch(apiUrl + 'media', options);
  };
  return {mediaArray, postMedia};
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };

    return doFetch(apiUrl + 'login', options);
  };
  return {postLogin};
};

const useUser = () => {
  const getUserByToken = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    return await doFetch(apiUrl + 'users/user', options);
  };

  const postUser = async (data) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return doFetch(apiUrl + 'users', options);
  };
  const putUser = async (data, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    return doFetch(apiUrl + 'users/', options);
  };

  const checkUsername = async (username) => {
    const result = await doFetch(apiUrl + 'users/username/' + username);
    return result.available;
  };

  return {getUserByToken, postUser, putUser, checkUsername};
};

const useTag = () => {
  const postTag = async (tagData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tagData),
    };
    return await doFetch(apiUrl + 'tags/', options);
  };

  const getFilesByTag = async (tag) => {
    return await doFetch(apiUrl + 'tags/' + tag);
  };

  return {postTag, getFilesByTag};
};
export {useMedia, useLogin, useUser, useTag};
