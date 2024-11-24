import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { database } from '../services/database';
import { useAuth } from '../context/AuthContext';

interface FriendsListProps {
  onFriendPress?: (userId: string) => void;
}

export function FriendsList({ onFriendPress }: FriendsListProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const [friends, setFriends] = useState<User[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);

  useEffect(() => {
    if (user) {
      loadFriends();
    }
  }, [user]);

  async function loadFriends() {
    if (!user) return;
    const allFriends = await database.getFriends(user.id);
    const onlineFriendsList = await database.getOnlineFriends(user.id);
    setFriends(allFriends);
    setOnlineFriends(onlineFriendsList);
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return Colors.discord.green;
      case 'idle': return Colors.discord.yellow;
      case 'dnd': return Colors.discord.red;
      default: return Colors.discord.gray;
    }
  };

  const renderFriendItem = (friend: User) => (
    <Pressable
      key={friend.id}
      style={[styles.friendItem, { backgroundColor: colors.background }]}
      onPress={() => onFriendPress?.(friend.id)}
    >
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          {friend.avatar ? (
            <Image source={{ uri: friend.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.messageInput }]}>
              <Text style={{ color: colors.text }}>{friend.username[0]}</Text>
            </View>
          )}
          <View 
            style={[
              styles.statusIndicator, 
              { backgroundColor: getStatusColor(friend.status) }
            ]} 
          />
        </View>
        <View>
          <Text style={[styles.username, { color: colors.text }]}>
            {friend.username}
          </Text>
          <Text style={[styles.status, { color: colors.secondaryText }]}>
            {friend.status || 'offline'}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.actionButton}>
          <Ionicons name="chatbubble" size={20} color={colors.icon} />
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Ionicons name="call" size={20} color={colors.icon} />
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Ionicons name="videocam" size={20} color={colors.icon} />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Online Friends Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
          ONLINE — {onlineFriends.length}
        </Text>
        <ScrollView>
          {onlineFriends.map(renderFriendItem)}
        </ScrollView>
      </View>

      {/* Offline Friends Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
          OFFLINE — {friends.length - onlineFriends.length}
        </Text>
        <ScrollView>
          {friends
            .filter(friend => !onlineFriends.includes(friend))
            .map(renderFriendItem)}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.08,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 62,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Colors.discord.background,
  },
  username: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  status: {
    fontSize: 13,
    letterSpacing: -0.08,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.discord.messageInput,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 