import React, { createContext, useContext, useState } from 'react';

interface Server {
  id: number;
  name: string;
  imageUrl?: string;
  isHome?: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  channels: Channel[];
}

interface DiscordContextType {
  servers: Server[];
  selectedServer: number;
  setSelectedServer: (id: number) => void;
  categories: Record<number, Category[]>;
  selectedChannel: string;
  setSelectedChannel: (id: string) => void;
  currentServerName: string;
}

const defaultServers: Server[] = [
  { id: 0, name: 'Home', isHome: true },
  { id: 1, name: 'Codeium', imageUrl: 'https://github.com/codeium.png' },
  { id: 2, name: 'Expo', imageUrl: 'https://github.com/expo.png' },
  { id: 3, name: 'React', imageUrl: 'https://github.com/facebook.png' },
];

const defaultCategories: Record<number, Category[]> = {
  0: [], // Home has no categories
  1: [ // Codeium server
    {
      id: 'info',
      name: 'Information',
      channels: [
        { id: 'announcements', name: 'announcements', type: 'announcement', categoryId: 'info' },
        { id: 'rules', name: 'rules', type: 'text', categoryId: 'info' },
      ],
    },
    {
      id: 'text',
      name: 'Text Channels',
      channels: [
        { id: 'general', name: 'general', type: 'text', categoryId: 'text' },
        { id: 'off-topic', name: 'off-topic', type: 'text', categoryId: 'text' },
      ],
    },
    {
      id: 'voice',
      name: 'Voice Channels',
      channels: [
        { id: 'general-voice', name: 'General Voice', type: 'voice', categoryId: 'voice' },
        { id: 'gaming', name: 'Gaming', type: 'voice', categoryId: 'voice' },
      ],
    },
  ],
  2: [ // Expo server
    {
      id: 'info',
      name: 'Information',
      channels: [
        { id: 'expo-announcements', name: 'announcements', type: 'announcement', categoryId: 'info' },
      ],
    },
    {
      id: 'text',
      name: 'Text Channels',
      channels: [
        { id: 'expo-general', name: 'general', type: 'text', categoryId: 'text' },
        { id: 'help', name: 'help', type: 'text', categoryId: 'text' },
      ],
    },
  ],
  3: [ // React server
    {
      id: 'info',
      name: 'Information',
      channels: [
        { id: 'react-announcements', name: 'announcements', type: 'announcement', categoryId: 'info' },
      ],
    },
    {
      id: 'text',
      name: 'Text Channels',
      channels: [
        { id: 'react-general', name: 'general', type: 'text', categoryId: 'text' },
        { id: 'react-help', name: 'help', type: 'text', categoryId: 'text' },
      ],
    },
  ],
};

export const DiscordContext = createContext<DiscordContextType | undefined>(undefined);

export function DiscordProvider({ children }: { children: React.ReactNode }) {
  const [selectedServer, setSelectedServer] = useState<number>(1); // Start with Codeium server
  const [selectedChannel, setSelectedChannel] = useState<string>('general');

  const value = {
    servers: defaultServers,
    selectedServer,
    setSelectedServer,
    categories: defaultCategories,
    selectedChannel,
    setSelectedChannel,
    currentServerName: defaultServers.find(s => s.id === selectedServer)?.name || '',
  };

  return (
    <DiscordContext.Provider value={value}>
      {children}
    </DiscordContext.Provider>
  );
}

export function useDiscord() {
  const context = useContext(DiscordContext);
  if (context === undefined) {
    throw new Error('useDiscord must be used within a DiscordProvider');
  }
  return context;
}
