import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TextInput, Pressable } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { database } from '../services/database';

interface Message {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'idle' | 'dnd';
    roles?: string[];
  };
  timestamp: Date;
}

interface ChannelMessagesProps {
  channelId: string;
}

export function ChannelMessages({ channelId }: ChannelMessagesProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    loadMessages();
  }, [channelId]);

  async function loadMessages() {
    const channelMessages = await database.getChannelMessages(channelId);
    setMessages(channelMessages);
  }

  async function handleSendMessage() {
    if (!user || !inputMessage.trim()) return;

    try {
      await database.addMessage(channelId, inputMessage.trim(), user.id);
      await loadMessages();
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  const formatTime = (date: Date) => {
    return `Today at ${date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    })}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messages}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.secondaryText }]}>
              No messages yet. Be the first to send a message!
            </Text>
          </View>
        ) : (
          messages.map((message, index) => {
            const showHeader = index === 0 || 
              messages[index - 1].author.id !== message.author.id ||
              message.timestamp.getTime() - messages[index - 1].timestamp.getTime() > 300000;

            return (
              <View key={message.id} style={[
                styles.messageContainer,
                !showHeader && styles.continuedMessage
              ]}>
                {showHeader && (
                  <View style={styles.messageHeader}>
                    {message.author.avatar ? (
                      <Image source={{ uri: message.author.avatar }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: colors.messageInput }]}>
                        <Text style={{ color: colors.text }}>{message.author.username[0]}</Text>
                      </View>
                    )}
                    <View style={styles.messageInfo}>
                      <Text style={[styles.username, { color: message.author.roles?.includes('admin') ? Colors.discord.blurple : colors.text }]}>
                        {message.author.username}
                      </Text>
                      <Text style={[styles.timestamp, { color: colors.secondaryText }]}>
                        {formatTime(message.timestamp)}
                      </Text>
                    </View>
                  </View>
                )}
                <Text style={[styles.messageContent, { color: colors.text }]}>
                  {message.content}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: colors.messageInput }]}>
        <Pressable style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color={colors.icon} />
        </Pressable>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder={`Message #${channelId}`}
          placeholderTextColor={colors.secondaryText}
          multiline
          onSubmitEditing={handleSendMessage}
        />
        <View style={styles.inputActions}>
          <Ionicons 
            name="send" 
            size={24} 
            color={inputMessage.trim() ? Colors.discord.blurple : colors.icon}
            style={styles.actionIcon}
            onPress={handleSendMessage}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messages: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  continuedMessage: {
    marginTop: -8,
    marginLeft: 48,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    minHeight: 44,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  timestamp: {
    fontSize: 13,
    letterSpacing: -0.08,
  },
  messageContent: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    minHeight: 44,
  },
  addButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 17,
    maxHeight: 100,
    padding: 8,
    letterSpacing: -0.41,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    textAlign: 'center',
  },
}); 