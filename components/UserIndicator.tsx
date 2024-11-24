import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

interface UserIndicatorProps {
  onSettingsPress?: () => void;
}

export const UserIndicator: React.FC<UserIndicatorProps> = ({ onSettingsPress }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.userIndicator, { backgroundColor: colors.messageInput }]}>
      <Pressable 
        style={styles.userInfo}
        android_ripple={{ color: colors.ripple }}
        onPress={() => {
          // TODO: Implement user settings menu
        }}
      >
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://github.com/identicons/jasonlong.png' }}
            style={styles.avatar} 
          />
          <View style={[styles.statusIndicator, { backgroundColor: Colors.discord.green }]} />
        </View>
        <View style={styles.userTextContainer}>
          <Text style={[styles.username, { color: colors.text }]}>Username</Text>
          <Text style={[styles.status, { color: colors.icon }]}>Online</Text>
        </View>
        <View style={styles.userActions}>
          <Pressable
            style={styles.actionButton}
            android_ripple={{ color: colors.ripple }}
            onPress={() => {
              // TODO: Implement mute
            }}
          >
            <Ionicons name="mic-outline" size={20} color={colors.icon} />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            android_ripple={{ color: colors.ripple }}
            onPress={() => {
              // TODO: Implement deafen
            }}
          >
            <Ionicons name="headset-outline" size={20} color={colors.icon} />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            android_ripple={{ color: colors.ripple }}
            onPress={onSettingsPress}
          >
            <Ionicons name="settings-outline" size={20} color={colors.icon} />
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  userIndicator: {
    width: '100%',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.discord.divider,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 4,
  },
  avatarContainer: {
    position: 'relative',
    width: 32,
    height: 32,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.discord.background,
  },
  userTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginLeft: 4,
  },
});
