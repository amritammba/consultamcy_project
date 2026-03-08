import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSizes } from '../../constants/theme';
import { useOrders, Order } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';

export default function MyOrdersScreen() {
  const { user } = useAuth();
  const { orders, isLoading } = useOrders(true);

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.textMuted }}>Please login to view orders.</Text>
      </View>
    );
  }

  const renderOrderStatus = (status: Order['status']) => {
    let color = Colors.primary;
    let icon = 'time-outline';

    switch (status) {
      case 'Shipped':
        color = '#3B82F6'; // blue
        icon = 'airplane-outline';
        break;
      case 'Delivered':
        color = Colors.success;
        icon = 'checkmark-circle-outline';
        break;
      case 'Processing':
      default:
        color = '#F59E0B'; // amber
        icon = 'time-outline';
        break;
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={16} color={color} style={{ marginRight: 4 }} />
        <Text style={[styles.statusText, { color }]}>{status}</Text>
      </View>
    );
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const date = new Date(item.orderDate);
    const dateString = date instanceof Date && !isNaN(date.valueOf()) ? date.toLocaleDateString() : 'Unknown Date';

    return (
      <TouchableOpacity 
        style={styles.orderCard} 
        onPress={() => router.push({ pathname: '/order-detail', params: { id: item.id } })}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order #{item.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{dateString}</Text>
        </View>
        
        <View style={styles.orderDetails}>
          <View style={{ flex: 1 }}>
             <Text style={styles.itemsText} numberOfLines={1}>
                {item.products.length} {item.products.length === 1 ? 'item' : 'items'} • ₹{item.totalPrice.toLocaleString('en-IN')}
             </Text>
             <Text style={styles.productNames} numberOfLines={2}>
                {item.products.map((p: any) => p.name).join(', ')}
             </Text>
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            {renderOrderStatus(item.status)}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.headerBtn} />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="bag-remove-outline" size={64} color={Colors.textMuted} />
              <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
              <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(tabs)')}>
                <Text style={styles.shopBtnText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={renderOrderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, backgroundColor: Colors.white, paddingTop: Spacing.xxl + 10 },
  headerBtn: { padding: Spacing.xs, minWidth: 40 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  listContainer: { padding: Spacing.lg },
  orderCard: { backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: 12, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.borderLight, paddingBottom: Spacing.sm, marginBottom: Spacing.sm },
  orderId: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.text },
  orderDate: { fontSize: FontSizes.sm, color: Colors.textMuted },
  orderDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemsText: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.text, marginBottom: 2 },
  productNames: { fontSize: FontSizes.sm, color: Colors.textMuted },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: FontSizes.xs, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.md, marginBottom: Spacing.xl },
  shopBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: 8 },
  shopBtnText: { color: Colors.white, fontWeight: '600', fontSize: FontSizes.md },
});
