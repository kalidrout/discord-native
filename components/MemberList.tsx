import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { User } from '../types/types';

interface MemberListProps {
  members: User[];
}

export function MemberList({ members }: MemberListProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.secondaryText }]}>MEMBERS — {members.length}</Text>
      <ScrollView>
        {members.map((member) => (
          <View key={member.id} style={styles.memberItem}>
            {member.avatar ? (
              <Image source={{ uri: member.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.messageInput }]}>
                <Text style={{ color: colors.text }}>{member.username[0]}</Text>
              </View>
            )}
            <View style={styles.memberInfo}>
              <Text style={[styles.username, { color: colors.text }]}>{member.username}</Text>
              <Text style={[styles.discriminator, { color: colors.secondaryText }]}>
                #{member.discriminator}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    borderLeftWidth: 1,
    borderLeftColor: Colors.discord.divider,
  },
  header: {
    fontSize: 12,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
  discriminator: {
    fontSize: 12,
  },
});
