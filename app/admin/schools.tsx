import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Modal } from 'react-native';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function AdminSchools() {
  const [schools, setSchools] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', image: '' });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const snap = await getDocs(collection(db, 'schools'));
    setSchools(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const openModal = (school: any = null) => {
    if (school) {
      setEditingSchool(school);
      setFormData({ name: school.name, image: school.image || '' });
    } else {
      setEditingSchool(null);
      setFormData({ name: '', image: '' });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (editingSchool) {
        await updateDoc(doc(db, 'schools', editingSchool.id), formData);
      } else {
        await addDoc(collection(db, 'schools'), formData);
      }
      setModalVisible(false);
      fetchSchools();
    } catch (error) {
      alert("Error saving school");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schools', id));
      fetchSchools();
    } catch (error) {
      alert("Error deleting school");
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
        <Text style={styles.headerTitle}>Manage Schools</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => openModal()}>
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {schools.map(school => (
          <View key={school.id} style={styles.card}>
            <Text style={styles.schoolName}>{school.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openModal(school)} style={styles.actionBtn}>
                <Ionicons name="pencil" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(school.id)} style={styles.actionBtn}>
                <Ionicons name="trash" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingSchool ? 'Edit School' : 'Add School'}</Text>
            
            <Text style={styles.label}>School Name</Text>
            <TextInput style={styles.input} value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />
            
            <Text style={styles.label}>Image URL</Text>
            <TextInput style={styles.input} value={formData.image} onChangeText={t => setFormData({...formData, image: t})} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, backgroundColor: Colors.white, paddingTop: Spacing.xxl + 10 },
  headerBtn: { padding: Spacing.xs, minWidth: 40 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  content: { padding: Spacing.lg },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: 12, marginBottom: Spacing.md },
  schoolName: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.text, flex: 1 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: { padding: Spacing.xs },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: Spacing.xl },
  modalTitle: { fontSize: FontSizes.xl, fontWeight: '700', marginBottom: Spacing.lg },
  label: { fontSize: FontSizes.sm, color: Colors.textMuted, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: Spacing.md, marginBottom: Spacing.md, fontSize: FontSizes.md },
  modalActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  btn: { flex: 1, padding: Spacing.md, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { backgroundColor: Colors.backgroundLight },
  saveBtn: { backgroundColor: Colors.primary },
  cancelBtnText: { color: Colors.text, fontWeight: '600' },
  saveBtnText: { color: Colors.white, fontWeight: '600' },
});
