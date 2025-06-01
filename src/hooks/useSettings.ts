
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
    
    // Apply dark mode to document immediately and persistently
    const root = document.documentElement;
    
    // Force remove any existing dark class first
    root.classList.remove('dark');
    
    // Add dark class if enabled
    if (settings.darkMode) {
      root.classList.add('dark');
    }
    
    // Force a style recalculation to ensure the change takes effect
    root.offsetHeight;
    
    console.log('Settings updated:', settings);
    console.log('Dark mode applied:', settings.darkMode);
    console.log('Document has dark class:', root.classList.contains('dark'));
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
