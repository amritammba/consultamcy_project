import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistDocId, setWishlistDocId] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const docRef = doc(db, 'products', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct({ id: docSnap.id, ...data });
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        // Check if in wishlist
        if (auth.currentUser) {
          checkWishlist(docSnap.id);
        }
      }
    } catch (error) {
      console.error('Error fetching product detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async (productId: string) => {
    if (!auth.currentUser) return;
    try {
      const q = query(
        collection(db, 'wishlist'),
        where('userId', '==', auth.currentUser.uid),
        where('productId', '==', productId)
      );
      const snap = await getDocs(q);
      setWishlistDocId(snap.empty ? null : snap.docs[0].id);
    } catch (e) {
      console.error('Error checking wishlist:', e);
    }
  };

  const handleToggleWishlist = useCallback(async () => {
    if (!auth.currentUser) {
      Alert.alert('Login Required', 'Please login to manage your wishlist.');
      router.push('/(auth)/login');
      return;
    }
    setWishlistLoading(true);
    try {
      if (wishlistDocId) {
        await deleteDoc(doc(db, 'wishlist', wishlistDocId));
        setWishlistDocId(null);
      } else {
        const docRef = await addDoc(collection(db, 'wishlist'), {
          userId: auth.currentUser.uid,
          productId: product.id,
          productName: product.productName,
          schoolName: product.schoolName || '',
          imageUrl: product.imageUrl || '',
          price: product.price,
          addedAt: new Date(),
        });
        setWishlistDocId(docRef.id);
      }
    } catch (e) {
      console.error('Error toggling wishlist:', e);
    } finally {
      setWishlistLoading(false);
    }
  }, [wishlistDocId, product]);

  const handleAddToCart = async () => {
    if (!auth.currentUser) {
      Alert.alert('Login Required', 'Please login to add items to cart.');
      router.push('/(auth)/login');
      return;
    }
    if (product.stock === 0) {
      Alert.alert('Out of Stock', 'This item is out of stock.');
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      Alert.alert('Select Size', 'Please select a size before adding to cart.');
      return;
    }
    if (quantity > product.stock) {
      Alert.alert('Insufficient Stock', `Only ${product.stock} items available.`);
      return;
    }

    setAddingToCart(true);
    try {
      const cartRef = collection(db, 'cart');
      const q = query(
        cartRef,
        where('userId', '==', auth.currentUser.uid),
        where('productId', '==', product.id),
        where('size', '==', selectedSize)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const cartDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'cart', cartDoc.id), {
          quantity: cartDoc.data().quantity + quantity
        });
      } else {
        await addDoc(cartRef, {
          userId: auth.currentUser.uid,
          productId: product.id,
          name: product.productName,
          price: product.price,
          image: product.imageUrl || '',
          size: selectedSize || '',
          quantity: quantity,
          addedAt: new Date(),
        });
      }
      Alert.alert('Added to Cart', `${product.productName} has been added to your cart.`, [
        { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') },
        { text: 'Continue Shopping', style: 'cancel' },
      ]);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
        <Text style={{ color: Colors.textMuted, marginTop: Spacing.md }}>Product not found.</Text>
      </View>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)');
        }}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={handleToggleWishlist} disabled={wishlistLoading}>
          {wishlistLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Ionicons
              name={wishlistDocId ? 'heart' : 'heart-outline'}
              size={24}
              color={wishlistDocId ? Colors.primary : Colors.text}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Product Image */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image' }}
            style={styles.productImage}
            resizeMode="contain"
          />
          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsSection}>
          {/* School + Category badges */}
          <View style={styles.badgeRow}>
            {(product.schoolName || product.schoolId) && (
              <View style={styles.schoolBadge}>
                <Ionicons name="school-outline" size={12} color={Colors.primary} />
                <Text style={styles.schoolBadgeText}>{product.schoolName || product.schoolId}</Text>
              </View>
            )}
            {product.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{product.category}</Text>
              </View>
            )}
          </View>

          <Text style={styles.productName}>{product.productName}</Text>

          {/* Price & Stock */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</Text>
            {isOutOfStock ? (
              <View style={styles.stockBadgeOos}>
                <Text style={styles.stockBadgeOosText}>Out of Stock</Text>
              </View>
            ) : isLowStock ? (
              <View style={styles.stockBadgeLow}>
                <Text style={styles.stockBadgeLowText}>Low Stock ({product.stock} left)</Text>
              </View>
            ) : (
              <View style={styles.stockBadgeIn}>
                <Text style={styles.stockBadgeInText}>In Stock</Text>
              </View>
            )}
          </View>

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            {product.district && (
              <View style={styles.infoCell}>
                <Ionicons name="location-outline" size={16} color={Colors.primary} />
                <Text style={styles.infoCellLabel}>District</Text>
                <Text style={styles.infoCellValue}>{product.district}</Text>
              </View>
            )}
            {product.deliveryDays !== undefined && (
              <View style={styles.infoCell}>
                <Ionicons name="time-outline" size={16} color={Colors.primary} />
                <Text style={styles.infoCellLabel}>Delivery</Text>
                <Text style={styles.infoCellValue}>{product.deliveryDays} days</Text>
              </View>
            )}
          </View>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.sizeSection}>
              <Text style={styles.sizeLabel}>Select Size</Text>
              <View style={styles.sizeButtons}>
                {product.sizes.map((size: string) => (
                  <TouchableOpacity
                    key={size}
                    style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[styles.sizeBtnText, selectedSize === size && styles.sizeBtnTextActive]}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.quantitySection}>
            <Text style={styles.sizeLabel}>Quantity</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={[styles.qtyBtn, quantity <= 1 && { opacity: 0.4 }]}
                onPress={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, quantity >= product.stock && { opacity: 0.4 }]}
                onPress={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >
                <Ionicons name="add" size={20} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.qtyNote}>of {product.stock} available</Text>
            </View>
          </View>

          {/* School approval badge */}
          <View style={styles.certBadge}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            <Text style={styles.certText}>Official School Approved Merchandise</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.wishlistFooterBtn}
          onPress={handleToggleWishlist}
          disabled={wishlistLoading}
        >
          <Ionicons
            name={wishlistDocId ? 'heart' : 'heart-outline'}
            size={24}
            color={wishlistDocId ? Colors.primary : Colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addToCartBtn, (addingToCart || isOutOfStock) && { opacity: 0.6, backgroundColor: isOutOfStock ? Colors.textMuted : Colors.primary }]}
          onPress={handleAddToCart}
          disabled={addingToCart || isOutOfStock}
        >
          {addingToCart ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="cart-outline" size={22} color={Colors.white} />
              <Text style={styles.addToCartText}>
                {isOutOfStock ? 'Out of Stock' : `Add ${quantity} to Cart • ₹${(product.price * quantity).toLocaleString('en-IN')}`}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, paddingTop: 52,
    backgroundColor: Colors.white,
  },
  headerBtn: { padding: Spacing.xs, minWidth: 40, alignItems: 'center' },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  imageSection: { height: 320, backgroundColor: Colors.backgroundLight, position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  outOfStockOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center',
  },
  outOfStockText: { color: Colors.white, fontWeight: '800', fontSize: FontSizes.xl, letterSpacing: 2 },
  detailsSection: { padding: Spacing.lg },
  badgeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm, flexWrap: 'wrap' },
  schoolBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.logoBg, paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: 20,
  },
  schoolBadgeText: { fontSize: FontSizes.xs, color: Colors.primary, fontWeight: '600' },
  categoryBadge: {
    backgroundColor: '#F3F4F6', paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: 20,
  },
  categoryBadgeText: { fontSize: FontSizes.xs, color: Colors.textMuted, fontWeight: '600' },
  productName: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  price: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.primary },
  stockBadgeOos: { backgroundColor: '#FEE2E2', paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: 20 },
  stockBadgeOosText: { fontSize: FontSizes.xs, color: Colors.error, fontWeight: '700' },
  stockBadgeLow: { backgroundColor: '#FEF3C7', paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: 20 },
  stockBadgeLowText: { fontSize: FontSizes.xs, color: '#D97706', fontWeight: '700' },
  stockBadgeIn: { backgroundColor: '#D1FAE5', paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: 20 },
  stockBadgeInText: { fontSize: FontSizes.xs, color: Colors.success, fontWeight: '700' },
  infoGrid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  infoCell: {
    flex: 1, backgroundColor: Colors.backgroundLight, borderRadius: 12, padding: Spacing.md, alignItems: 'center', gap: 4,
  },
  infoCellLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, fontWeight: '600' },
  infoCellValue: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.text },
  sizeSection: { marginBottom: Spacing.xl },
  sizeLabel: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  sizeButtons: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  sizeBtn: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: 8,
    borderWidth: 1.5, borderColor: Colors.border, minWidth: 48, alignItems: 'center',
  },
  sizeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sizeBtnText: { fontSize: FontSizes.md, color: Colors.text, fontWeight: '600' },
  sizeBtnTextActive: { color: Colors.white, fontWeight: '700' },
  quantitySection: { marginBottom: Spacing.xl },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  qtyBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  qtyValue: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text, minWidth: 32, textAlign: 'center' },
  qtyNote: { fontSize: FontSizes.xs, color: Colors.textMuted, marginLeft: Spacing.xs },
  certBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.logoBg,
    padding: Spacing.md, borderRadius: 10, gap: Spacing.sm,
  },
  certText: { fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '600', flex: 1 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: Spacing.md,
    backgroundColor: Colors.white, padding: Spacing.lg,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  wishlistFooterBtn: {
    width: 52, height: 52, borderRadius: 12, borderWidth: 1.5,
    borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  addToCartBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: 12, gap: Spacing.sm, height: 52,
  },
  addToCartText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.md },
});
