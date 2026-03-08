import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const sampleSchools = [
  { id: 'SCH001', schoolName: 'Vivekananda Vidyalaya', district: 'Tiruppur' },
  { id: 'SCH002', schoolName: 'Sri Sakthi International School', district: 'Erode' },
  { id: 'SCH003', schoolName: 'Little Flower Matric School', district: 'Tiruppur' },
  { id: 'SCH004', schoolName: 'Kongu Vellalar Matric School', district: 'Erode' },
  { id: 'SCH005', schoolName: 'Bharathi Vidya Bhavan', district: 'Tiruppur' },
  { id: 'SCH006', schoolName: 'Velalar Matriculation School', district: 'Erode' },
  { id: 'SCH007', schoolName: 'Amrita Vidyalayam Erode', district: 'Erode' },
];

const sampleProducts = [
  { id: 'PRD001', schoolId: 'SCH001', schoolName: 'Vivekananda Vidyalaya', productName: 'Boys Uniform Set', category: 'School Uniforms', price: 1200, sizes: ['28', '30', '32', '34', '36'], stock: 50 },
  { id: 'PRD002', schoolId: 'SCH001', schoolName: 'Vivekananda Vidyalaya', productName: 'Girls Uniform Set', category: 'School Uniforms', price: 1300, sizes: ['28', '30', '32', '34', '36'], stock: 45 },
  { id: 'PRD003', schoolId: 'SCH002', schoolName: 'Sri Sakthi International School', productName: 'Sports Uniform', category: 'Sportswear', price: 900, sizes: ['28', '30', '32', '34'], stock: 60 },
  { id: 'PRD004', schoolId: 'SCH003', schoolName: 'Little Flower Matric School', productName: 'School Tie', category: 'Accessories', price: 150, sizes: ['Free Size'], stock: 100 },
  { id: 'PRD005', schoolId: 'SCH004', schoolName: 'Kongu Vellalar Matric School', productName: 'School Belt', category: 'Accessories', price: 200, sizes: ['Free Size'], stock: 3 }, // low stock sample
  { id: 'PRD006', schoolId: 'SCH007', schoolName: 'Amrita Vidyalayam Erode', productName: 'School Bag', category: 'Accessories', price: 750, sizes: ['Standard'], stock: 40 },
  { id: 'PRD007', schoolId: 'SCH006', schoolName: 'Velalar Matriculation School', productName: 'Formal Leather Shoes', category: 'Footwear', price: 1450, sizes: ['6', '7', '8', '9', '10'], stock: 0 }, // out of stock sample
];

export default function SeedData() {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const batch = writeBatch(db);

      // Seed Schools
      sampleSchools.forEach(school => {
        const ref = doc(db, 'schools', school.id);
        batch.set(ref, school);
      });

      // Seed Products
      sampleProducts.forEach(product => {
        const ref = doc(db, 'products', product.id);
        batch.set(ref, product);
      });

      await batch.commit();
      Alert.alert('Success', 'Sample schools and products seeded successfully.');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error Seeding Data', error.message);
    } finally {
      setIsSeeding(false);
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
        <Text style={styles.headerTitle}>Seed Sample Data</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Pressing the button below will immediately populate your Cloud Firestore database with sample school and product data, including Amrita Vidyalayam Erode and sample low/out-of-stock items for testing.
        </Text>

        <TouchableOpacity 
          style={styles.seedButton} 
          onPress={handleSeedData} 
          disabled={isSeeding}
        >
          {isSeeding ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color={Colors.white} />
              <Text style={styles.seedText}>Seed Firestore Data</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, backgroundColor: Colors.white, paddingTop: Spacing.xxl + 10 },
  headerBtn: { padding: Spacing.xs, minWidth: 40 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  content: { padding: Spacing.xl, alignItems: 'center' },
  description: { fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.xxl, lineHeight: 24 },
  seedButton: { flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: 16, paddingHorizontal: Spacing.xl, borderRadius: 12, alignItems: 'center', gap: Spacing.md },
  seedText: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '700' },
});
