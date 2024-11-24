import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { database } from '../services/database';
import ChannelList from './ChannelList';
import { ChannelMessages } from './ChannelMessages';
import { MemberList } from './MemberList';
import { Ionicons } from '@expo/vector-icons';
import { ServerDropdown } from './ServerDropdown';

interface User {
  id: string;
  username: string;
  // Add other user properties as needed
}

interface ServerViewProps {
  serverId: string;
}

export function ServerView({ serverId }: ServerViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [showServerDropdown, setShowServerDropdown] = useState(false);
  const [serverInfo, setServerInfo] = useState<{ name: string } | null>(null);

  useEffect(() => {
    loadServerMembers();
    loadServerInfo();
  }, [serverId]);

  async function loadServerMembers() {
    try {
      // Assuming database.getMembers exists instead of getServerMembers
      const serverMembers = await database.getMembers(serverId);
      setMembers(serverMembers);
    } catch (error) {
      console.error('Error loading server members:', error);
    }
  }

  async function loadServerInfo() {
    try {
      const server = await database.getServer(serverId);
      setServerInfo(server);
    } catch (error) {
      console.error('Error loading server info:', error);
    }
  }

  return (
    <View style={styles.container}>
      {/* Channel Sidebar */}
      <View style={[styles.channelSidebar, { backgroundColor: colors.background }]}>
        {/* Server Title */}
        <Pressable 
          onPress={() => setShowServerDropdown(true)}
          style={[styles.serverTitle, { backgroundColor: colors.channelItem }]}
        >
          <Text style={[styles.serverTitleText, { color: colors.text }]}>
            {serverInfo?.name || 'Server'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.icon} />
        </Pressable>

        <ChannelList
          serverId={serverId}
          selectedChannelId={selectedChannelId}
          onChannelPress={setSelectedChannelId}
        />
      </View>

      {/* Main Content */}
      <View style={[styles.mainContent, { backgroundColor: colors.background }]}>
        {selectedChannelId && <ChannelMessages channelId={selectedChannelId} />}
      </View>

      {/* Member List */}
      <MemberList members={members} />

      {/* Server Dropdown */}
      <ServerDropdown
        visible={showServerDropdown}
        onClose={() => setShowServerDropdown(false)}
        server={serverInfo}
        onDeleteServer={async () => {
          // Handle delete server
        }}
        onInvitePeople={() => {
          // Handle invite people
        }}
        onServerSettings={() => {
          // Handle server settings
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  channelSidebar: {
    width: 240,
    borderRightWidth: 1,
    borderRightColor: Colors.discord.divider,
  },
  mainContent: {
    flex: 1,
  },
  serverTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.discord.divider,
  },
  serverTitleText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
});
