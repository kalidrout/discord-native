import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, Pressable, StyleSheet, Image, Switch, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';

interface UserSettingsProps {
  visible: boolean;
  onClose: () => void;
}

type SettingsSection = 'user' | 'app' | 'activity' | 'voice' | 'appearance' | 'accessibility' | 'advanced';

export const UserSettings: React.FC<UserSettingsProps> = ({ visible, onClose }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [currentSection, setCurrentSection] = useState<SettingsSection>('user');
  const [customStatus, setCustomStatus] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [theme, setTheme] = useState(colorScheme);

  const sections: { id: SettingsSection; label: string; icon: string }[] = [
    { id: 'user', label: 'User Profile', icon: 'person-outline' },
    { id: 'app', label: 'App Settings', icon: 'settings-outline' },
    { id: 'activity', label: 'Activity Settings', icon: 'game-controller-outline' },
    { id: 'voice', label: 'Voice & Video', icon: 'mic-outline' },
    { id: 'appearance', label: 'Appearance', icon: 'color-palette-outline' },
    { id: 'accessibility', label: 'Accessibility', icon: 'accessibility-outline' },
    { id: 'advanced', label: 'Advanced', icon: 'code-working-outline' },
  ];

  const renderContent = () => {
    switch (currentSection) {
      case 'user':
        return (
          <View style={styles.sectionContent}>
            <View style={styles.profileSection}>
              <Image
                source={{ uri: 'https://github.com/identicons/jasonlong.png' }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.username, { color: colors.text }]}>Username</Text>
                <Text style={[styles.discriminator, { color: colors.icon }]}>#1234</Text>
              </View>
            </View>
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Custom Status</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                value={customStatus}
                onChangeText={setCustomStatus}
                placeholder="Set a custom status"
                placeholderTextColor={colors.icon}
              />
            </View>
          </View>
        );
      case 'app':
        return (
          <View style={styles.sectionContent}>
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.icon, true: Colors.discord.blue }}
              />
            </View>
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            <Pressable style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Language</Text>
              <View style={styles.settingValue}>
                <Text style={{ color: colors.icon }}>English</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.icon} />
              </View>
            </Pressable>
          </View>
        );
      case 'appearance':
        return (
          <View style={styles.sectionContent}>
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Theme</Text>
              <View style={styles.themeButtons}>
                <Pressable
                  style={[
                    styles.themeButton,
                    theme === 'light' && { backgroundColor: Colors.discord.blue }
                  ]}
                  onPress={() => setTheme('light')}
                >
                  <Text style={{ color: theme === 'light' ? 'white' : colors.text }}>Light</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.themeButton,
                    theme === 'dark' && { backgroundColor: Colors.discord.blue }
                  ]}
                  onPress={() => setTheme('dark')}
                >
                  <Text style={{ color: theme === 'dark' ? 'white' : colors.text }}>Dark</Text>
                </Pressable>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Compact Mode</Text>
              <Switch
                value={compactMode}
                onValueChange={setCompactMode}
                trackColor={{ false: colors.icon, true: Colors.discord.blue }}
              />
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.sectionContent}>
            <Text style={[styles.placeholder, { color: colors.icon }]}>
              Coming soon...
            </Text>
          </View>
        );
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.icon} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>User Settings</Text>
          <View style={styles.closeButton} />
        </View>

        <View style={styles.content}>
          <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
            {sections.map((section) => (
              <Pressable
                key={section.id}
                style={[
                  styles.sectionButton,
                  currentSection === section.id && {
                    backgroundColor: colors.messageInput,
                  },
                ]}
                onPress={() => setCurrentSection(section.id)}
              >
                <Ionicons
                  name={section.icon as any}
                  size={24}
                  color={currentSection === section.id ? colors.text : colors.icon}
                />
                <Text
                  style={[
                    styles.sectionLabel,
                    { color: currentSection === section.id ? colors.text : colors.icon },
                  ]}
                >
                  {section.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={[styles.mainContent, { backgroundColor: colors.messageInput }]}>
            {renderContent()}
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
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 120,
    borderRightWidth: 1,
    borderRightColor: Colors.discord.divider,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
  },
  sectionContent: {
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
  },
  discriminator: {
    fontSize: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.discord.divider,
  },
  placeholder: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
});
