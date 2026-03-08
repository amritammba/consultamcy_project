import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

const TAX_RATE = 0.05;

export default function CartScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'cart'), where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cartData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(cartData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const updateQuantity = async (id: string, currentQty: number, delta: number, productId: string) => {
    const newQty = currentQty + delta;
    try {
      if (newQty <= 0) {
        await deleteDoc(doc(db, 'cart', id));
      } else {
        if (delta > 0 && productId) {
          const productSnap = await getDoc(doc(db, 'products', productId));
          if (productSnap.exists()) {
             const stock = productSnap.data().stock || 0;
             if (newQty > stock) {
                alert("Requested quantity not available.");
                return;
             }
          }
        }
        await updateDoc(doc(db, 'cart', id), { quantity: newQty });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  if (!auth.currentUser) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.textMuted, marginBottom: 10 }}>Please login to view your cart.</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(auth)/login')}>
           <Text style={styles.shopBtnText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({items.length})</Text>
        <View style={styles.headerBtn} />
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {items.length > 0 ? (
            items.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardImage}>
                  <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} resizeMode="contain" />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.attributes}>Size: {item.size} {item.color ? `• ${item.color}` : ''}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.unitPrice}>₹{item.price?.toLocaleString('en-IN')}</Text>
                    {item.quantity > 1 && (
                      <Text style={styles.itemTotal}>Total: ₹{(item.price * item.quantity).toLocaleString('en-IN')}</Text>
                    )}
                  </View>
                  <View style={styles.quantityRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity, -1, item.productId)}>
                      <Ionicons name="remove" size={18} color={Colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity, 1, item.productId)}>
                      <Ionicons name="add" size={18} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCart}>
              <Ionicons name="cart-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Your cart is empty</Text>
              <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(tabs)')}>
                <Text style={styles.shopBtnText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          )}

          {items.length > 0 && (
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (GST 5%)</Text>
                <Text style={styles.summaryValue}>₹{tax.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.deliveryFree}>FREE</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{total.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {items.length > 0 && !loading && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.secureText}>SECURE PAYMENT BY PRASHANTHI UNIFORMS</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, backgroundColor: Colors.white, paddingTop: Spacing.xxl + 10 },
  headerBtn: { padding: Spacing.xs, minWidth: 40 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  content: { padding: Spacing.lg, paddingBottom: 120 },
  card: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 12, marginBottom: Spacing.lg, overflow: 'hidden' },
  cardImage: { width: 90, height: 100, backgroundColor: Colors.backgroundLight },
  image: { width: '100%', height: '100%' },
  cardDetails: { flex: 1, padding: Spacing.md, justifyContent: 'space-between' },
  productName: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.text },
  attributes: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  unitPrice: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.primary },
  itemTotal: { fontSize: FontSizes.xs, fontWeight: '600', color: Colors.textMuted },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.textMuted, justifyContent: 'center', alignItems: 'center' },
  qtyValue: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.text, minWidth: 24, textAlign: 'center' },
  summary: { backgroundColor: Colors.white, borderRadius: 12, padding: Spacing.xl, marginTop: Spacing.md },
  summaryTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  summaryLabel: { fontSize: FontSizes.md, color: Colors.textMuted },
  summaryValue: { fontSize: FontSizes.md, color: Colors.text },
  deliveryFree: { fontSize: FontSizes.md, color: Colors.success, fontWeight: '600' },
  totalRow: { marginTop: Spacing.sm, paddingTop: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border },
  totalLabel: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  totalValue: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.primary },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, padding: Spacing.lg },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryDark, paddingVertical: Spacing.lg, borderRadius: 10, gap: Spacing.sm },
  checkoutBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.lg },
  secureText: { textAlign: 'center', fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: Spacing.sm },
  emptyCart: { alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xxl * 2 },
  emptyText: { fontSize: FontSizes.lg, color: Colors.textMuted, marginTop: Spacing.md, marginBottom: Spacing.xl },
  shopBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: 8 },
  shopBtnText: { color: Colors.white, fontWeight: '600', fontSize: FontSizes.md },
});
