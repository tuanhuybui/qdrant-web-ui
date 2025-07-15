import React, { useContext, createContext, useState, useEffect } from 'react';
import { axiosInstance, setupAxios } from '../common/axios';
import qdrantClient from '../common/client';
import { bigIntJSON } from '../common/bigIntJSON';
import { isTokenRestricted } from '../config/restricted-routes';

const DEFAULT_SETTINGS = {
  apiKey: import.meta.env.VITE_QDRANT_API_KEY || '', // ✅ Đọc key từ biến môi trường
};

// Write settings to local storage
const persistSettings = (settings) => {
  localStorage.setItem('settings', bigIntJSON.stringify(settings));
};

// Get existing Settings from Local Storage or set default values
const getPersistedSettings = () => {
  const settings = localStorage.getItem('settings');

  if (settings) return bigIntJSON.parse(settings);

  // ✅ Nếu localStorage chưa có, dùng từ môi trường
  return {
    apiKey: import.meta.env.VITE_QDRANT_API_KEY || '',
  };
};

// React context to store the settings
const ClientContext = createContext();

// React hook to access and modify the settings
export const useClient = () => {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error('useClient must be used within ClientProvider');
  }

  return {
    ...context,
    isRestricted: isTokenRestricted(context.settings.apiKey),
  };
};

// Client Context Provider
export const ClientProvider = (props) => {
  const [settings, setSettings] = useState(getPersistedSettings());

  const client = qdrantClient(settings);

  setupAxios(axiosInstance, settings);

  useEffect(() => {
    setupAxios(axiosInstance, settings);
    persistSettings(settings);
  }, [settings]);

  return <ClientContext.Provider value={{ client, settings, setSettings }} {...props} />;
};
