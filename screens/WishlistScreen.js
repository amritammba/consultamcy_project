import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../constants/theme';
import { wishlistItems } from '../data/products';

export default function WishlistScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.getParent()?.navigate('HomeTab')
          }
        >
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.count}>{wishlistItems.length} SAVED ITEMS</Text>
        {wishlistItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardImage}>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
            </View>
            <View style={styles.cardDetails}>
              <View style={styles.wishlistIcon}>
                <Ionicons name="heart" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.price}</Text>
                {item.inStock && (
                  <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>IN STOCK</Text>
                  </View>
                )}
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.moveToCartBtn}
                  onPress={() => navigation.getParent()?.navigate('Cart')}
                >
                  <Text style={styles.moveToCartText}>Move to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color={Colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <View style={styles.checkoutSection}>
          <Text style={styles.checkoutTitle}>Ready to checkout?</Text>
          <Text style={styles.checkoutSubtitle}>
            Items move to your basket instantly
          </Text>
          <TouchableOpacity
            style={styles.moveAllBtn}
            onPress={() => navigation.getParent()?.navigate('Cart')}
          >
            <Text style={styles.moveAllText}>Move All to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
  },
  headerBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  count: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 120,
    backgroundColor: Colors.backgroundLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardDetails: {
    flex: 1,
    padding: Spacing.md,
    position: 'relative',
  },
  wishlistIcon: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  productName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  price: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  stockBadge: {
    backgroundColor: Colors.success,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
  },
  stockText: {
    fontSize: FontSizes.xs,
    color: Colors.white,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  moveToCartBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
  },
  moveToCartText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
  deleteBtn: {
    backgroundColor: Colors.backgroundLight,
    padding: Spacing.sm,
    borderRadius: 8,
  },
  checkoutSection: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  checkoutTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  checkoutSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  moveAllBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl * 2,
    borderRadius: 10,
  },
  moveAllText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSizes.md,
  },
});
