import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSizes } from '../constants/theme';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useSchools } from '../hooks/useSchools';

export default function ProductListScreen() {
  const params = useLocalSearchParams<{ category?: string, schoolId?: string, schoolName?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [filterSchool, setFilterSchool] = useState(params.schoolId || '');
  const [filterCategory, setFilterCategory] = useState(params.category || '');
  const [filterSize, setFilterSize] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  
  const { products, isLoading: productsLoading } = useProducts();
  const { schools } = useSchools();

  const title = params?.schoolName || 'Uniforms & Accessories';

  const toggleWishlist = (id: string) => {
    setWishlistedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  const sizesList = ['28', '30', '32', '34', '36', 'S', 'M', 'L', 'XL', 'Free Size'];

  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase();
    
    // Search Criteria
    const matchesSearch = !q || 
      p.productName?.toLowerCase().includes(q) || 
      p.schoolName?.toLowerCase().includes(q) || 
      p.category?.toLowerCase().includes(q);
      
    // Filter Criteria
    const matchesSchool = !filterSchool || p.schoolId === filterSchool;
    const matchesCategory = !filterCategory || p.category === filterCategory;
    const matchesSize = !filterSize || (p.sizes && p.sizes.includes(filterSize));
    const matchesPrice = !maxPrice || p.price <= maxPrice;

    return matchesSearch && matchesSchool && matchesCategory && matchesSize && matchesPrice;
  });

  const clearFilters = () => {
    setFilterSchool('');
    setFilterCategory('');
    setFilterSize('');
    setMaxPrice('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)');
        }}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(tabs)/cart')}>
          <View>
            <Ionicons name="cart-outline" size={24} color={Colors.text} />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.textMuted} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search products, schools..." 
          placeholderTextColor={Colors.textLight} 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="color-filter-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal visible={isFilterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.filterSectionTitle}>School</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                <TouchableOpacity 
                   style={[styles.filterChip, !filterSchool && styles.filterChipActive]} 
                   onPress={() => setFilterSchool('')}>
                  <Text style={[styles.filterText, !filterSchool && styles.filterTextActive]}>All</Text>
                </TouchableOpacity>
                {schools.map(school => (
                  <TouchableOpacity 
                    key={school.id} 
                    style={[styles.filterChip, filterSchool === school.id && styles.filterChipActive]} 
                    onPress={() => setFilterSchool(school.id)}>
                    <Text style={[styles.filterText, filterSchool === school.id && styles.filterTextActive]}>
                      {school.schoolName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.filterSectionTitle}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                <TouchableOpacity 
                   style={[styles.filterChip, !filterCategory && styles.filterChipActive]} 
                   onPress={() => setFilterCategory('')}>
                  <Text style={[styles.filterText, !filterCategory && styles.filterTextActive]}>All</Text>
                </TouchableOpacity>
                {categories.map(cat => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[styles.filterChip, filterCategory === cat && styles.filterChipActive]} 
                    onPress={() => setFilterCategory(cat)}>
                    <Text style={[styles.filterText, filterCategory === cat && styles.filterTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.filterSectionTitle}>Size</Text>
              <View style={styles.sizeGrid}>
                {sizesList.map(size => (
                  <TouchableOpacity 
                    key={size}
                    style={[styles.sizeOption, filterSize === size && styles.sizeOptionActive]}
                    onPress={() => setFilterSize(filterSize === size ? '' : size)}
                  >
                    <Text style={[styles.sizeOptionText, filterSize === size && styles.sizeOptionTextActive]}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.filterSectionTitle}>Max Price (₹)</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Ex. 1500"
                keyboardType="numeric"
                value={maxPrice.toString()}
                onChangeText={(val) => setMaxPrice(val ? Number(val) : '')}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.applyBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {productsLoading ? (
         <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 50, color: Colors.textMuted}}>No products match your filters.</Text>}
          renderItem={({ item }) => (
            <ProductCard
              name={item.productName}
              category={item.category}
              school={item.schoolName || item.schoolId}
              price={item.price}
              stock={item.stock}
              image={{ uri: item.imageURL || 'https://via.placeholder.com/150' }}
              isWishlisted={wishlistedIds.includes(item.id)}
              onWishlist={() => toggleWishlist(item.id)}
              onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}
              onAddToCart={() => router.push('/(tabs)/cart')}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, backgroundColor: Colors.white, paddingTop: Spacing.xxl },
  headerBtn: { padding: Spacing.xs },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text, flex: 1, textAlign: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, marginHorizontal: Spacing.lg, marginTop: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: 12, gap: Spacing.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, fontSize: FontSizes.md, color: Colors.text },
  grid: { padding: Spacing.lg, paddingBottom: Spacing.xxl * 2 },
  gridRow: { justifyContent: 'space-between' },
  
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.xl, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text },
  modalScroll: { flexGrow: 0 },
  filterSectionTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.textSecondary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  chipScroll: { paddingBottom: Spacing.xs },
  filterChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 20, backgroundColor: Colors.backgroundLight, marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.borderLight },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  filterTextActive: { color: Colors.white, fontWeight: '600' },
  sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  sizeOption: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  sizeOptionActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}10` },
  sizeOptionText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  sizeOptionTextActive: { color: Colors.primary, fontWeight: '600' },
  priceInput: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: Spacing.md, fontSize: FontSizes.md, color: Colors.text },
  modalFooter: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  clearBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  clearBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: FontSizes.md },
  applyBtn: { flex: 2, backgroundColor: Colors.primary, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: 12 },
  applyBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.md },
});
