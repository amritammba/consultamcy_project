import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSizes } from '../../constants/theme';
import { collection, query, where, onSnapshot, deleteDoc, doc, addDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';

export default function WishlistScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'wishlist'), where('userId', '==', auth.currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const removeFromWishlist = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'wishlist', itemId));
    } catch (e) {
      console.error('Error removing wishlist item:', e);
    }
  };

  const moveToCart = async (item: any) => {
    if (!auth.currentUser) return;
    try {
      const cartRef = collection(db, 'cart');
      const q = query(cartRef, where('userId', '==', auth.currentUser.uid), where('productId', '==', item.productId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        Alert.alert('Already in Cart', 'This item is already in your cart.');
      } else {
        await addDoc(cartRef, {
          userId: auth.currentUser.uid,
          productId: item.productId,
          name: item.productName,
          price: item.price,
          image: item.imageUrl || '',
          size: '',
          quantity: 1,
          addedAt: new Date(),
        });
        await deleteDoc(doc(db, 'wishlist', item.id));
        router.push('/(tabs)/cart');
      }
    } catch (e) {
      console.error('Error moving to cart:', e);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="heart-outline" size={64} color={Colors.textMuted} />
        <Text style={styles.emptyText}>Please login to view your wishlist</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.shopBtnText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBtn} />
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={styles.headerBtn} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 60 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {items.length > 0 ? (
            <>
              <Text style={styles.count}>{items.length} SAVED {items.length === 1 ? 'ITEM' : 'ITEMS'}</Text>
              {items.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardImage}>
                    <Image
                      source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.cardDetails}>
                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromWishlist(item.id)}>
                      <Ionicons name="heart" size={22} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
                    {item.schoolName && <Text style={styles.schoolName}>{item.schoolName}</Text>}
                    <View style={styles.priceRow}>
                      <Text style={styles.price}>₹{(item.price || 0).toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={styles.moveToCartBtn} onPress={() => moveToCart(item)}>
                        <Ionicons name="cart-outline" size={16} color={Colors.white} />
                        <Text style={styles.moveToCartText}>Move to Cart</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => removeFromWishlist(item.id)}>
                        <Ionicons name="trash-outline" size={20} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={72} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
              <Text style={styles.emptySubtitle}>Save items you love and find them here</Text>
              <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(tabs)/search')}>
                <Text style={styles.shopBtnText}>Browse Products</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: 52, paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerBtn: { padding: Spacing.xs, minWidth: 36 },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  count: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textMuted, marginBottom: Spacing.md, letterSpacing: 0.5 },
  card: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 14, marginBottom: Spacing.lg, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardImage: { width: 110, height: 130, backgroundColor: Colors.backgroundLight },
  image: { width: '100%', height: '100%' },
  cardDetails: { flex: 1, padding: Spacing.md, position: 'relative' },
  removeBtn: { position: 'absolute', top: Spacing.sm, right: Spacing.sm },
  productName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text, marginBottom: 2, paddingRight: 28 },
  schoolName: { fontSize: FontSizes.xs, color: Colors.textMuted, textTransform: 'uppercase', marginBottom: Spacing.xs },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  price: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.primary },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  moveToCartBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, paddingVertical: Spacing.sm, borderRadius: 8, gap: 4 },
  moveToCartText: { color: Colors.white, fontWeight: '600', fontSize: FontSizes.sm },
  deleteBtn: { padding: Spacing.sm, backgroundColor: '#FEE2E2', borderRadius: 8 },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text, marginTop: Spacing.lg },
  emptySubtitle: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.sm, marginBottom: Spacing.xl },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.md, marginBottom: Spacing.xl, textAlign: 'center' },
  shopBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xxl, borderRadius: 10 },
  shopBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.md },
});
