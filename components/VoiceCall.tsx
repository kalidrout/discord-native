import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
}

interface VoiceCallProps {
  visible: boolean;
  onClose: () => void;
  user?: {
    id: number;
    name: string;
    status: string;
    avatar: string;
  } | null;
}

const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'You',
    avatar: 'https://github.com/github.png',
    isSpeaking: false,
    isMuted: false,
    isDeafened: false,
  },
  {
    id: '2',
    name: 'John Doe',
    avatar: 'https://github.com/facebook.png',
    isSpeaking: true,
    isMuted: false,
    isDeafened: false,
  },
  {
    id: '3',
    name: 'Jane Smith',
    avatar: 'https://github.com/expo.png',
    isSpeaking: false,
    isMuted: true,
    isDeafened: false,
  },
];

export const VoiceCall: React.FC<VoiceCallProps> = ({ visible, onClose, user }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participants] = useState<Participant[]>(mockParticipants);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (visible) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setCallDuration(0);
    }
  }, [visible]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <BlurView intensity={30} style={StyleSheet.absoluteFill} />
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Voice Call</Text>
            <Text style={[styles.duration, { color: colors.icon }]}>
              {formatDuration(callDuration)}
            </Text>
          </View>
          
          <View style={styles.participantsContainer}>
            {participants.map((participant) => (
              <View key={participant.id} style={styles.participant}>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: participant.avatar }} style={styles.avatar} />
                  {participant.isSpeaking && (
                    <View style={[styles.speakingIndicator, { borderColor: colors.background }]} />
                  )}
                </View>
                <Text style={[styles.participantName, { color: colors.text }]}>
                  {participant.name}
                </Text>
                <View style={styles.participantIcons}>
                  {participant.isMuted && (
                    <Ionicons name="mic-off" size={16} color={colors.icon} style={styles.icon} />
                  )}
                  {participant.isDeafened && (
                    <Ionicons name="volume-mute" size={16} color={colors.icon} style={styles.icon} />
                  )}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.controls}>
            <Pressable
              style={[styles.controlButton, isMuted && styles.activeControl]}
              onPress={() => setIsMuted(!isMuted)}>
              <Ionicons
                name={isMuted ? 'mic-off' : 'mic'}
                size={24}
                color={isMuted ? Colors.discord.red : colors.icon}
              />
            </Pressable>
            <Pressable
              style={[styles.controlButton, isDeafened && styles.activeControl]}
              onPress={() => setIsDeafened(!isDeafened)}>
              <Ionicons
                name={isDeafened ? 'volume-mute' : 'volume-high'}
                size={24}
                color={isDeafened ? Colors.discord.red : colors.icon}
              />
            </Pressable>
            <Pressable
              style={[styles.controlButton, styles.endCallButton]}
              onPress={onClose}>
              <Ionicons name="call" size={24} color="white" />
            </Pressable>
          </View>
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
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 14,
  },
  participantsContainer: {
    marginBottom: 16,
  },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  speakingIndicator: {
    position: 'absolute',
    bottom: -2,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.discord.green,
    borderWidth: 2,
  },
  participantName: {
    flex: 1,
    fontSize: 16,
  },
  participantIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  activeControl: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  endCallButton: {
    backgroundColor: Colors.discord.red,
  },
});
