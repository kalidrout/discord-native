import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, Pressable, TextInput, ScrollView, Image, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { UserIndicator } from './UserIndicator';

interface ChatInterfaceProps {
  visible: boolean;
  onClose: () => void;
  user: {
    name: string;
    avatar: string;
  } | null;
}

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'other';
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  visible,
  onClose,
  user
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
      sender: 'user',
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: `Hey! Thanks for your message: "${message}"`,
        timestamp: new Date(),
        sender: 'other',
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            <Pressable onPress={onClose} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={colors.icon} />
            </Pressable>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={[styles.username, { color: colors.text }]}>{user.name}</Text>
            <View style={styles.headerActions}>
              <Pressable style={styles.headerButton}>
                <Ionicons name="call-outline" size={24} color={colors.icon} />
              </Pressable>
              <Pressable style={styles.headerButton}>
                <Ionicons name="videocam-outline" size={24} color={colors.icon} />
              </Pressable>
            </View>
          </View>

          {/* Messages */}
          <ScrollView 
            style={styles.messages}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageContainer,
                  msg.sender === 'user' ? styles.userMessage : styles.otherMessage,
                ]}
              >
                {msg.sender === 'other' && (
                  <Image source={{ uri: user.avatar }} style={styles.messageAvatar} />
                )}
                <View
                  style={[
                    styles.messageBubble,
                    {
                      backgroundColor:
                        msg.sender === 'user'
                          ? Colors.discord.blue
                          : colors.messageInput,
                    },
                  ]}
                >
                  <Text style={[styles.messageText, { color: msg.sender === 'user' ? 'white' : colors.text }]}>
                    {msg.content}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      { color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : colors.icon },
                    ]}
                  >
                    {formatTime(msg.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <UserIndicator />
          {/* Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.messageInput }]}>
            <Pressable style={styles.attachButton}>
              <Ionicons name="add-circle-outline" size={24} color={colors.icon} />
            </Pressable>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Message"
              placeholderTextColor={colors.icon}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSend}
              multiline
            />
            <Pressable 
              style={[
                styles.sendButton,
                { opacity: message.trim() ? 1 : 0.5 }
              ]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Ionicons 
                name="send" 
                size={24} 
                color={message.trim() ? Colors.discord.blue : colors.icon} 
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'ios' ? 8 : 0,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
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
    alignItems: 'flex-end',
    gap: 8,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingBottom: Platform.OS === 'ios' ? 32 : 8,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});
