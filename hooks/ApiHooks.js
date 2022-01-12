import {useEffect, useState} from 'react';
import {apiUrl} from '../utils/variables';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
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
      console.log(mediaArray);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect to call loadMedia() once instead of looping it when the List component is loaded
  useEffect(() => {
    loadMedia(0, 5);
  }, []);
  return {mediaArray};
};
export {useMedia};
