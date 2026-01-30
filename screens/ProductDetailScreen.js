import React, { useState } from 'react';
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
import { productDetail } from '../data/products';

export default function ProductDetailScreen({ navigation, route }) {
  const [selectedSize, setSelectedSize] = useState('S');
  const product = route?.params?.product || {
    image: require('../assets/images/react-logo.png'),
    name: productDetail.name,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Uniform Details</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="share-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <Image
            source={product.image || require('../assets/images/react-logo.png')}
            style={styles.productImage}
            resizeMode="contain"
          />
          <View style={styles.pagination}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={[styles.dot, i === 1 && styles.dotActive]}
              />
            ))}
          </View>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.productName}>{productDetail.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{productDetail.price.toLocaleString('en-IN')}</Text>
            <Text style={styles.originalPrice}>₹{productDetail.originalPrice.toLocaleString('en-IN')}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{productDetail.discount}% OFF</Text>
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
              {productDetail.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeBtn,
                    selectedSize === size && styles.sizeBtnActive,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeBtnText,
                      selectedSize === size && styles.sizeBtnTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.wishlistBtn}>
              <Ionicons name="heart-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addToCartBtn}
              onPress={() => navigation.getParent()?.navigate('Cart')}
            >
              <Ionicons name="cart-outline" size={20} color={Colors.white} />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Fabric & Care</Text>
            <Text style={styles.infoText}>{productDetail.fabricCare}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Fit & Style</Text>
            <Text style={styles.infoText}>{productDetail.fitStyle}</Text>
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
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  headerBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  imageSection: {
    height: 280,
    backgroundColor: Colors.backgroundLight,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  dotActive: {
    backgroundColor: Colors.white,
  },
  detailsSection: {
    padding: Spacing.lg,
  },
  productName: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  price: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: Colors.discountBadge,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 6,
  },
  discountText: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    fontWeight: '600',
  },
  sizeSection: {
    marginBottom: Spacing.xl,
  },
  sizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sizeLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  sizeGuide: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '500',
  },
  sizeButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sizeBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sizeBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sizeBtnText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
  sizeBtnTextActive: {
    color: Colors.white,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  wishlistBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    gap: Spacing.sm,
  },
  addToCartText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSizes.md,
  },
  infoSection: {
    marginBottom: Spacing.xl,
  },
  infoTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.logoBg,
    padding: Spacing.lg,
    borderRadius: 10,
    gap: Spacing.sm,
  },
  certText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '500',
  },
});
