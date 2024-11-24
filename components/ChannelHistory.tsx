import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, Pressable, StyleSheet, TextInput, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  author: {
    name: string;
    avatar: string;
  };
}

interface ChannelHistoryProps {
  visible: boolean;
  onClose: () => void;
  channel: {
    id: string;
    name: string;
    type: 'text' | 'voice' | 'announcement';
  } | null;
}

export const ChannelHistory: React.FC<ChannelHistoryProps> = ({
  visible,
  onClose,
  channel
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hey everyone! Welcome to the channel!',
      timestamp: new Date(Date.now() - 3600000),
      author: {
        name: 'User 1',
        avatar: 'https://github.com/identicons/jasonlong.png'
      }
    },
    {
      id: '2',
      content: 'Thanks! Excited to be here 🎉',
      timestamp: new Date(Date.now() - 1800000),
      author: {
        name: 'User 2',
        avatar: 'https://github.com/identicons/octocat.png'
      }
    },
    {
      id: '3',
      content: 'What\'s everyone working on?',
      timestamp: new Date(Date.now() - 900000),
      author: {
        name: 'User 3',
        avatar: 'https://github.com/identicons/github.png'
      }
    }
  ]);

  if (!channel) return null;

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
      author: {
        name: 'You',
        avatar: 'https://github.com/identicons/cascade.png'
      }
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
          <View style={styles.headerLeft}>
            <Pressable onPress={onClose} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={colors.icon} />
            </Pressable>
            <View style={styles.channelInfo}>
              <View style={styles.channelNameContainer}>
                <Ionicons
                  name={channel.type === 'voice' ? 'volume-medium' : 'hash'}
                  size={24}
                  color={colors.icon}
                />
                <Text style={[styles.channelName, { color: colors.text }]}>
                  {channel.name}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.actionButton}>
              <Ionicons name="people-outline" size={24} color={colors.icon} />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Ionicons name="search-outline" size={24} color={colors.icon} />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Ionicons name="notifications-outline" size={24} color={colors.icon} />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Ionicons name="pin-outline" size={24} color={colors.icon} />
            </Pressable>
          </View>
        </View>

        <ScrollView 
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={styles.messageContainer}>
              <Image source={{ uri: msg.author.avatar }} style={styles.avatar} />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={[styles.authorName, { color: colors.text }]}>
                    {msg.author.name}
                  </Text>
                  <Text style={[styles.timestamp, { color: colors.icon }]}>
                    {formatTime(msg.timestamp)}
                  </Text>
                </View>
                <Text style={[styles.messageText, { color: colors.text }]}>
                  {msg.content}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: colors.messageInput }]}>
          <Pressable style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={24} color={colors.icon} />
          </Pressable>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={`Message #${channel.name}`}
            placeholderTextColor={colors.icon}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <Pressable style={styles.sendButton} onPress={handleSend}>
            <Ionicons 
              name="send" 
              size={24} 
              color={message.trim() ? Colors.discord.blurple : colors.icon} 
            />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: Platform.OS === 'ios' ? 88 : 56,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 8,
  },
  channelInfo: {
    flex: 1,
  },
  channelNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  channelName: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    borderTopWidth: 1,
    borderTopColor: Colors.discord.divider,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
});
