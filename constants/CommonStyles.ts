import { StyleSheet } from 'react-native';

export const CommonStyles = StyleSheet.create({
  // Navigation
  navigationBar: {
    height: 44,
  },
  
  // Lists
  listItem: {
    minHeight: 44,
    paddingHorizontal: 16,
  },
  
  // Buttons
  button: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Forms
  input: {
    height: 44,
    paddingHorizontal: 16,
  },
  
  // Spacing
  standardPadding: {
    padding: 16,
  },
  
  // Borders
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  
  // Shadows
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  }
}); 