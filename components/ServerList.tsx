import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, Pressable, StyleSheet, Modal, Text, TextInput, SafeAreaView } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { database } from '../services/database';
import { ServerDropdown } from './ServerDropdown';

interface ServerItemProps {
  id: string;
  name?: string;
  imageUrl?: string;
  isSelected?: boolean;
  onPress: () => void;
  isHome?: boolean;
}

const ServerItem: React.FC<ServerItemProps> = ({ id, name, isSelected, onPress }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.serverItemContainer}>
      <View
        style={[
          styles.serverIndicator,
          isSelected && { height: 40, backgroundColor: colors.tint },
        ]}
      />
      <Pressable
        onPress={onPress}
        style={[
          styles.serverButton,
          isSelected && { borderRadius: 16 },
          { backgroundColor: colors.channelItem }
        ]}>
        <Text style={[styles.serverInitial, { color: colors.text }]}>
          {name ? name[0].toUpperCase() : '?'}
        </Text>
      </Pressable>
    </View>
  );
};

function AddServerModal({ visible, onClose, onSubmit }: { visible: boolean; onClose: () => void; onSubmit: (name: string) => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [serverName, setServerName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = () => {
    onSubmit(serverName);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <Pressable 
            onPress={onClose} 
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={colors.icon} />
          </Pressable>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {activeTab === 'create' ? 'Create a Server' : 'Join a Server'}
          </Text>
        </View>

        <View style={styles.tabContainer}>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'create' && { backgroundColor: colors.channelItem }
            ]}
            onPress={() => setActiveTab('create')}
          >
            <Text style={[styles.tabText, { color: colors.text }]}>Create</Text>
          </Pressable>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'join' && { backgroundColor: colors.channelItem }
            ]}
            onPress={() => setActiveTab('join')}
          >
            <Text style={[styles.tabText, { color: colors.text }]}>Join</Text>
          </Pressable>
        </View>

        <View style={styles.modalContent}>
          {activeTab === 'create' ? (
            <View>
              <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>
                SERVER NAME
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.messageInput,
                  color: colors.text 
                }]}
                value={serverName}
                onChangeText={setServerName}
                placeholder="Enter server name"
                placeholderTextColor={colors.secondaryText}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
          ) : (
            <View>
              <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>
                INVITE CODE
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.messageInput,
                  color: colors.text 
                }]}
                value={inviteCode}
                onChangeText={setInviteCode}
                placeholder="Enter an invite code"
                placeholderTextColor={colors.secondaryText}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
          )}

          <Pressable
            style={[styles.submitButton, { backgroundColor: Colors.discord.blurple }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {activeTab === 'create' ? 'Create Server' : 'Join Server'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

interface ServerListProps {
  selectedServerId: string | null;
  onServerPress: (serverId: string) => void;
}

interface Server {
  id: string;
  name: string;
  // Add other server properties as needed
}

export const ServerList: React.FC<ServerListProps> = ({ selectedServerId, onServerPress }) => {
  const [showAddServer, setShowAddServer] = useState(false);
  const [showServerDropdown, setShowServerDropdown] = useState(false);
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  useEffect(() => {
    if (user) {
      loadServers();
    }
  }, [user]);

  async function loadServers() {
    if (!user) return;
    const userServers = await database.getServers(user.id);
    setServers(userServers);
  }

  async function handleCreateServer(name: string) {
    if (!user) return;
    try {
      await database.createServer(name, user.id);
      await loadServers();
      setShowAddServer(false);
    } catch (error) {
      console.error('Error creating server:', error);
    }
  }

  const handleServerTitlePress = async (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    setSelectedServer(server || null);
    setShowServerDropdown(true);
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {/* Server List */}
          <View style={styles.serverGrid}>
            {servers.map((server) => (
              <View key={server.id} style={styles.serverGridItem}>
                <ServerItem
                  id={server.id}
                  name={server.name}
                  isSelected={selectedServerId === server.id}
                  onPress={() => onServerPress(server.id)}
                />
              </View>
            ))}
            
            {/* Add Server Button */}
            <View style={styles.serverGridItem}>
              <View style={styles.serverItemContainer}>
                <View style={styles.serverIndicator} />
                <Pressable
                  onPress={() => setShowAddServer(true)}
                  style={[
                    styles.serverButton,
                    { backgroundColor: colors.channelItem }
                  ]}>
                  <Ionicons name="add" size={24} color={Colors.discord.green} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <AddServerModal 
        visible={showAddServer}
        onClose={() => setShowAddServer(false)}
        onSubmit={handleCreateServer}
      />

      <ServerDropdown
        visible={showServerDropdown}
        onClose={() => setShowServerDropdown(false)}
        server={selectedServer}
        onDeleteServer={async () => {
          if (selectedServer) {
            await database.deleteServer(selectedServer.id);
            await loadServers();
          }
        }}
        onInvitePeople={() => {
          // Handle invite people
        }}
        onServerSettings={() => {
          // Handle server settings
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
  },
  serverItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  serverIndicator: {
    width: 4,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  serverButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serverIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.discord.divider,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.38,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: -0.41,
  },
  modalContent: {
    padding: 16,
    gap: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.08,
    marginBottom: 8,
  },
  input: {
    height: 44,
    padding: 12,
    borderRadius: 8,
    fontSize: 17,
    letterSpacing: -0.41,
  },
  submitButton: {
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  gridContainer: {
    padding: 12,
    gap: 16,
  },
  homeContainer: {
    marginBottom: 8,
  },
  separator: {
    height: 2,
    borderRadius: 1,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  serverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
  },
  serverGridItem: {
    width: '48%', // Slightly less than 50% to account for gap
    marginBottom: 8,
  },
  serverInitial: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
});
