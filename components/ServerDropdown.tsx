import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, SafeAreaView, TextInput } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { BlurView } from 'expo-blur';
import { database } from '../services/database';

interface ServerDropdownProps {
  visible: boolean;
  onClose: () => void;
  server: Server | null;
  onDeleteServer?: () => void;
  onInvitePeople?: () => void;
  onServerSettings?: () => void;
}

interface ServerSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  server: Server;
  onSave: (name: string) => void;
}

function ServerSettingsModal({ visible, onClose, server, onSave }: ServerSettingsModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [serverName, setServerName] = useState(server?.name || '');

  useEffect(() => {
    if (server?.name) {
      setServerName(server.name);
    }
  }, [server]);

  const handleSave = () => {
    if (serverName.trim()) {
      onSave(serverName.trim());
      onClose();
    }
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
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.icon} />
          </Pressable>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Server Settings</Text>
        </View>

        <View style={styles.modalContent}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>SERVER NAME</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.messageInput,
              color: colors.text 
            }]}
            value={serverName}
            onChangeText={setServerName}
            placeholder="Enter server name"
            placeholderTextColor={colors.secondaryText}
          />

          <Pressable
            style={[styles.saveButton, { backgroundColor: Colors.discord.blurple }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

interface InviteModalProps {
  visible: boolean;
  onClose: () => void;
  inviteCode: string;
}

function InviteModal({ visible, onClose, inviteCode }: InviteModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.icon} />
          </Pressable>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Invite People</Text>
        </View>

        <View style={styles.modalContent}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>INVITE CODE</Text>
          <View style={[styles.inviteCodeContainer, { backgroundColor: colors.messageInput }]}>
            <Text style={[styles.inviteCode, { color: colors.text }]}>{inviteCode}</Text>
            <Pressable 
              style={styles.copyButton}
              onPress={() => {
                // In a real app, implement clipboard copy
                console.log('Copy invite code:', inviteCode);
              }}
            >
              <Ionicons name="copy" size={20} color={colors.icon} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export function ServerDropdown({ 
  visible, 
  onClose, 
  server,
  onDeleteServer,
  onInvitePeople,
  onServerSettings
}: ServerDropdownProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  
  const handleInvite = async () => {
    if (!server) return;
    const code = await database.generateInviteCode(server.id);
    setInviteCode(code);
    setShowInvite(true);
  };

  const handleUpdateServer = async (name: string) => {
    if (!server) return;
    try {
      await database.updateServer(server.id, { name });
      // Refresh server data
      onServerSettings?.();
    } catch (error) {
      console.error('Error updating server:', error);
    }
  };

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const isOwner = server?.ownerId === user?.id;

  const MenuItem = ({ 
    icon, 
    label, 
    onPress, 
    destructive 
  }: { 
    icon: string; 
    label: string; 
    onPress: () => void;
    destructive?: boolean;
  }) => (
    <Pressable
      style={styles.menuItem}
      onPress={() => {
        onPress();
        onClose();
      }}
    >
      <Ionicons 
        name={icon as any} 
        size={20} 
        color={destructive ? Colors.discord.red : colors.text} 
      />
      <Text style={[
        styles.menuItemText, 
        { color: destructive ? Colors.discord.red : colors.text }
      ]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <BlurView intensity={30} style={StyleSheet.absoluteFill} />
          <View style={[styles.dropdown, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.serverName, { color: colors.text }]}>
                {server?.name || 'Server'}
              </Text>
            </View>

            <View style={styles.menuItems}>
              <MenuItem 
                icon="people" 
                label="Invite People" 
                onPress={() => onInvitePeople?.()} 
              />
              
              {isOwner && (
                <>
                  <MenuItem 
                    icon="settings" 
                    label="Server Settings" 
                    onPress={() => onServerSettings?.()} 
                  />
                  <View style={[styles.separator, { backgroundColor: colors.divider }]} />
                  <MenuItem 
                    icon="trash" 
                    label="Delete Server" 
                    onPress={() => onDeleteServer?.()} 
                    destructive 
                  />
                </>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>

      {server && (
        <ServerSettingsModal
          visible={showSettings}
          onClose={() => setShowSettings(false)}
          server={server}
          onSave={handleUpdateServer}
        />
      )}

      <InviteModal
        visible={showInvite}
        onClose={() => setShowInvite(false)}
        inviteCode={inviteCode}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  serverName: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  menuItems: {
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  menuItemText: {
    fontSize: 17,
    letterSpacing: -0.41,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 17,
  },
  saveButton: {
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  inviteCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inviteCode: {
    flex: 1,
    fontSize: 17,
  },
  copyButton: {
    padding: 8,
  },
}); 