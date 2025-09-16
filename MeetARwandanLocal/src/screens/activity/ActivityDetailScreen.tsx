import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';

const ActivityDetailScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Ionicons name="information-circle" size={64} color={COLORS.textSecondary} />
        <Text style={styles.placeholderText}>Activity Detail Screen</Text>
        <Text style={styles.placeholderSubtext}>
          Detailed activity information and booking options will be displayed here
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  placeholderText: {
    fontSize: SIZES.title2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ActivityDetailScreen;