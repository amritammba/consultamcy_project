import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../constants/theme';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../data/products';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Ionicons name="school" size={24} color={Colors.white} />
          </View>
          <Text style={styles.headerTitle}>Prashanthi Uniforms</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.getParent()?.navigate('Cart')}
          >
            <Ionicons name="bag-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Quality Uniforms for Every School</Text>
            <Text style={styles.heroSubtitle}>
              Premium fabrics, perfect fit, durable design.
            </Text>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => navigation.navigate('ProductList')}
            >
              <Text style={styles.heroBtnText}>Shop New Season</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.brandingCard}>
          <View style={styles.brandingLeft}>
            <View style={styles.brandingIcon}>
              <Ionicons name="checkmark-circle" size={28} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.brandingTitle}>Custom Branding</Text>
              <Text style={styles.brandingSubtitle}>School logo embroidery services</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.inquireBtn}>
            <Text style={styles.inquireBtnText}>Inquire</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                icon={cat.icon}
                onPress={() => navigation.navigate('ProductList', { category: cat.name })}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  heroBanner: {
    height: 220,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: 12,
    backgroundColor: '#2F8D8B',
    overflow: 'hidden',
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  heroTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.white,
    marginBottom: Spacing.lg,
    opacity: 0.95,
  },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
  },
  heroBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSizes.md,
  },
  brandingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    padding: Spacing.xl,
    borderRadius: 12,
  },
  brandingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  brandingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  brandingSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  inquireBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
  },
  inquireBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSizes.md,
  },
  categorySection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  viewAll: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  categoryRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
    flexDirection: 'row',
  },
});
