import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { collection, query, where, getDocs, addDoc, doc, writeBatch, increment, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const TAX_RATE = 0.05;

export default function CheckoutScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    if (!auth.currentUser) return;
    try {
      const q = query(collection(db, 'cart'), where('userId', '==', auth.currentUser.uid));
      const snapshot = await getDocs(q);
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!address || !phone) {
      alert("Please enter delivery address and phone number.");
      return;
    }
    
    setPlacingOrder(true);
    try {
      // 1. Create order
      const orderData = {
        userId: auth.currentUser?.uid,
        products: items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size
        })),
        totalPrice: total,
        status: 'Processing',
        orderDate: new Date(),
        shippingAddress: address,
        phone: phone,
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      const orderId = docRef.id;

      const batch = writeBatch(db);

      // Verify stock & Decrement products
      for (const item of items) {
         const pSnap = await getDoc(doc(db, 'products', item.productId));
         if (pSnap.exists()) {
             const currentStock = pSnap.data().stock || 0;
             if (item.quantity > currentStock) {
                 alert(`Requested quantity not available for ${item.name}. Only ${currentStock} left.`);
                 setPlacingOrder(false);
                 return;
             }
         }
         batch.update(doc(db, 'products', item.productId), {
             stock: increment(-item.quantity)
         });
         batch.delete(doc(db, 'cart', item.id));
      }
      
      await batch.commit();

      // 3. Navigate to confirmation
      router.replace({ pathname: '/order-confirmation', params: { orderId } });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)/cart');
        }}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Address</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              multiline
              placeholder="Enter your delivery address"
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOption}>
            <Ionicons name="cash-outline" size={24} color={Colors.primary} />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
            <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({items.length})</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: Spacing.sm }]}>
            <Text style={styles.totalLabel}>Total to Pay</Text>
            <Text style={styles.totalValue}>₹{total.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.placeBtn, placingOrder && {opacity: 0.7}]} 
          onPress={handlePlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.placeBtnText}>Place Order (₹{total.toLocaleString('en-IN')})</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, backgroundColor: Colors.white, paddingTop: Spacing.xxl + 10 },
  headerBtn: { padding: Spacing.xs, minWidth: 40 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  content: { padding: Spacing.lg, paddingBottom: 100 },
  section: { backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: 12, marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSizes.sm, color: Colors.textMuted, marginBottom: Spacing.xs },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: Spacing.md, fontSize: FontSizes.md, backgroundColor: Colors.backgroundLight },
  paymentOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundLight, padding: Spacing.md, borderRadius: 8, borderWidth: 1, borderColor: Colors.primary },
  paymentText: { flex: 1, fontSize: FontSizes.md, fontWeight: '600', color: Colors.text, marginLeft: Spacing.sm },
  summary: { backgroundColor: Colors.white, borderRadius: 12, padding: Spacing.lg },
  summaryTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: FontSizes.md, color: Colors.textMuted },
  summaryValue: { fontSize: FontSizes.md, color: Colors.text },
  totalLabel: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  totalValue: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.primary },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, padding: Spacing.lg },
  placeBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.lg, borderRadius: 10, alignItems: 'center' },
  placeBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.lg },
});
