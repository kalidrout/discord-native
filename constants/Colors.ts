/**
 * Discord theme colors for both light and dark mode
 */

const discordBlurple = '#5865F2';
const discordGreen = '#57F287';
const discordYellow = '#FEE75C';
const discordFuchsia = '#EB459E';
const discordRed = '#ED4245';
const discordGray = '#95a5a6';
const discordBackground = '#36393f';

export const Colors = {
  light: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    secondaryBackground: '#F2F2F7',
    groupedBackground: '#FFFFFF',
    text: '#000000',
    secondaryText: '#6D6D72',
    separator: '#C6C6C8',
    tint: discordBlurple,
    icon: '#747F8D',
    tabIconDefault: '#747F8D',
    tabIconSelected: discordBlurple,
    channelItem: '#EBEDEF',
    serverList: '#F2F3F5',
    messageInput: '#EBEDEF',
    divider: '#E3E5E8',
  },
  dark: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    secondaryBackground: '#1C1C1E',
    groupedBackground: '#1C1C1E',
    text: '#FFFFFF',
    secondaryText: '#8E8E93',
    separator: '#38383A',
    tint: discordBlurple,
    icon: '#B9BBBE',
    tabIconDefault: '#B9BBBE',
    tabIconSelected: discordBlurple,
    channelItem: '#2B2D31',
    serverList: '#1E1F22',
    messageInput: '#383A40',
    divider: '#2D2F32',
  },
  discord: {
    blurple: discordBlurple,
    green: discordGreen,
    yellow: discordYellow,
    fuchsia: discordFuchsia,
    red: discordRed,
    gray: discordGray,
    background: discordBackground,
    messageInput: '#383A40',
    divider: '#26282C',
  }
};
