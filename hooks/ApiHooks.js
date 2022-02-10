import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {appId, apiUrl} from '../utils/variables';

const doFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      const message = json.error
        ? `${json.message}: ${json.error}`
        : json.message;
      throw new Error(message || response.statusText);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const useMedia = (myFilesOnly) => {
  const [mediaArray, setMediaArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const {update, user} = useContext(MainContext);
  const loadMedia = async (start = 0, limit = 10) => {
    try {
      /* Get all media here
      const response = await fetch(
        `${apiUrl}media?start=${start}&limit=${limit}`
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      */
      let json = await useTag().getFilesByTag(appId); // array that holds all media files
      if (myFilesOnly) {
        // filter files by user_id
        json = json.filter((file) => file.user_id === user.user_id);
      }
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
  // OR when the update state (MainContext) is changed
  useEffect(() => {
    loadMedia(0, 20);
  }, [update]);

  const postMedia = async (formData, token) => {
    setLoading(true);
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    };

    const result = await doFetch(apiUrl + 'media', options);
    result && setLoading(false);
    return result;
  };

  const putMedia = async (data, token, fileId) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    return await doFetch(apiUrl + `media/${fileId}`, options);
  };

  const deleteMedia = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    return await doFetch(`${apiUrl}media/${fileId}`, options);
  };

  return {mediaArray, postMedia, putMedia, deleteMedia, loading};
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    // user credentials format: {username: 'someUsername', password: 'somePassword'}
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    return await doFetch(apiUrl + 'login', options);
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

  const getUserById = async (userId, token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    return await doFetch(`${apiUrl}users/${userId}`, options);
  };

  const postUser = async (data) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await doFetch(apiUrl + 'users', options);
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
    return await doFetch(apiUrl + 'users', options);
  };

  const checkUsername = async (username) => {
    const result = await doFetch(apiUrl + 'users/username/' + username);
    return result.available;
  };

  return {getUserByToken, getUserById, postUser, putUser, checkUsername};
};

// Tag
const useTag = () => {
  const postTag = async (tagData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
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

// Favorites: Like a post
// https://media.mw.metropolia.fi/wbma/docs/#api-Favourite-GetFileFavourites
const useFavourite = () => {
  const postFavourite = async (fileId, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({file_id: fileId}),
    };
    return await doFetch(`${apiUrl}favourites`, options);
  };
  const getFavourtiesByFileId = async (fileId) => {
    return await doFetch(`${apiUrl}favourites/file/${fileId}`);
  };

  // Unlike a post
  const deleteFavourite = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    return await doFetch(`${apiUrl}favourites/file/${fileId}`, options);
  };
  return {postFavourite, deleteFavourite, getFavourtiesByFileId};
};
export {useMedia, useLogin, useUser, useTag, useFavourite};
