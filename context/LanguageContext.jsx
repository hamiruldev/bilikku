'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    // Load saved language preference
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
    loadMessages(savedLocale);
  }, []);

  const loadMessages = async (selectedLocale) => {
    try {
      const messages = await import(`../messages/${selectedLocale}.json`);
      setMessages(messages.default);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Fallback to English if translation file not found
      const defaultMessages = await import('../messages/en.json');
      setMessages(defaultMessages.default);
    }
  };

  const changeLanguage = async (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    await loadMessages(newLocale);
  };

  const t = (key) => {
    if (!messages) return key;

    // Split the key by dots and traverse the messages object
    const keys = key.split('.');
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
      if (!value) return key;
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 