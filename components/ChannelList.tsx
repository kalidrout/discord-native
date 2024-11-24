import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { UserSettings } from './UserSettings';
import { ChannelHistory } from './ChannelHistory';
import { useDiscord } from '../context/DiscordContext';
import { UserIndicator } from './UserIndicator';
import { Typography } from '../constants/Typography';

interface DirectMessage {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  lastMessage?: string;
  timestamp?: string;
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

  const mockDMs: DirectMessage[] = [
    {
      id: 'dm1',
      username: 'John Doe',
      avatar: 'https://github.com/github.png',
      status: 'online',
      lastMessage: 'Hey, how are you?',
      timestamp: '2:30 PM'
    },
    {
      id: 'dm2',
      username: 'Jane Smith',
      avatar: 'https://github.com/facebook.png',
      status: 'idle',
      lastMessage: 'Check this out!',
      timestamp: 'Yesterday'
    },
    // Add more mock DMs as needed
  ];

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

  const renderDMList = () => {
    if (selectedServer === 0) { // Home/DMs server
      return (
        <View style={styles.dmSection}>
          <View style={styles.dmHeader}>
            <Text style={[styles.dmHeaderText, { color: colors.icon }]}>
              DIRECT MESSAGES
            </Text>
            <Pressable 
              style={styles.addDMButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="add" size={20} color={colors.icon} />
            </Pressable>
          </View>
          
          {mockDMs.map((dm) => (
            <Pressable
              key={dm.id}
              style={[
                styles.dmItem,
                selectedChannel === dm.id && {
                  backgroundColor: colors.messageInput,
                }
              ]}
              onPress={() => handleChannelPress({ 
                id: dm.id, 
                name: dm.username, 
                type: 'text',
                categoryId: 'dms'
              })}
            >
              <View style={styles.dmAvatarContainer}>
                <Image 
                  source={{ uri: dm.avatar }} 
                  style={styles.dmAvatar} 
                />
                <View style={[
                  styles.statusIndicator,
                  { 
                    backgroundColor: getStatusColor(dm.status),
                    borderColor: colors.background 
                  }
                ]} />
              </View>
              <View style={styles.dmContent}>
                <Text 
                  style={[Typography.callout, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {dm.username}
                </Text>
                {dm.lastMessage && (
                  <Text 
                    style={[Typography.footnote, { color: colors.secondaryText }]}
                    numberOfLines={1}
                  >
                    {dm.lastMessage}
                  </Text>
                )}
              </View>
              {dm.timestamp && (
                <Text style={[Typography.caption2, { color: colors.secondaryText }]}>
                  {dm.timestamp}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      );
    }

    // Return regular channel list for servers
    return (
      <>
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
                      name={channel.type === 'voice' ? 'mic-outline' : 'chatbubble-outline'}
                      size={20}
                      color={colors.icon}
                    />
                    <Text
                      style={[
                        styles.channelName,
                        { color: colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {channel.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
      </>
    );
  };

  const getStatusColor = (status: DirectMessage['status']) => {
    switch (status) {
      case 'online': return Colors.discord.green;
      case 'idle': return Colors.discord.yellow;
      case 'dnd': return Colors.discord.red;
      default: return Colors.discord.gray;
    }
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
          <Ionicons name="chevron-down-outline" size={20} color={colors.icon} />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.channelList}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {renderDMList()}
      </ScrollView>

      <UserIndicator onSettingsPress={() => setSettingsVisible(true)} />

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
    backgroundColor: Colors.discord.background,
  },
  header: {
    height: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  serverName: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
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
    height: 32,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.08,
    marginLeft: 8,
  },
  channelGroup: {
    marginTop: 4,
  },
  channel: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  channelName: {
    fontSize: 17,
    letterSpacing: -0.41,
    marginLeft: 12,
    flex: 1,
  },
  dmSection: {
    paddingTop: 16,
  },
  dmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 32,
  },
  dmHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  addDMButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 62,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  dmAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  dmAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  dmContent: {
    flex: 1,
    marginRight: 8,
  },
});
