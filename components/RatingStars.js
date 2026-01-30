import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes } from '../constants/theme';

export default function RatingStars({ rating = 0, maxStars = 5, showValue = false }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.container}>
      {Array(fullStars).fill(0).map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={14} color="#FFB800" />
      ))}
      {hasHalfStar && (
        <Ionicons name="star-half" size={14} color="#FFB800" />
      )}
      {Array(emptyStars).fill(0).map((_, i) => (
        <Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#FFB800" />
      ))}
      {showValue && (
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
});
