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
import { cartItems } from '../data/products';

const SUBTOTAL = 2300;
const TAX = 115;
const DELIVERY = 0;
const TOTAL = 2415;

export default function CartScreen({ navigation }) {
  const [items, setItems] = useState(
    cartItems.map((i) => ({ ...i, quantity: 1 }))
  );

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

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
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={styles.headerBtn} />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {items.filter((i) => i.quantity > 0).map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardImage}>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.attributes}>
                Size: {item.size} • {item.color}
              </Text>
              <Text style={styles.price}>₹{item.price.toLocaleString('en-IN')}</Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Ionicons name="remove" size={18} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Ionicons name="add" size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{SUBTOTAL.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (GST 5%)</Text>
            <Text style={styles.summaryValue}>₹{TAX.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.deliveryFree}>FREE</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{TOTAL.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.secureText}>SECURE PAYMENT BY PRASHANTHI UNIFORMS</Text>
      </View>
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
    minWidth: 40,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  cardImage: {
    width: 90,
    height: 100,
    backgroundColor: Colors.backgroundLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardDetails: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  attributes: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  price: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyValue: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  summary: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.xl,
    marginTop: Spacing.md,
  },
  summaryTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
  },
  summaryValue: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  deliveryFree: {
    fontSize: FontSizes.md,
    color: Colors.success,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  totalValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    paddingVertical: Spacing.lg,
    borderRadius: 10,
    gap: Spacing.sm,
  },
  checkoutBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSizes.lg,
  },
  secureText: {
    textAlign: 'center',
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});
