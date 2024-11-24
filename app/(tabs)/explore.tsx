import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { Typography } from '../../constants/Typography';
import { CommonStyles } from '../../constants/CommonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VoiceCall } from '../../components/VoiceCall';
import { UserProfile } from '../../components/UserProfile';
import { ChatInterface } from '../../components/ChatInterface';
import { BlurView } from 'expo-blur';
import ChannelList from '../../components/ChannelList';

type FriendStatus = 'online' | 'idle' | 'dnd' | 'offline';
type TabType = 'online' | 'all' | 'pending' | 'blocked';

interface FriendItemProps {
  name: string;
  status: FriendStatus;
  avatar: string;
  onPress?: () => void;
  onCallPress?: () => void;
  onProfilePress?: () => void;
}

const FriendItem: React.FC<FriendItemProps> = ({
  name,
  status,
  avatar,
  onPress,
  onCallPress,
  onProfilePress,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getStatusColor = (status: FriendStatus) => {
    switch (status) {
      case 'online': return Colors.discord.green;
      case 'idle': return Colors.discord.yellow;
      case 'dnd': return Colors.discord.red;
      default: return Colors.discord.gray;
    }
  };

  return (
    <Pressable
      style={[styles.friendItem, { backgroundColor: colors.messageInput }]}
      onPress={onPress}
    >
      <Pressable 
        style={styles.avatarContainer} 
        onPress={onProfilePress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={[styles.status, { 
          backgroundColor: getStatusColor(status),
          borderColor: colors.background 
        }]} />
      </Pressable>
      <View style={styles.friendInfo}>
        <Text style={[styles.name, Typography.headline, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.statusText, Typography.footnote, { color: colors.secondaryText }]}>
          {status}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[CommonStyles.button, styles.actionButton]}
          onPress={onCallPress}
        >
          <Ionicons name="call-outline" size={22} color={colors.icon} />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default function ExploreScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [showCall, setShowCall] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>('online');
  const [showChat, setShowChat] = useState(false);
  const [chatUser, setChatUser] = useState<any>(null);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'online', label: 'Online' },
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'blocked', label: 'Blocked' },
  ];

  const mockFriends = [
    { id: 1, name: 'Friend 1', status: 'online' as FriendStatus, avatar: 'https://github.com/identicons/jasonlong.png' },
    { id: 2, name: 'Friend 2', status: 'idle' as FriendStatus, avatar: 'https://github.com/identicons/octocat.png' },
    { id: 3, name: 'Friend 3', status: 'dnd' as FriendStatus, avatar: 'https://github.com/identicons/github.png' },
    { id: 4, name: 'Friend 4', status: 'offline' as FriendStatus, avatar: 'https://github.com/identicons/cascade.png' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.title, Typography.title2, { color: colors.text }]}>Friends</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tabs}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              style={[
                styles.tab,
                selectedTab === tab.id && {
                  backgroundColor: Colors.discord.blurple,
                },
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  Typography.callout,
                  { color: selectedTab === tab.id ? '#fff' : colors.text },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.friendsList}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {mockFriends.map((friend) => (
          <FriendItem
            key={friend.id}
            name={friend.name}
            status={friend.status}
            avatar={friend.avatar}
            onCallPress={() => {
              setShowCall(true);
              setSelectedUser(friend);
            }}
            onProfilePress={() => {
              setShowUserProfile(true);
              setSelectedUser(friend);
            }}
            onPress={() => {
              setShowChat(true);
              setChatUser(friend);
            }}
          />
        ))}
      </ScrollView>

      <VoiceCall
        visible={showCall}
        onClose={() => {
          setShowCall(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <UserProfile
        visible={showUserProfile}
        onClose={() => {
          setShowUserProfile(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onMessage={(user) => {
          setShowUserProfile(false);
          setSelectedUser(null);
          setShowChat(true);
          setChatUser(user);
        }}
        onCall={() => {
          setShowUserProfile(false);
          setSelectedUser(null);
          setShowCall(true);
        }}
      />

      <ChatInterface
        visible={showChat}
        onClose={() => {
          setShowChat(false);
          setChatUser(null);
        }}
        user={chatUser}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    marginBottom: 16,
  },
  tabs: {
    flexGrow: 0,
    height: 44,
  },
  tabsContent: {
    paddingRight: 16,
    gap: 8,
  },
  tab: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsList: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
    borderRadius: 12,
    ...CommonStyles.shadow,
  },
  avatarContainer: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  status: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: 'transparent',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    color: Colors.light.secondaryText,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
