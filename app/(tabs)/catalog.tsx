import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSizes } from '../../constants/theme';
import ProductCard from '../../components/ProductCard';
import { products } from '../../data/products';

const FILTERS = ['All', 'Boys', 'Girls', 'Primary'];

export default function CatalogScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);

  const toggleWishlist = (id: string) => {
    setWishlistedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>School Uniforms</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(tabs)/cart')}>
          <View>
            <Ionicons name="cart-outline" size={24} color={Colors.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.textMuted} />
        <TextInput style={styles.searchInput} placeholder="Search school or uniform..." placeholderTextColor={Colors.textLight} value={searchQuery} onChangeText={setSearchQuery} />
        <TouchableOpacity>
          <Ionicons name="options-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={styles.filtersContent}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            {filter !== 'All' && <Ionicons name="chevron-down" size={16} color={activeFilter === filter ? Colors.white : Colors.textMuted} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <ProductCard
            name={item.name}
            school={item.school}
            price={item.price}
            image={item.image}
            category={item.category || ''}
            isWishlisted={wishlistedIds.includes(item.id)}
            onWishlist={() => toggleWishlist(item.id)}
            onAddToCart={() => {}}
            onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, backgroundColor: Colors.white },
  headerBtn: { padding: Spacing.xs },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  badge: { position: 'absolute' as const, top: -4, right: -4, backgroundColor: Colors.primary, borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundLight, marginHorizontal: Spacing.lg, marginTop: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: 10, gap: Spacing.sm },
  searchInput: { flex: 1, fontSize: FontSizes.md, color: Colors.text },
  filters: { marginTop: Spacing.lg, maxHeight: 44 },
  filtersContent: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  filterChip: { flexDirection: 'row' as const, alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: 20, backgroundColor: Colors.white, marginRight: Spacing.sm, gap: Spacing.xs },
  filterChipActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: FontSizes.sm, color: Colors.text },
  filterTextActive: { color: Colors.white, fontWeight: '600' },
  grid: { padding: Spacing.lg, paddingBottom: Spacing.xxl * 2 },
  gridRow: { justifyContent: 'space-between' },
});
