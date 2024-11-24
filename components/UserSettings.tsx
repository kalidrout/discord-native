import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  Pressable, 
  StyleSheet, 
  Image, 
  ScrollView,
  Switch,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Typography } from '../constants/Typography';
import { CommonStyles } from '../constants/CommonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserSettingsProps {
  visible: boolean;
  onClose: () => void;
}

type SettingsSection = 'user' | 'app' | 'activity' | 'voice' | 'appearance';

export const UserSettings: React.FC<UserSettingsProps> = ({ visible, onClose }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [selectedSection, setSelectedSection] = useState<SettingsSection>('user');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const sections: { id: SettingsSection; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'user', label: 'User Profile', icon: 'person-outline' },
    { id: 'app', label: 'App Settings', icon: 'settings-outline' },
    { id: 'activity', label: 'Activity', icon: 'game-controller-outline' },
    { id: 'voice', label: 'Voice', icon: 'mic-outline' },
    { id: 'appearance', label: 'Appearance', icon: 'color-palette-outline' },
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'user':
        return (
          <View style={styles.sectionContent}>
            <View style={styles.profileSection}>
              <Image
                source={{ uri: 'https://github.com/github.png' }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={[Typography.title3, { color: colors.text }]}>Username</Text>
                <Text style={[Typography.footnote, { color: colors.secondaryText }]}>#0000</Text>
              </View>
            </View>
            
            <View style={[styles.settingGroup, { borderColor: colors.divider }]}>
              <Text style={[Typography.footnote, { color: colors.secondaryText, marginBottom: 8 }]}>
                ACCOUNT INFORMATION
              </Text>
              <Pressable style={styles.settingItem}>
                <Text style={[Typography.body, { color: colors.text }]}>Email</Text>
                <Text style={[Typography.callout, { color: colors.secondaryText }]}>
                  user@example.com
                </Text>
              </Pressable>
              <Pressable style={styles.settingItem}>
                <Text style={[Typography.body, { color: colors.text }]}>Phone</Text>
                <Text style={[Typography.callout, { color: colors.secondaryText }]}>
                  +1 234 567 8900
                </Text>
              </Pressable>
            </View>
          </View>
        );
      
      case 'app':
        return (
          <View style={styles.sectionContent}>
            <View style={[styles.settingGroup, { borderColor: colors.divider }]}>
              <Text style={[Typography.footnote, { color: colors.secondaryText, marginBottom: 8 }]}>
                NOTIFICATIONS
              </Text>
              <View style={styles.settingItem}>
                <Text style={[Typography.body, { color: colors.text }]}>Enable Notifications</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  ios_backgroundColor={colors.messageInput}
                />
              </View>
              <View style={styles.settingItem}>
                <Text style={[Typography.body, { color: colors.text }]}>Sound Effects</Text>
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  ios_backgroundColor={colors.messageInput}
                />
              </View>
            </View>
          </View>
        );
      
      default:
        return (
          <View style={styles.sectionContent}>
            <Text style={[Typography.body, { color: colors.text }]}>
              {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)} Settings
            </Text>
          </View>
        );
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
        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
          <Text style={[Typography.headline, { color: colors.text }]}>User Settings</Text>
          <Pressable
            style={[CommonStyles.button, styles.closeButton]}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={colors.icon} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={[styles.sidebar, { borderRightColor: colors.divider }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {sections.map((section) => (
                <Pressable
                  key={section.id}
                  style={[
                    styles.sectionButton,
                    selectedSection === section.id && { backgroundColor: colors.messageInput }
                  ]}
                  onPress={() => setSelectedSection(section.id)}
                >
                  <View style={styles.sectionIconContainer}>
                    <Ionicons name={section.icon} size={20} color={colors.icon} />
                  </View>
                  <Text 
                    style={[
                      Typography.callout,
                      styles.sectionLabel,
                      { color: colors.text }
                    ]}
                    numberOfLines={1}
                  >
                    {section.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <ScrollView 
            style={styles.mainContent}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
          >
            {renderContent()}
          </ScrollView>
        </View>
      </SafeAreaView>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },
  closeButton: {
    borderRadius: 22,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingRight: 16,
    marginVertical: 2,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    flex: 1,
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
  settingGroup: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 16,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
  },
});
