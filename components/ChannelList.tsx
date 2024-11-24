import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { database } from '../services/database';
import { AddChannelModal } from './AddChannelModal';

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  unread?: boolean;
  icon?: string;
}

interface Category {
  id: string;
  name: string;
  channels: Channel[];
  collapsed?: boolean;
}

interface ChannelListProps {
  serverId: string | null;
  selectedChannelId: string | null;
  onChannelPress: (channelId: string) => void;
  server?: Server;
}

export default function ChannelList({ serverId, selectedChannelId, onChannelPress }: ChannelListProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [server, setServer] = useState<Server | null>(null);
  const isOwner = server?.ownerId === user?.id;

  useEffect(() => {
    if (serverId) {
      loadServerData();
    }
  }, [serverId]);

  async function loadServerData() {
    if (!serverId) return;
    try {
      const [serverData, serverChannels] = await Promise.all([
        database.getServer(serverId),
        database.getChannels(serverId)
      ]);
      setServer(serverData);
      setChannels(serverChannels);
    } catch (error) {
      console.error('Error loading server data:', error);
    }
  }

  async function handleAddChannel(name: string, type: Channel['type']) {
    if (!serverId) return;
    try {
      await database.createChannel(serverId, name, type);
      await loadServerData();
      setShowAddChannel(false);
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  }

  const getChannelIcon = (type: Channel['type']) => {
    switch (type) {
      case 'text':
        return 'text';
      case 'voice':
        return 'volume-medium';
      case 'announcement':
        return 'megaphone';
      default:
        return 'text';
    }
  };

  if (!serverId) return null;

  return (
    <View style={styles.container}>
      {isOwner && (
        <Pressable
          style={[styles.addChannelButton, { backgroundColor: colors.channelItem }]}
          onPress={() => setShowAddChannel(true)}
        >
          <Ionicons name="add" size={24} color={Colors.discord.green} />
          <Text style={[styles.addChannelText, { color: colors.text }]}>Add Channel</Text>
        </Pressable>
      )}

      {channels.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.secondaryText }]}>
            {isOwner 
              ? "This server is empty. Click the button above to add channels!" 
              : "This server doesn't have any channels yet."}
          </Text>
        </View>
      ) : (
        <ScrollView>
          {channels.map(channel => (
            <Pressable
              key={channel.id}
              style={[
                styles.channel,
                selectedChannelId === channel.id && { backgroundColor: colors.channelItem }
              ]}
              onPress={() => onChannelPress(channel.id)}
            >
              <View style={styles.channelInfo}>
                <Ionicons 
                  name={getChannelIcon(channel.type)} 
                  size={16} 
                  color={colors.icon}
                  style={styles.channelIcon}
                />
                <Text style={[styles.channelName, { color: colors.text }]}>
                  {channel.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <AddChannelModal
        visible={showAddChannel}
        onClose={() => setShowAddChannel(false)}
        onSubmit={handleAddChannel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addChannelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  addChannelText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    textAlign: 'center',
  },
  channel: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  channelIcon: {
    opacity: 0.7,
  },
  channelName: {
    fontSize: 17,
    letterSpacing: -0.41,
  },
});
