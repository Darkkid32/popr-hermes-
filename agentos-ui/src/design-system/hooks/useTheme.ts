// useTheme Hook
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useContext } from 'react';
import { ThemeContext } from '../theme/ThemeProvider';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}