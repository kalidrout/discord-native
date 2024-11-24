import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddChannelModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, type: 'text' | 'voice' | 'announcement') => void;
}

export function AddChannelModal({ visible, onClose, onSubmit }: AddChannelModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<'text' | 'voice' | 'announcement'>('text');

  const handleSubmit = () => {
    if (channelName.trim()) {
      onSubmit(channelName.trim(), channelType);
      setChannelName('');
      setChannelType('text');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Pressable 
            onPress={onClose} 
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={colors.icon} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Create Channel</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>CHANNEL TYPE</Text>
          <View style={styles.typeContainer}>
            {[
              { type: 'text' as const, icon: 'text', label: 'Text' },
              { type: 'voice' as const, icon: 'volume-medium', label: 'Voice' },
              { type: 'announcement' as const, icon: 'megaphone', label: 'Announcement' }
            ].map(item => (
              <Pressable
                key={item.type}
                style={[
                  styles.typeButton,
                  { backgroundColor: colors.messageInput },
                  channelType === item.type && { backgroundColor: colors.channelItem }
                ]}
                onPress={() => setChannelType(item.type)}
              >
                <Ionicons 
                  name={item.icon as any} 
                  size={20} 
                  color={channelType === item.type ? colors.text : colors.icon} 
                />
                <Text 
                  style={[
                    styles.typeLabel, 
                    { color: channelType === item.type ? colors.text : colors.icon }
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.secondaryText }]}>CHANNEL NAME</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.messageInput,
              color: colors.text 
            }]}
            value={channelName}
            onChangeText={setChannelName}
            placeholder="new-channel"
            placeholderTextColor={colors.secondaryText}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
          />

          <Pressable
            style={[
              styles.createButton,
              { backgroundColor: Colors.discord.blurple },
              !channelName.trim() && { opacity: 0.5 }
            ]}
            onPress={handleSubmit}
            disabled={!channelName.trim()}
          >
            <Text style={styles.createButtonText}>Create Channel</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.discord.divider,
    minHeight: 44,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.38,
    marginLeft: 8,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.08,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  typeLabel: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: -0.41,
  },
  input: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 17,
    letterSpacing: -0.41,
  },
  createButton: {
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
}); 