import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { UserSettings } from './UserSettings';
import { ChannelHistory } from './ChannelHistory';
import { useDiscord } from '../context/DiscordContext';

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

export default function ChannelList() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'info': true,
    'text': true,
    'voice': true,
  });
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [showChannelHistory, setShowChannelHistory] = useState(false);
  
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const { 
    selectedServer,
    categories,
    selectedChannel,
    setSelectedChannel,
    currentServerName
  } = useDiscord();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleChannelPress = (channel: Channel) => {
    if (channel.type === 'voice') {
      // Handle voice channel click differently
      return;
    }
    setSelectedChannel(channel.id);
    setShowChannelHistory(true);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Pressable
          style={styles.serverHeader}
          onPress={() => setShowServerMenu(true)}
        >
          <Text style={[styles.serverName, { color: colors.text }]}>
            {currentServerName}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.icon} />
        </Pressable>
      </View>

      <ScrollView style={styles.channelList}>
        {categories[selectedServer]?.map((category) => (
          <View key={category.id} style={styles.category}>
            <Pressable
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.id)}
            >
              <Ionicons
                name={expandedCategories[category.id] ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color={colors.icon}
              />
              <Text style={[styles.categoryName, { color: colors.icon }]}>
                {category.name.toUpperCase()}
              </Text>
            </Pressable>
            {expandedCategories[category.id] && (
              <View style={styles.channelGroup}>
                {category.channels.map((channel) => (
                  <Pressable
                    key={channel.id}
                    style={[
                      styles.channel,
                      selectedChannel === channel.id && {
                        backgroundColor: colors.messageInput,
                      },
                    ]}
                    onPress={() => handleChannelPress(channel)}
                  >
                    <Ionicons
                      name={channel.type === 'voice' ? 'volume-medium' : 'hash'}
                      size={20}
                      color={colors.icon}
                    />
                    <Text
                      style={[
                        styles.channelName,
                        { color: colors.text },
                      ]}
                    >
                      {channel.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://github.com/identicons/jasonlong.png' }}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.username, { color: colors.text }]}>Username</Text>
            <Text style={[styles.discriminator, { color: colors.icon }]}>#1234</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="mic" size={20} color={colors.icon} />
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Ionicons name="headset" size={20} color={colors.icon} />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons name="settings" size={20} color={colors.icon} />
          </Pressable>
        </View>
      </View>

      <UserSettings
        visible={isSettingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      <ChannelHistory
        visible={showChannelHistory}
        onClose={() => {
          setShowChannelHistory(false);
          setSelectedChannel('');
        }}
        channel={categories[selectedServer]?.find(cat => 
          cat.channels.find(ch => ch.id === selectedChannel)
        )?.channels.find(ch => ch.id === selectedChannel) || null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 48,
    borderBottomWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serverName: {
    fontSize: 16,
    fontWeight: '600',
  },
  channelList: {
    flex: 1,
  },
  category: {
    marginTop: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  channelGroup: {
    marginTop: 2,
  },
  channel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 4,
  },
  channelName: {
    fontSize: 16,
    marginLeft: 8,
  },
  bottomBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.discord.divider,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  discriminator: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
});
