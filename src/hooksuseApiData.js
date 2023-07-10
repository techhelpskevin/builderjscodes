import { useReducer, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setData } from '../redux/apiData/apiDataSlice';

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

function apiDataReducer(state, action) {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        data: action.payload,
        isLoading: true,
        error: null,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: true,
        error: action.payload,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function useApiData(method, endpoint, name, body = null, isFile = false) {
  const [state, dispatch] = useReducer(apiDataReducer, initialState);
  const reduxDispatch = useDispatch();

  const baseUrl =
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_APP_baseUrlProd
      : import.meta.env.VITE_APP_baseUrlTest;

  useEffect(() => {
    let config = {
      method,
      url: baseUrl + endpoint,
    };

    if (isFile) {
      const formData = new FormData();
      formData.append('file', body);

      config = {
        ...config,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    } else {
      config = {
        ...config,
        data: body,
      };
    }

    axios(config)
      .then((response) => {
        reduxDispatch(setData({ name, data: response.data.data }));
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data.data });
      })
      .catch((error) => {
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      });
  }, [method, endpoint, name, body, reduxDispatch, baseUrl, isFile]);

  return state;
}