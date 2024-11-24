import { StyleSheet, View } from 'react-native';
import { ServerList } from '../../components/ServerList';
import ChannelList from '../../components/ChannelList';
import { ChatInterface } from '../../components/ChatInterface';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function TabOneScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <ServerList />
        <ChannelList />
        <ChatInterface />
      </View>
    </View>
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
