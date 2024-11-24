import React from 'react';
import { ScrollView, View, Image, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useDiscord } from '../context/DiscordContext';

interface ServerItemProps {
  imageUrl?: string;
  isSelected?: boolean;
  onPress: () => void;
  isHome?: boolean;
}

const ServerItem: React.FC<ServerItemProps> = ({ imageUrl, isSelected, onPress, isHome }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.serverItemContainer}>
      <View
        style={[
          styles.serverIndicator,
          isSelected && { height: 40, backgroundColor: colors.tint },
        ]}
      />
      <Pressable
        onPress={onPress}
        style={[
          styles.serverButton,
          isSelected && { borderRadius: 16 },
        ]}>
        {isHome ? (
          <View style={[styles.serverIcon, { backgroundColor: colors.channelItem }]}>
            <Ionicons name="logo-discord" size={24} color={colors.tint} />
          </View>
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.serverIcon} />
        ) : (
          <View style={[styles.serverIcon, { backgroundColor: colors.channelItem }]}>
            <Ionicons name="people" size={24} color={colors.icon} />
          </View>
        )}
      </Pressable>
    </View>
  );
};

export const ServerList: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { servers, selectedServer, setSelectedServer } = useDiscord();

  return (
    <View style={[styles.container, { backgroundColor: colors.serverList }]}>
      <BlurView intensity={30} style={StyleSheet.absoluteFill} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {servers.map((server) => (
          <ServerItem
            key={server.id}
            imageUrl={server.imageUrl}
            isSelected={selectedServer === server.id}
            onPress={() => setSelectedServer(server.id)}
            isHome={server.isHome}
          />
        ))}
        <ServerItem
          onPress={() => {}}
          isSelected={false}
          imageUrl={undefined}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 72,
    height: '100%',
  },
  scroll: {
    flex: 1,
    paddingTop: 8,
  },
  serverItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serverIndicator: {
    width: 4,
    height: 0,
    backgroundColor: 'white',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  serverButton: {
    marginLeft: 8,
  },
  serverIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7289da',
  },
});
