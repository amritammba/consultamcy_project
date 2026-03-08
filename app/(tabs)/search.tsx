import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,
  Modal, ScrollView, ActivityIndicator, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Colors, Spacing, FontSizes } from '../../constants/theme';
import ProductCard from '../../components/ProductCard';
import { auth } from '../../firebaseConfig';
import { addDoc, doc, getDocs, updateDoc, where, query as fbQuery } from 'firebase/firestore';

const CATEGORIES = ['All', 'Shirt', 'Pant', 'Skirt', 'Tie', 'Belt', 'Shoes', 'Socks', 'ID Card', 'Sweater', 'Blazer'];

type Product = {
  id: string;
  productName: string;
  schoolName?: string;
  schoolId?: string;
  category?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  sizes?: string[];
  deliveryDays?: number;
};

type Filters = {
  category: string;
  school: string;
  minPrice: string;
  maxPrice: string;
  size: string;
  maxDeliveryDays: string;
};

const DEFAULT_FILTERS: Filters = {
  category: 'All',
  school: '',
  minPrice: '',
  maxPrice: '',
  size: '',
  maxDeliveryDays: '',
};

export default function SearchScreen() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filterVisible, setFilterVisible] = useState(false);
  const [schools, setSchools] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('productName'));
    const unsub = onSnapshot(q, (snap) => {
      const data: Product[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setAllProducts(data);

      // Build school + size lists
      const schoolSet = new Set<string>();
      const sizeSet = new Set<string>();
      data.forEach(p => {
        if (p.schoolName) schoolSet.add(p.schoolName);
        if (p.sizes) p.sizes.forEach(s => sizeSet.add(s));
      });
      setSchools(Array.from(schoolSet).sort());
      setSizes(Array.from(sizeSet).sort());
      setIsLoading(false);
    }, (err) => {
      console.error('Error loading products:', err);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allProducts.filter(p => {
      // Text search
      if (q) {
        const matchesText =
          (p.productName || '').toLowerCase().includes(q) ||
          (p.schoolName || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q);
        if (!matchesText) return false;
      }
      // Category
      if (filters.category !== 'All' && p.category !== filters.category) return false;
      // School
      if (filters.school && p.schoolName !== filters.school) return false;
      // Price range
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
      // Size
      if (filters.size && !(p.sizes || []).includes(filters.size)) return false;
      // Delivery days
      if (filters.maxDeliveryDays && (p.deliveryDays || 0) > Number(filters.maxDeliveryDays)) return false;
      return true;
    });
  }, [allProducts, searchQuery, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'All') count++;
    if (filters.school) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.size) count++;
    if (filters.maxDeliveryDays) count++;
    return count;
  }, [filters]);

  const handleAddToCart = useCallback(async (product: Product) => {
    if (!auth.currentUser) {
      router.push('/(auth)/login');
      return;
    }
    try {
      const cartRef = collection(db, 'cart');
      const q = fbQuery(cartRef, where('userId', '==', auth.currentUser.uid), where('productId', '==', product.id));
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(doc(db, 'cart', snap.docs[0].id), { quantity: snap.docs[0].data().quantity + 1 });
      } else {
        await addDoc(cartRef, {
          userId: auth.currentUser.uid,
          productId: product.id,
          name: product.productName,
          price: product.price,
          image: product.imageUrl || '',
          size: (product.sizes || [])[0] || '',
          quantity: 1,
          addedAt: new Date(),
        });
      }
      router.push('/(tabs)/cart');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const applyFilters = () => {
    setFilters({ ...pendingFilters });
    setFilterVisible(false);
  };

  const resetFilters = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setFilterVisible(false);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      name={item.productName}
      school={item.schoolName || item.schoolId || ''}
      price={item.price}
      image={{ uri: item.imageUrl || 'https://via.placeholder.com/300' }}
      stock={item.stock}
      category={item.category}
      onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}
      onAddToCart={() => handleAddToCart(item)}
      onWishlist={() => {}}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Products</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, school, category..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => { setPendingFilters({ ...filters }); setFilterVisible(true); }}
        >
          <Ionicons name="options-outline" size={20} color={activeFilterCount > 0 ? Colors.white : Colors.text} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Category quick-filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pills} contentContainerStyle={styles.pillsContent}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.pill, filters.category === cat && styles.pillActive]}
            onPress={() => setFilters(f => ({ ...f, category: cat }))}
          >
            <Text style={[styles.pillText, filters.category === cat && styles.pillTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {isLoading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
        </Text>
        {activeFilterCount > 0 && (
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={56} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubtitle}>Try a different search or adjust filters</Text>
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Products</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

              {/* Category */}
              <Text style={styles.filterLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, pendingFilters.category === cat && styles.chipActive]}
                    onPress={() => setPendingFilters(f => ({ ...f, category: cat }))}
                  >
                    <Text style={[styles.chipText, pendingFilters.category === cat && styles.chipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* School */}
              <Text style={styles.filterLabel}>School</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
                <TouchableOpacity
                  style={[styles.chip, pendingFilters.school === '' && styles.chipActive]}
                  onPress={() => setPendingFilters(f => ({ ...f, school: '' }))}
                >
                  <Text style={[styles.chipText, pendingFilters.school === '' && styles.chipTextActive]}>All Schools</Text>
                </TouchableOpacity>
                {schools.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, pendingFilters.school === s && styles.chipActive]}
                    onPress={() => setPendingFilters(f => ({ ...f, school: s }))}
                  >
                    <Text style={[styles.chipText, pendingFilters.school === s && styles.chipTextActive]} numberOfLines={1}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Price Range */}
              <Text style={styles.filterLabel}>Price Range (₹)</Text>
              <View style={styles.priceRow}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  value={pendingFilters.minPrice}
                  onChangeText={t => setPendingFilters(f => ({ ...f, minPrice: t }))}
                />
                <Text style={styles.priceDash}>–</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  value={pendingFilters.maxPrice}
                  onChangeText={t => setPendingFilters(f => ({ ...f, maxPrice: t }))}
                />
              </View>

              {/* Size */}
              {sizes.length > 0 && (
                <>
                  <Text style={styles.filterLabel}>Size</Text>
                  <View style={styles.chipRow}>
                    <TouchableOpacity
                      style={[styles.chip, pendingFilters.size === '' && styles.chipActive]}
                      onPress={() => setPendingFilters(f => ({ ...f, size: '' }))}
                    >
                      <Text style={[styles.chipText, pendingFilters.size === '' && styles.chipTextActive]}>Any</Text>
                    </TouchableOpacity>
                    {sizes.map(s => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.chip, pendingFilters.size === s && styles.chipActive]}
                        onPress={() => setPendingFilters(f => ({ ...f, size: s }))}
                      >
                        <Text style={[styles.chipText, pendingFilters.size === s && styles.chipTextActive]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Delivery Days */}
              <Text style={styles.filterLabel}>Max Delivery Days</Text>
              <View style={styles.chipRow}>
                {['', '3', '5', '7', '10'].map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.chip, pendingFilters.maxDeliveryDays === d && styles.chipActive]}
                    onPress={() => setPendingFilters(f => ({ ...f, maxDeliveryDays: d }))}
                  >
                    <Text style={[styles.chipText, pendingFilters.maxDeliveryDays === d && styles.chipTextActive]}>
                      {d === '' ? 'Any' : `≤ ${d} days`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
                <Text style={styles.applyBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 56 : 48,
    paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: { flex: 1, fontSize: FontSizes.md, color: Colors.text },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    position: 'relative',
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: { color: Colors.white, fontSize: 9, fontWeight: '700' },
  pills: { backgroundColor: Colors.white, maxHeight: 48, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  pillsContent: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, alignItems: 'center', paddingVertical: Spacing.sm },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pillText: { fontSize: FontSizes.sm, color: Colors.text },
  pillTextActive: { color: Colors.white, fontWeight: '700' },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  resultsText: { fontSize: FontSizes.sm, color: Colors.textMuted, fontWeight: '500' },
  clearText: { fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '600' },
  grid: { padding: Spacing.md, paddingBottom: 100 },
  gridRow: { justifyContent: 'space-between' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text, marginTop: Spacing.md },
  emptySubtitle: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.xs },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text },
  filterLabel: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textMuted, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  priceDash: { fontSize: FontSizes.lg, color: Colors.textMuted },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSizes.sm, color: Colors.text },
  chipTextActive: { color: Colors.white, fontWeight: '700' },
  modalFooter: { flexDirection: 'row', gap: Spacing.md, paddingVertical: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  resetBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  resetBtnText: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.text },
  applyBtn: { flex: 2, paddingVertical: Spacing.md, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center' },
  applyBtnText: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.white },
});
