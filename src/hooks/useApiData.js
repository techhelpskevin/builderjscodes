import { useReducer, useEffect, useState } from 'react';
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
        isLoading: false,
        error: null,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function useApiData(method, endpoint, name, isFile = false) {
  const [state, dispatch] = useReducer(apiDataReducer, initialState);
  const reduxDispatch = useDispatch();
  const [body, setBody] = useState(null);
  const [params, setParams] = useState({});
  const [refreshFlag, setRefreshFlag] = useState(false);

  const baseUrl =
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_APP_baseUrlProd
      : import.meta.env.VITE_APP_baseUrlTest;

  const apiCall = async (body = null, filterParams = {}) => {
    setParams(filterParams);
    setBody(body);
    setRefreshFlag(!refreshFlag);
  };

  const fetchData = async () => {
    dispatch({ type: 'FETCH_INIT' });

    let config = {
      method,
      url: baseUrl + endpoint,
      params,
    };

    if (isFile && body) {
      const formData = new FormData();
      formData.append('file', body);

      config = {
        ...config,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    } else if (body) {
      config = {
        ...config,
        data: body,
      };
    }

    try {
      const response = await axios(config);
      reduxDispatch(setData({ name, data: response.data.data }));
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };

  const refresh = () => {
    setRefreshFlag(!refreshFlag);
  };

  useEffect(() => {
    fetchData();
  }, [method, endpoint, name, body, reduxDispatch, baseUrl, isFile, params, refreshFlag]);

  return { ...state, apiCall, refresh };
}