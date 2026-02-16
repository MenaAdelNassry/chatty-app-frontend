import { useCallback, useReducer } from 'react';
import { ImageUtils } from '@services/utils/image.utils';
import { privacyList } from '@root/constants';

// 1. (Initial State)
const initialState = {
  post: '',
  bgColor: '#ffffff',
  privacy: privacyList[0],
  feelings: '',
  gifUrl: '',
  image: '',
  video: '',
  showColors: false,
  showEmojiPicker: false,
  showGiphy: false,
  validationError: '',
};

// 2. Reducer
const postReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POST_DATA':
      const {
        gifUrl,
        image,
        imgId,
        imgVersion,
        video,
        videoId,
        videoVersion,
        post,
        bgColor,
        privacy,
        feelings,
      } = action.payload;

      return {
        ...state,
        post: post || '',
        bgColor: bgColor || '#ffffff',
        privacy: privacy,
        feelings: feelings || '',
        gifUrl: gifUrl || '',
        image: image || '',
        video: video || '',
        imgId: imgId || '',
        imgVersion: imgVersion || '',
        videoId: videoId || '',
        videoVersion: videoVersion || '',
      };

    case 'POST_TEXT':
      return { ...state, post: action.payload, validationError: '' };

    case 'SET_BG':
      return {
        ...state,
        bgColor: action.payload,
        image: '',
        video: '',
        gifUrl: '',
        showColors: false,
        validationError: '',
      };

    case 'ADD_IMAGE':
      return {
        ...state,
        image: action.payload,
        bgColor: '#ffffff',
        video: '',
        gifUrl: '',
        showColors: false,
        validationError: '',
      };

    case 'ADD_VIDEO':
      return {
        ...state,
        video: action.payload,
        bgColor: '#ffffff',
        image: '',
        gifUrl: '',
        showColors: false,
        validationError: '',
      };

    case 'ADD_GIF':
      return {
        ...state,
        gifUrl: action.payload,
        image: '',
        video: '',
        bgColor: '#ffffff',
        showGiphy: false,
        validationError: '',
      };

    case 'SET_ERROR':
      return { ...state, validationError: action.payload };

    case 'SET_PRIVACY':
      return { ...state, privacy: action.payload };

    case 'SET_FEELING':
      return { ...state, feelings: action.payload };

    case 'TOGGLE_COLORS':
      return { ...state, showColors: action.payload };

    case 'TOGGLE_EMOJI':
      return { ...state, showEmojiPicker: action.payload };

    case 'TOGGLE_GIPHY':
      return { ...state, showGiphy: action.payload };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
};

// 3. Hook
const usePostForm = () => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  // Helper Functions

  const setPostToEdit = useCallback((postData) => {
    dispatch({ type: 'SET_POST_DATA', payload: postData });
  }, []);

  const handlePostTextChange = (e) => {
    const value = e.target.value;

    if (state.bgColor === '#ffffff') {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    }

    dispatch({ type: 'POST_TEXT', payload: value });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validation = ImageUtils.validateFile(file);
    if (!validation.valid) {
      dispatch({ type: 'SET_ERROR', payload: validation.message });
      return;
    }

    const base64 = await ImageUtils.readFileToBase64(file);
    if (validation.type === 'image') {
      dispatch({ type: 'ADD_IMAGE', payload: base64 });
    } else {
      dispatch({ type: 'ADD_VIDEO', payload: base64 });
    }
  };

  const addEmoji = (event) => {
    dispatch({ type: 'POST_TEXT', payload: state.post + event.emoji });
  };

  // UI Methods
  // Simple Dispatch Wrappers
  const setPrivacy = useCallback(
    (privacy) => dispatch({ type: 'SET_PRIVACY', payload: privacy }),
    []
  );
  const setFeeling = useCallback(
    (feeling) => dispatch({ type: 'SET_FEELING', payload: feeling }),
    []
  );
  const setBgColor = useCallback(
    (color) => dispatch({ type: 'SET_BG', payload: color }),
    []
  );
  const setGif = useCallback(
    (url) => dispatch({ type: 'ADD_GIF', payload: url }),
    []
  );
  const toggleGiphy = useCallback(
    (show) => dispatch({ type: 'TOGGLE_GIPHY', payload: show }),
    []
  );
  const toggleEmoji = useCallback(
    () => dispatch({ type: 'TOGGLE_EMOJI', payload: !state.showEmojiPicker }),
    [state.showEmojiPicker]
  );
  const toggleColors = useCallback(
    () => dispatch({ type: 'TOGGLE_COLORS', payload: !state.showColors }),
    [state.showColors]
  );
  const resetForm = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    state,
    handlePostTextChange,
    handleFileChange,
    addEmoji,
    setPrivacy,
    setFeeling,
    setBgColor,
    setGif,
    toggleGiphy,
    toggleEmoji,
    toggleColors,
    resetForm,
    dispatch,
    setPostToEdit
  };
};

export default usePostForm;
