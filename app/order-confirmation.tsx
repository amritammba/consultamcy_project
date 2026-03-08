import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/theme';

export default function OrderConfirmationScreen() {
  const { orderId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={64} color={Colors.white} />
        </View>
        
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.message}>
          Thank you for your purchase. Your order has been placed and is currently being processed.
        </Text>
        
        {orderId && (
          <View style={styles.orderIdBox}>
            <Text style={styles.orderIdLabel}>Order ID</Text>
            <Text style={styles.orderIdText}>{orderId}</Text>
          </View>
        )}

      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ordersBtn} onPress={() => router.replace('/(tabs)/orders')}>
          <Text style={styles.ordersBtnText}>View My Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, justifyContent: 'space-between' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl, elevation: 5, shadowColor: Colors.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  title: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md, textAlign: 'center' },
  message: { fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xl },
  orderIdBox: { backgroundColor: Colors.backgroundLight, padding: Spacing.lg, borderRadius: 12, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  orderIdLabel: { fontSize: FontSizes.sm, color: Colors.textMuted, marginBottom: 4 },
  orderIdText: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.primary, letterSpacing: 1 },
  footer: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  homeBtn: { flex: 1, backgroundColor: Colors.primary, paddingVertical: Spacing.lg, borderRadius: 10, alignItems: 'center', marginBottom: Spacing.md },
  homeBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.lg },
  ordersBtn: { flex: 1, backgroundColor: 'transparent', paddingVertical: Spacing.md, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary },
  ordersBtnText: { color: Colors.primary, fontWeight: '700', fontSize: FontSizes.md },
});
