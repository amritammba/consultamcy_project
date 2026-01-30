import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../constants/theme';

export default function ProductCard({
  name,
  school,
  price,
  image,
  onPress,
  onAddToCart,
  onWishlist,
  isWishlisted = false,
}) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="contain" />
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={onWishlist}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={isWishlisted ? Colors.primary : Colors.text}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        <Text style={styles.school} numberOfLines={1}>
          {school}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.price}>₹{price.toLocaleString('en-IN')}</Text>
        <TouchableOpacity style={styles.addToCartBtn} onPress={onAddToCart || onPress}>
          <Ionicons name="cart-outline" size={16} color={Colors.white} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: Colors.backgroundLight,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  details: {
    padding: Spacing.md,
  },
  school: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  addToCartText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
});
