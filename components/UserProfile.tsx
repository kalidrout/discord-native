import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable, Image, ScrollView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

interface UserProfileProps {
  visible: boolean;
  onClose: () => void;
  user: {
    name: string;
    status: 'online' | 'idle' | 'dnd' | 'offline';
    avatar: string;
    activity?: string;
    customStatus?: string;
    joinDate?: string;
    mutualServers?: string[];
    mutualFriends?: string[];
  };
  onMessage?: (user: UserProfileProps['user']) => void;
  onCall?: (user: UserProfileProps['user']) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  visible, 
  onClose, 
  user,
  onMessage,
  onCall
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getStatusColor = () => {
    switch (user.status) {
      case 'online':
        return Colors.discord.green;
      case 'idle':
        return Colors.discord.yellow;
      case 'dnd':
        return Colors.discord.red;
      default:
        return Colors.discord.gray;
    }
  };

  if (!user) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <BlurView intensity={30} style={StyleSheet.absoluteFill} />
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.icon} />
            </Pressable>
          </View>

          {/* Profile Banner */}
          <View style={[styles.banner, { backgroundColor: colors.messageInput }]} />

          {/* Avatar and Status */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View
              style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}
            />
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={[styles.username, { color: colors.text }]}>{user.name}</Text>
            {user.customStatus && (
              <Text style={[styles.customStatus, { color: colors.icon }]}>
                {user.customStatus}
              </Text>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable 
              style={[styles.actionButton, { backgroundColor: colors.messageInput }]}
              onPress={() => {
                onClose();
                onMessage?.(user);
              }}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.icon} />
              <Text style={[styles.actionText, { color: colors.text }]}>Message</Text>
            </Pressable>
            <Pressable 
              style={[styles.actionButton, { backgroundColor: colors.messageInput }]}
              onPress={() => {
                onClose();
                onCall?.(user);
              }}>
              <Ionicons name="call-outline" size={20} color={colors.icon} />
              <Text style={[styles.actionText, { color: colors.text }]}>Call</Text>
            </Pressable>
          </View>

          {/* Additional Info */}
          <ScrollView style={styles.additionalInfo}>
            {user.activity && (
              <View style={[styles.infoSection, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.sectionTitle, { color: colors.icon }]}>CURRENTLY PLAYING</Text>
                <Text style={[styles.sectionContent, { color: colors.text }]}>{user.activity}</Text>
              </View>
            )}

            {user.joinDate && (
              <View style={[styles.infoSection, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.sectionTitle, { color: colors.icon }]}>DISCORD MEMBER SINCE</Text>
                <Text style={[styles.sectionContent, { color: colors.text }]}>{user.joinDate}</Text>
              </View>
            )}

            {user.mutualServers && user.mutualServers.length > 0 && (
              <View style={[styles.infoSection, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.sectionTitle, { color: colors.icon }]}>
                  MUTUAL SERVERS ({user.mutualServers.length})
                </Text>
                {user.mutualServers.map((server, index) => (
                  <Text key={index} style={[styles.sectionContent, { color: colors.text }]}>
                    {server}
                  </Text>
                ))}
              </View>
            )}

            {user.mutualFriends && user.mutualFriends.length > 0 && (
              <View style={[styles.infoSection, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.sectionTitle, { color: colors.icon }]}>
                  MUTUAL FRIENDS ({user.mutualFriends.length})
                </Text>
                {user.mutualFriends.map((friend, index) => (
                  <Text key={index} style={[styles.sectionContent, { color: colors.text }]}>
                    {friend}
                  </Text>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    height: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  banner: {
    height: 120,
    width: '100%',
  },
  avatarContainer: {
    position: 'absolute',
    top: 140,
    left: 16,
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: 'white',
  },
  userInfo: {
    marginTop: 80,
    paddingHorizontal: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customStatus: {
    fontSize: 16,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  additionalInfo: {
    flex: 1,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    marginBottom: 4,
  },
});
