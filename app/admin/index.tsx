import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ schools: 0, products: 0, orders: 0, users: 0, lowStock: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [sSnap, pSnap, oSnap, uSnap] = await Promise.all([
        getDocs(collection(db, 'schools')),
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'users'))
      ]);
      const pDocs = pSnap.docs.map(d => d.data());
      const lowStockCount = pDocs.filter(p => p.stock !== undefined && p.stock < 10).length;

      setStats({
        schools: sSnap.size,
        products: pSnap.size,
        orders: oSnap.size,
        users: uSnap.size,
        lowStock: lowStockCount
      });
    } catch (error) {
      console.error(error);
    }
  };

  const menuItems = [
    { title: 'Manage Schools', icon: 'school-outline', route: '/admin/schools', color: '#4F46E5' },
    { title: 'Manage Products', icon: 'shirt-outline', route: '/admin/products', color: '#EC4899' },
    { title: 'Manage Stock', icon: 'cube-outline', route: '/admin/stock', color: '#EAB308' },
    { title: 'Manage Orders', icon: 'bag-check-outline', route: '/admin/orders', color: '#10B981' },
    { title: 'Seed Sample Data', icon: 'cloud-upload-outline', route: '/admin/seed', color: '#64748B' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.replace('/(tabs)/profile')}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Schools</Text>
            <Text style={[styles.statValue, {color: '#4F46E5'}]}>{stats.schools}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Products</Text>
            <Text style={[styles.statValue, {color: '#EC4899'}]}>{stats.products}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Orders</Text>
            <Text style={[styles.statValue, {color: '#10B981'}]}>{stats.orders}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Users</Text>
            <Text style={[styles.statValue, {color: '#8B5CF6'}]}>{stats.users}</Text>
          </View>
          <View style={[styles.statCard, stats.lowStock > 0 && {backgroundColor: '#FEF2F2', borderColor: '#FECACA', borderWidth: 1}]}>
            <Text style={styles.statLabel}>Low Stock</Text>
            <Text style={[styles.statValue, {color: stats.lowStock > 0 ? '#DC2626' : '#10B981'}]}>{stats.lowStock}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Admin Controls</Text>
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem} 
              onPress={() => router.push(item.route)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, backgroundColor: Colors.white, paddingTop: Spacing.xxl + 10 },
  headerBtn: { padding: Spacing.xs, minWidth: 40 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  content: { padding: Spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: Spacing.xl },
  statCard: { width: '48%', backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: 12, marginBottom: Spacing.md, alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statLabel: { fontSize: FontSizes.sm, color: Colors.textMuted, fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: FontSizes.xxl, fontWeight: '800' },
  sectionTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textMuted, marginBottom: Spacing.md, marginLeft: Spacing.xs },
  menuList: { backgroundColor: Colors.white, borderRadius: 12, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  iconBox: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  menuText: { flex: 1, fontSize: FontSizes.md, fontWeight: '600', color: Colors.text },
});
