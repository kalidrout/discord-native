import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface HistoryMessage {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: Date;
  isCall?: boolean;
  callDuration?: string;
}

interface MessageHistoryProps {
  visible: boolean;
  onClose: () => void;
}

const mockHistory: HistoryMessage[] = [
  {
    id: '1',
    content: '',
    author: {
      name: 'Gaming Group',
      avatar: 'https://github.com/discord.png',
    },
    timestamp: new Date(Date.now() - 86400000),
    isCall: true,
    callDuration: '1:23:45',
  },
  {
    id: '2',
    content: 'Hey, are you free to join the call?',
    author: {
      name: 'John Doe',
      avatar: 'https://github.com/github.png',
    },
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: '3',
    content: '',
    author: {
      name: 'Study Group',
      avatar: 'https://github.com/expo.png',
    },
    timestamp: new Date(Date.now() - 259200000),
    isCall: true,
    callDuration: '2:45:12',
  },
];

export const MessageHistory: React.FC<MessageHistoryProps> = ({ visible, onClose }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <BlurView intensity={30} style={StyleSheet.absoluteFill} />
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            <Text style={[styles.title, { color: colors.text }]}>Message History</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.icon} />
            </Pressable>
          </View>
          <ScrollView style={styles.scrollView}>
            {mockHistory.map((message) => (
              <Pressable
                key={message.id}
                style={[styles.messageItem, { borderBottomColor: colors.divider }]}>
                <Image source={{ uri: message.author.avatar }} style={styles.avatar} />
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={[styles.authorName, { color: colors.text }]}>
                      {message.author.name}
                    </Text>
                    <Text style={[styles.timestamp, { color: colors.icon }]}>
                      {formatDate(message.timestamp)} at {formatTime(message.timestamp)}
                    </Text>
                  </View>
                  {message.isCall ? (
                    <View style={styles.callInfo}>
                      <Ionicons name="call" size={16} color={colors.icon} />
                      <Text style={[styles.callText, { color: colors.text }]}>
                        Voice Call · {message.callDuration}
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.messageText, { color: colors.text }]}>
                      {message.content}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  authorName: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
  },
  messageText: {
    fontSize: 14,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
