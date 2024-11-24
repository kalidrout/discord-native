import { StyleSheet, View, Text, Pressable, ScrollView, Modal, TextInput, ActivityIndicator, Image } from 'react-native';
import { ServerList } from '../../components/ServerList';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../services/database';
import { ServerView } from '../../components/ServerView';
import { FriendsList } from '../../components/FriendsList';
import { ServerDropdown } from '../../components/ServerDropdown';
import ChannelList from '../../components/ChannelList';
import { ChannelMessages } from '../../components/ChannelMessages';

function AddFriendsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSuggestedFriends();
  }, []);

  async function loadSuggestedFriends() {
    if (!user) return;
    const suggested = await database.getSuggestedFriends(user.id);
    setSuggestedFriends(suggested);
  }

  async function handleSearch(text: string) {
    setSearchQuery(text);
    if (text.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await database.searchUsers(text);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendFriendRequest(toUserId: string) {
    if (!user) return;
    
    try {
      await database.sendFriendRequest(user.id, toUserId);
      // Refresh suggested friends list
      await loadSuggestedFriends();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  }

  function renderUserItem(item: User) {
    return (
      <View key={item.id} style={[styles.userItem, { borderBottomColor: colors.divider }]}>
        <View style={styles.userInfo}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.messageInput }]}>
              <Text style={{ color: colors.text }}>{item.username[0]}</Text>
            </View>
          )}
          <View>
            <Text style={[styles.username, { color: colors.text }]}>
              {item.username}
            </Text>
            <Text style={[styles.discriminator, { color: colors.secondaryText }]}>
              #{item.discriminator}
            </Text>
          </View>
        </View>
        <Pressable
          style={[styles.addButton, { backgroundColor: Colors.discord.blurple }]}
          onPress={() => handleSendFriendRequest(item.id)}
        >
          <Text style={styles.addButtonText}>Add Friend</Text>
        </Pressable>
      </View>
    );
  }

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
          <Text style={[styles.modalTitle, { color: colors.text }]}>Add Friends</Text>
        </View>

        <View style={[styles.searchSection, { backgroundColor: colors.messageInput }]}>
          <Text style={[styles.searchLabel, { color: colors.secondaryText }]}>
            YOU CAN ADD FRIENDS WITH THEIR DISCORD TAG. IT'S CASE sEnSiTiVe!
          </Text>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.icon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search for friends"
              placeholderTextColor={colors.secondaryText}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        <ScrollView style={styles.resultsContainer}>
          {searchQuery.length > 0 ? (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
                SEARCH RESULTS
              </Text>
              {isLoading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                searchResults.map(user => renderUserItem(user))
              )}
            </View>
          ) : (
            <View>
              <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
                SUGGESTED
              </Text>
              {suggestedFriends.map(user => renderUserItem(user))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function TabOneScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [showServerDropdown, setShowServerDropdown] = useState(false);

  const handleServerSelect = (serverId: string) => {
    setSelectedServerId(serverId);
  };

  return (
    <SafeAreaView style={[styles.container]} edges={['top']}>
      <View style={styles.content}>
        {/* Server Sidebar */}
        <View style={[styles.serverSidebar, { backgroundColor: colors.serverList }]}>
          <ServerList 
            selectedServerId={selectedServerId}
            onServerPress={handleServerSelect}
          />
        </View>

        {/* Main Content */}
        {selectedServerId ? (
          // Show server view with channels, messages, and member list
          <ServerView serverId={selectedServerId} />
        ) : (
          // Show default content (Messages, Add Friends, etc.)
          <>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
              <View style={styles.searchContainer}>
                <Pressable style={[styles.searchButton, { backgroundColor: colors.messageInput }]}>
                  <Ionicons name="search" size={20} color={colors.icon} />
                </Pressable>
                <Pressable 
                  style={[styles.addFriendsButton, { backgroundColor: colors.messageInput }]}
                  onPress={() => setShowAddFriends(true)}
                >
                  <Ionicons name="person-add-outline" size={20} color={colors.icon} />
                  <Text style={[styles.addFriendsText, { color: colors.text }]}>Add Friends</Text>
                </Pressable>
              </View>
            </View>

            <ScrollView style={styles.content}>
              <View style={styles.section}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.onlineFriends}>
                  {/* Add online friends avatars here */}
                </ScrollView>
              </View>

              <View style={styles.messagesList}>
                <FriendsList 
                  onFriendPress={(userId) => {
                    // Handle friend selection
                    console.log('Selected friend:', userId);
                  }} 
                />
              </View>
            </ScrollView>
          </>
        )}
      </View>

      {/* Modals */}
      <AddFriendsModal visible={showAddFriends} onClose={() => setShowAddFriends(false)} />
      
      <ServerDropdown
        visible={showServerDropdown}
        onClose={() => setShowServerDropdown(false)}
        serverId={selectedServerId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  serverSidebar: {
    width: 72,
    height: '100%',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    padding: 16,
    gap: 12,
    minHeight: 44,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.41,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFriendsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addFriendsText: {
    fontSize: 17,
    letterSpacing: -0.41,
  },
  section: {
    paddingVertical: 8,
  },
  onlineFriends: {
    paddingHorizontal: 16,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.discord.divider,
  },
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchSection: {
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  searchLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.discord.background,
    padding: 8,
    borderRadius: 4,
    gap: 8,
  },
  searchInputPlaceholder: {
    flex: 1,
    fontSize: 16,
  },
  suggestedSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  discriminator: {
    fontSize: 14,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  channelSidebar: {
    width: 240,
    borderRightWidth: 1,
  },
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  serverName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  channelContent: {
    flex: 1,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 8,
  },
  channelName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  serverHeaderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
});
