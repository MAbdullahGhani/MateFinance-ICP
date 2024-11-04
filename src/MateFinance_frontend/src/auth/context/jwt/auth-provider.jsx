import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';
import { paths } from 'src/routes/paths';
import axios from 'axios';
import { CRED_HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken) {
        setSession(accessToken);
        const smartContractConfig = await axios.get(CRED_HOST_API + '/admin/getchainVariables');

        const { haqqChainVariable, arbitrumChainVarible } = smartContractConfig?.data;

        const user = jwtDecode(accessToken);

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              accessToken,
              arbitrum: arbitrumChainVarible,
              haqq: haqqChainVariable,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password, router) => {
    const data = {
      email,
      password,
    };

    const response = await axiosInstance.post(endpoints.auth.login, data);
    const smartContractConfig = await axios.get(CRED_HOST_API + '/admin/getchainVariables');

    const { haqqChainVariable, arbitrumChainVarible } = smartContractConfig?.data;

    const { token } = response;

    setSession(token);
    let userData = jwtDecode(token);

    router.push(paths.dashboard.welcomeDashboard);

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...userData,
          accessToken: token,
          arbitrum: arbitrumChainVarible,
          haqq: haqqChainVariable,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (payload) => {
    const data = {
      email: payload?.email,
      firstName: payload?.firstName,
      lastName: payload?.lastName,
      password: payload?.password,
      country: payload?.country,
      mobileNumber: payload?.phoneNumber,
      geoLocation: payload?.geoLocation,
    };

    const response = await axiosInstance.post(endpoints.auth.register, data);

    // const { accessToken, user } = response.data;

    // sessionStorage.setItem(STORAGE_KEY, accessToken);

    // dispatch({
    //   type: 'REGISTER',
    //   payload: {
    //     user: {
    //       ...user,
    //       accessToken,
    //     },
    //   },
    // });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
