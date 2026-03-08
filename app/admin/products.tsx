import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput,
  Modal, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert
} from 'react-native';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../../firebaseConfig';

const CATEGORIES = ['Shirt', 'Pant', 'Skirt', 'Tie', 'Belt', 'Shoes', 'Socks', 'ID Card', 'Sweater', 'Blazer'];

const EMPTY_FORM = {
  productName: '',
  schoolName: '',
  district: '',
  category: 'Shirt',
  price: '',
  sizes: '',
  stock: '0',
  deliveryDays: '7',
  imageUrl: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('productName'));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
  };

  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        productName: product.productName || '',
        schoolName: product.schoolName || '',
        district: product.district || '',
        category: product.category || 'Shirt',
        price: String(product.price || 0),
        sizes: product.sizes ? product.sizes.join(', ') : '',
        stock: String(product.stock ?? 0),
        deliveryDays: String(product.deliveryDays ?? 7),
        imageUrl: product.imageUrl || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({ ...EMPTY_FORM });
    }
    setModalVisible(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setFormData(f => ({ ...f, imageUrl: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    if (!formData.productName.trim()) {
      Alert.alert('Validation Error', 'Product name is required.');
      return;
    }
    setIsSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (finalImageUrl.startsWith('file://')) {
        const response = await fetch(finalImageUrl);
        const blob = await response.blob();
        const filename = finalImageUrl.substring(finalImageUrl.lastIndexOf('/') + 1);
        const storageRef = ref(storage, `products/${Date.now()}_${filename}`);
        await uploadBytes(storageRef, blob);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const payload = {
        productName: formData.productName.trim(),
        schoolName: formData.schoolName.trim(),
        district: formData.district.trim(),
        category: formData.category,
        price: Number(formData.price) || 0,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        stock: Number(formData.stock) || 0,
        deliveryDays: Number(formData.deliveryDays) || 7,
        imageUrl: finalImageUrl,
        updatedAt: new Date(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), payload);
      } else {
        await addDoc(collection(db, 'products'), { ...payload, createdAt: new Date() });
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (prod: any) => {
    Alert.alert('Delete Product', `Are you sure you want to delete "${prod.productName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'products', prod.id));
            fetchData();
          } catch {
            Alert.alert('Error', 'Failed to delete product.');
          }
        }
      }
    ]);
  };

  const filteredProducts = products.filter(p =>
    !searchQuery ||
    (p.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.schoolName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const setField = (key: keyof typeof EMPTY_FORM, value: string) =>
    setFormData(f => ({ ...f, [key]: value }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/admin');
        }}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Products</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => openModal()}>
          <Ionicons name="add-circle" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.count}>{filteredProducts.length} products</Text>
        {filteredProducts.map(prod => (
          <View key={prod.id} style={styles.card}>
            {prod.imageUrl ? (
              <Image source={{ uri: prod.imageUrl }} style={styles.cardImage} />
            ) : (
              <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                <Ionicons name="shirt-outline" size={24} color={Colors.textMuted} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.prodName} numberOfLines={1}>{prod.productName}</Text>
              <Text style={styles.prodMeta} numberOfLines={1}>{prod.schoolName} • {prod.district}</Text>
              <View style={styles.prodBadgeRow}>
                <Text style={styles.prodCategory}>{prod.category}</Text>
                <Text style={styles.prodPrice}>₹{prod.price}</Text>
                <View style={[styles.stockTag, prod.stock === 0 && styles.stockTagOos, prod.stock > 0 && prod.stock < 10 && styles.stockTagLow]}>
                  <Text style={[styles.stockTagText, prod.stock === 0 && { color: Colors.error }, prod.stock > 0 && prod.stock < 10 && { color: '#D97706' }]}>
                    {prod.stock === 0 ? 'OOS' : `${prod.stock} in stock`}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openModal(prod)} style={styles.actionBtn}>
                <Ionicons name="pencil" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(prod)} style={styles.actionBtn}>
                <Ionicons name="trash" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} bounces={false} showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingProduct ? 'Edit Product' : 'Add Product'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Product Name *</Text>
            <TextInput style={styles.input} value={formData.productName} onChangeText={t => setField('productName', t)} placeholder="e.g. Boys White Uniform Shirt" />

            <Text style={styles.label}>School Name</Text>
            <TextInput style={styles.input} value={formData.schoolName} onChangeText={t => setField('schoolName', t)} placeholder="e.g. Sri Vidya Mandir School" />

            <Text style={styles.label}>District</Text>
            <TextInput style={styles.input} value={formData.district} onChangeText={t => setField('district', t)} placeholder="e.g. Tiruppur / Erode" />

            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, formData.category === cat && styles.catChipActive]}
                  onPress={() => setField('category', cat)}
                >
                  <Text style={[styles.catChipText, formData.category === cat && styles.catChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Price (₹) *</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={formData.price} onChangeText={t => setField('price', t)} placeholder="0" />

            <Text style={styles.label}>Sizes (comma-separated)</Text>
            <TextInput style={styles.input} value={formData.sizes} onChangeText={t => setField('sizes', t)} placeholder="S, M, L, XL or 32, 34, 36" />

            <View style={styles.rowInputs}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Stock</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={formData.stock} onChangeText={t => setField('stock', t)} />
              </View>
              <View style={{ width: Spacing.md }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Delivery Days</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={formData.deliveryDays} onChangeText={t => setField('deliveryDays', t)} />
              </View>
            </View>

            <Text style={styles.label}>Product Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {formData.imageUrl ? (
                <Image source={{ uri: formData.imageUrl }} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={36} color={Colors.textMuted} />
                  <Text style={styles.imagePlaceholderText}>Tap to Upload Image</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Image URL (or paste a link)</Text>
            <TextInput
              style={styles.input}
              value={formData.imageUrl.startsWith('file://') ? '(local file selected)' : formData.imageUrl}
              onChangeText={t => !t.startsWith('(') && setField('imageUrl', t)}
              placeholder="https://..."
              editable={!formData.imageUrl.startsWith('file://')}
            />

            <TouchableOpacity
              style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.saveBtnText}>{editingProduct ? 'Save Changes' : 'Add Product'}</Text>
              )}
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg,
    backgroundColor: Colors.white, paddingTop: Spacing.xxl + 10,
  },
  headerBtn: { padding: Spacing.xs, minWidth: 40 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.white, marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm, marginBottom: Spacing.xs,
    padding: Spacing.md, borderRadius: 10, borderWidth: 1, borderColor: Colors.borderLight,
  },
  searchInput: { flex: 1, fontSize: FontSizes.md, color: Colors.text },
  content: { padding: Spacing.lg },
  count: { fontSize: FontSizes.xs, color: Colors.textMuted, fontWeight: '600', marginBottom: Spacing.sm, textTransform: 'uppercase' },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    padding: Spacing.md, borderRadius: 12, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  cardImage: { width: 60, height: 60, borderRadius: 8, marginRight: Spacing.md },
  cardImagePlaceholder: { backgroundColor: Colors.backgroundLight, justifyContent: 'center', alignItems: 'center' },
  prodName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text },
  prodMeta: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 1 },
  prodBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 4 },
  prodCategory: { fontSize: FontSizes.xs, color: Colors.primary, fontWeight: '600' },
  prodPrice: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.text },
  stockTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: '#D1FAE5' },
  stockTagOos: { backgroundColor: '#FEE2E2' },
  stockTagLow: { backgroundColor: '#FEF3C7' },
  stockTagText: { fontSize: 10, fontWeight: '700', color: Colors.success },
  actions: { flexDirection: 'row', gap: Spacing.xs },
  actionBtn: { padding: Spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.xl, maxHeight: '92%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text },
  label: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.3 },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: Spacing.md,
    marginBottom: Spacing.md, fontSize: FontSizes.md, color: Colors.text, backgroundColor: Colors.white,
  },
  rowInputs: { flexDirection: 'row' },
  catChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border, marginRight: Spacing.sm, marginBottom: Spacing.sm,
  },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catChipText: { fontSize: FontSizes.sm, color: Colors.text },
  catChipTextActive: { color: Colors.white, fontWeight: '700' },
  imagePicker: {
    borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: 10, height: 160, overflow: 'hidden', marginBottom: Spacing.md,
  },
  previewImage: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.backgroundLight },
  imagePlaceholderText: { color: Colors.textMuted, marginTop: Spacing.sm, fontSize: FontSizes.sm },
  saveBtn: {
    backgroundColor: Colors.primary, paddingVertical: Spacing.lg,
    borderRadius: 12, alignItems: 'center', marginTop: Spacing.md,
  },
  saveBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.lg },
});
