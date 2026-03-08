import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal } from 'react-native';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await updateDoc(doc(db, 'orders', selectedOrder.id), { status });
      setSelectedOrder({ ...selectedOrder, status });
      fetchOrders();
    } catch (error) {
      alert("Error updating status");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/admin');
        }}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Orders</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {orders.map(order => (
          <TouchableOpacity 
            key={order.id} 
            style={styles.card}
            onPress={() => { setSelectedOrder(order); setModalVisible(true); }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</Text>
              <Text style={styles.orderMeta}>Total: ₹{order.totalPrice} • {order.phone}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color={Colors.text} /></TouchableOpacity>
            </View>
            
            {selectedOrder && (
              <>
                <View style={styles.detailsBox}>
                  <Text style={styles.detailText}><Text style={{fontWeight: '700'}}>ID:</Text> #{selectedOrder.id}</Text>
                  <Text style={styles.detailText}><Text style={{fontWeight: '700'}}>Total:</Text> ₹{selectedOrder.totalPrice}</Text>
                  <Text style={styles.detailText}><Text style={{fontWeight: '700'}}>Phone:</Text> {selectedOrder.phone}</Text>
                  <Text style={styles.detailText}><Text style={{fontWeight: '700'}}>Address:</Text> {selectedOrder.shippingAddress}</Text>
                </View>

                <Text style={styles.sectionLabel}>Items</Text>
                <View style={styles.itemsBox}>
                  {selectedOrder.products?.map((p: any, idx: number) => (
                    <Text key={idx} style={styles.itemText}>{p.quantity}x {p.name} (Size: {p.size}) - ₹{p.price}</Text>
                  ))}
                </View>

                <Text style={styles.sectionLabel}>Update Status</Text>
                <View style={styles.statusRow}>
                  {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                    <TouchableOpacity 
                      key={s} 
                      style={[styles.statusOption, selectedOrder.status === s && styles.statusOptionActive]}
                      onPress={() => updateStatus(s)}
                    >
                      <Text style={[styles.statusOptionText, selectedOrder.status === s && {color: 'white'}]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, backgroundColor: Colors.white, paddingTop: Spacing.xxl + 10 },
  headerBtn: { padding: Spacing.xs, minWidth: 40 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  content: { padding: Spacing.lg },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: 12, marginBottom: Spacing.md },
  orderId: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  orderMeta: { fontSize: FontSizes.sm, color: Colors.textMuted },
  statusBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.text },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: Spacing.xl },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: '700' },
  detailsBox: { backgroundColor: Colors.backgroundLight, padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.md },
  detailText: { fontSize: FontSizes.md, color: Colors.text, marginBottom: 4 },
  sectionLabel: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.xs, marginTop: Spacing.sm },
  itemsBox: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: Spacing.md, marginBottom: Spacing.lg },
  itemText: { fontSize: FontSizes.md, color: Colors.text, marginBottom: 4 },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.xl },
  statusOption: { borderWidth: 1, borderColor: Colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  statusOptionActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  statusOptionText: { fontSize: FontSizes.sm, color: Colors.text, fontWeight: '600' },
});
