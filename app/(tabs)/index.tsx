import { StyleSheet, View } from 'react-native';
import { ServerList } from '../../components/ServerList';
import ChannelList from '../../components/ChannelList';
import { ChatInterface } from '../../components/ChatInterface';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function TabOneScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <View style={styles.content}>
        <ServerList />
        <ChannelList />
        <ChatInterface 
          visible={showChat}
          onClose={() => setShowChat(false)}
          user={selectedUser}
        />
      </View>
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
});
