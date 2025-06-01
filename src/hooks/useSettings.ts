
import { useState, useEffect } from 'react';

export interface GameSettings {
  darkMode: boolean;
  numberAbbreviation: boolean;
}

const defaultSettings: GameSettings = {
  darkMode: false,
  numberAbbreviation: true
};

export const useSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    
    // Apply dark mode to document with immediate effect (no transitions)
    const root = document.documentElement;
    
    // Temporarily disable transitions
    root.style.setProperty('--transition-duration', '0s');
    
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Re-enable transitions after a short delay
    setTimeout(() => {
      root.style.removeProperty('--transition-duration');
    }, 50);
  }, [settings]);

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    updateSetting
  };
};
