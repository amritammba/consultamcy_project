import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, FontSizes } from '../../constants/theme';
import { useProducts, Product } from '../../hooks/useProducts';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function StockManagementScreen() {
    const { products, isLoading } = useProducts();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const updateStock = async (product: Product, newStock: number) => {
        if (newStock < 0) return;
        setUpdatingId(product.id);
        try {
            await updateDoc(doc(db, 'products', product.id), { stock: newStock });
            if (newStock < 5 && newStock > 0) {
                // Background visual alert for low stock but no persistent block
            }
        } catch (error) {
            console.error("Error updating stock:", error);
            Alert.alert("Error", "Could not update stock");
        } finally {
            setUpdatingId(null);
        }
    };

    const renderStockStatus = (stock: number) => {
        if (stock === 0) return <Text style={[styles.statusTag, { color: Colors.error, backgroundColor: Colors.error + '10' }]}>Out of Stock</Text>;
        if (stock < 10) return <Text style={[styles.statusTag, { color: '#D97706', backgroundColor: '#FEF3C7' }]}>Low Stock</Text>;
        return <Text style={[styles.statusTag, { color: Colors.success, backgroundColor: Colors.success + '10' }]}>In Stock</Text>;
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
                <Text style={styles.headerTitle}>Manage Stock</Text>
                <View style={styles.headerBtn} />
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={[styles.card, item.stock < 10 && { borderColor: item.stock === 0 ? Colors.error + '40' : '#FCD34D', borderWidth: 1 }]}>
                        <View style={styles.cardInfo}>
                            <Text style={styles.schoolName} numberOfLines={1}>{item.schoolName || item.schoolId}</Text>
                            <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
                            <View style={styles.statusRow}>
                                <Text style={styles.stockText}>Current Stock: <Text style={{fontWeight: '700'}}>{item.stock}</Text></Text>
                                {renderStockStatus(item.stock)}
                            </View>
                        </View>
                        
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateStock(item, item.stock - 1)} disabled={updatingId === item.id || item.stock === 0}>
                                <Ionicons name="remove" size={20} color={item.stock === 0 ? Colors.textMuted : Colors.error} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateStock(item, item.stock + 1)} disabled={updatingId === item.id}>
                                <Ionicons name="add" size={20} color={Colors.success} />
                            </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity style={styles.outOfStockBtn} onPress={() => updateStock(item, 0)} disabled={updatingId === item.id || item.stock === 0}>
                            <Text style={[styles.outOfStockText, item.stock === 0 && {color: Colors.textMuted}]}>Mark OOS</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.backgroundLight },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, backgroundColor: Colors.white, paddingTop: Spacing.xxl + 10 },
    headerBtn: { padding: Spacing.xs, minWidth: 40 },
    headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
    list: { padding: Spacing.lg },
    card: { backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: 12, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, flexDirection: 'row', alignItems: 'center' },
    cardInfo: { flex: 1 },
    schoolName: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', marginBottom: 2 },
    productName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    stockText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
    statusTag: { fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
    actions: { flexDirection: 'row', gap: Spacing.sm, marginHorizontal: Spacing.md },
    qtyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.backgroundLight, justifyContent: 'center', alignItems: 'center' },
    outOfStockBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.backgroundLight, borderRadius: 8 },
    outOfStockText: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.error },
});
