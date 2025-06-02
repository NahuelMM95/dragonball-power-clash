
import { useState, useEffect } from 'react';

export interface GameSettings {
  numberAbbreviation: boolean;
}

const defaultSettings: GameSettings = {
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
    console.log('Settings updated:', settings);
  }, [settings]);

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    console.log(`Updating setting ${key} to:`, value);
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    updateSetting
  };
};
