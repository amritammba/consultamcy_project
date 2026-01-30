import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { productDetail, products } from '../data/products';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedSize, setSelectedSize] = useState('32');

  // Find product by ID from params, fallback to productDetail or first product
  const product = products.find(p => p.id === id) || productDetail;
  // Merge static details if needed (simplified for this demo)
  const displayProduct = { ...productDetail, ...product };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="share-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <Image source={displayProduct.image} style={styles.productImage} resizeMode="contain" />
          <View style={styles.pagination}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
            ))}
          </View>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.schoolName}>{displayProduct.school || 'UNIVERSAL SCHOOL'}</Text>
          <Text style={styles.productName}>{displayProduct.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{displayProduct.rating || 4.5} ({displayProduct.reviews || 80} reviews)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{displayProduct.price?.toLocaleString('en-IN')}</Text>
            {displayProduct.originalPrice && (
              <Text style={styles.originalPrice}>₹{displayProduct.originalPrice.toLocaleString('en-IN')}</Text>
            )}
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{displayProduct.discount || 15}% OFF</Text>
            </View>
          </View>

          <View style={styles.sizeSection}>
            <View style={styles.sizeHeader}>
              <Text style={styles.sizeLabel}>Select Size</Text>
              <TouchableOpacity>
                <Text style={styles.sizeGuide}>Size Guide</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sizeButtons}>
              {(displayProduct.sizes || ['30', '32', '34', '36']).map((size) => (
                <TouchableOpacity key={size} style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]} onPress={() => setSelectedSize(size)}>
                  <Text style={[styles.sizeBtnText, selectedSize === size && styles.sizeBtnTextActive]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.wishlistBtn}>
              <Ionicons name="heart-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addToCartBtn} onPress={() => router.push('/(tabs)/cart')}>
              <Ionicons name="cart-outline" size={20} color={Colors.white} />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Fabric & Care</Text>
            <Text style={styles.infoText}>{displayProduct.fabricCare || "Machine washable. Do not bleach. Tumble dry low."}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Fit & Style</Text>
            <Text style={styles.infoText}>{displayProduct.fitStyle || "Regular fit. Designed for comfort and durability."}</Text>
          </View>
          <View style={styles.certBadge}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            <Text style={styles.certText}>Official School Approved Merchandise</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, paddingTop: Spacing.xxl + 10 },
  headerBtn: { padding: Spacing.xs },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  imageSection: { height: 350, backgroundColor: Colors.backgroundLight, position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  pagination: { position: 'absolute', bottom: Spacing.md, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: Spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: Colors.white, backgroundColor: 'transparent' },
  dotActive: { backgroundColor: Colors.white },
  detailsSection: { padding: Spacing.lg },
  schoolName: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', marginBottom: Spacing.xs },
  productName: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.lg },
  ratingText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  price: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.primary },
  originalPrice: { fontSize: FontSizes.lg, color: Colors.textMuted, textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: Colors.discountBadge, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderRadius: 6 },
  discountText: { fontSize: FontSizes.xs, color: Colors.success, fontWeight: '700' },
  sizeSection: { marginBottom: Spacing.xl },
  sizeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sizeLabel: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.text },
  sizeGuide: { fontSize: FontSizes.md, color: Colors.primary, fontWeight: '600' },
  sizeButtons: { flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap' },
  sizeBtn: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, minWidth: 50, alignItems: 'center' },
  sizeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sizeBtnText: { fontSize: FontSizes.md, color: Colors.text, fontWeight: '500' },
  sizeBtnTextActive: { color: Colors.white, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  wishlistBtn: { width: 56, height: 56, borderRadius: 12, backgroundColor: Colors.backgroundLight, justifyContent: 'center', alignItems: 'center' },
  addToCartBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: 12, gap: Spacing.sm, height: 56 },
  addToCartText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.lg },
  infoSection: { marginBottom: Spacing.xl },
  infoTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  infoText: { fontSize: FontSizes.md, color: Colors.textSecondary, lineHeight: 24 },
  certBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.logoBg, padding: Spacing.lg, borderRadius: 10, gap: Spacing.sm },
  certText: { fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '600', flex: 1 },
});
