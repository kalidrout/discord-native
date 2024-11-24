/**
 * Discord theme colors for both light and dark mode
 */

const discordBlurple = '#5865F2';
const discordGreen = '#57F287';
const discordYellow = '#FEE75C';
const discordFuchsia = '#EB459E';
const discordRed = '#ED4245';

export const Colors = {
  light: {
    text: '#2E3338',
    background: '#FFFFFF',
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
    text: '#DCDDDE',
    background: '#313338',
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
  }
};
