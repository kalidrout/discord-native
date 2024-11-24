import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
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
      style={[styles.friendItem, { backgroundColor: colors.background }]}
      onPress={onPress}
      android_ripple={{ color: colors.ripple }}
    >
      <Pressable style={styles.avatarContainer} onPress={onProfilePress}>
        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
        <View style={[styles.status, { backgroundColor: getStatusColor(status) }]} />
      </Pressable>
      <View style={styles.friendInfo}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.statusText, { color: colors.icon }]}>{status}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={styles.actionButton}
          onPress={onCallPress}
          android_ripple={{ color: colors.ripple }}
        >
          <Ionicons name="call" size={20} color={colors.icon} />
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Friends</Text>
        <View style={styles.tabs}>
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
                  { color: selectedTab === tab.id ? '#fff' : colors.text },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView style={styles.friendsList}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.discord.divider,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  friendsList: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  status: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.discord.background,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
});
