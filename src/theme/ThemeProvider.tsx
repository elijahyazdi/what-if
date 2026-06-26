import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, ThemeColors } from './themes';

const STORAGE_KEY = 'darkMode';

type ThemeContextType = {
  isDark: boolean;
  colors: ThemeColors;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: themes.light,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(systemScheme === 'dark');
  const [hasUserPreference, setHasUserPreference] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(val => {
      if (val === 'true') {
        setIsDark(true);
        setHasUserPreference(true);
      } else if (val === 'false') {
        setIsDark(false);
        setHasUserPreference(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!hasUserPreference) {
      setIsDark(systemScheme === 'dark');
    }
  }, [systemScheme, hasUserPreference]);

  const toggleDarkMode = () => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, String(next));
      setHasUserPreference(true);
      return next;
    });
  };

  const colors = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
