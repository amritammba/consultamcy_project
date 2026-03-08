import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const docRef = doc(db, 'orders', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.textMuted }}>Order not found.</Text>
      </View>
    );
  }

  const renderStatus = (status: string) => {
    let color = Colors.primary;
    switch (status) {
      case 'Shipped': color = '#3B82F6'; break;
      case 'Delivered': color = Colors.success; break;
      case 'Cancelled': color = Colors.error; break;
      default: color = '#F59E0B'; break; // Processing/Amber
    }
    return (
      <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.statusText, { color }]}>{status}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)/orders');
        }}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.orderHead}>
          <View>
            <Text style={styles.orderLabel}>Order ID</Text>
            <Text style={styles.orderValue}>#{order.id.toUpperCase()}</Text>
          </View>
          {renderStatus(order.status)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order Date</Text>
            <Text style={styles.summaryValue}>{order.orderDate?.toDate().toLocaleDateString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={[styles.summaryValue, { color: Colors.primary, fontWeight: '800' }]}>₹{order.totalPrice?.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Details</Text>
          <Text style={styles.shippingText}>{order.shippingAddress}</Text>
          <Text style={styles.shippingText}>Phone: {order.phone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.products?.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>Size: {item.size} • Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.homeBtnText}>Continue Shopping</Text>
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
  orderHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: 12, marginBottom: Spacing.md },
  orderLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  orderValue: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.text, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: FontSizes.xs, fontWeight: '800' },
  section: { backgroundColor: Colors.white, borderRadius: 12, padding: Spacing.lg, marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, paddingBottom: Spacing.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  summaryLabel: { fontSize: FontSizes.sm, color: Colors.textMuted },
  summaryValue: { fontSize: FontSizes.sm, color: Colors.text, fontWeight: '600' },
  shippingText: { fontSize: FontSizes.sm, color: Colors.text, lineHeight: 20 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.text },
  itemMeta: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  itemPrice: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.text },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.lg, backgroundColor: Colors.white },
  homeBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.lg, borderRadius: 10, alignItems: 'center' },
  homeBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.md },
});
