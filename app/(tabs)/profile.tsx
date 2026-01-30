import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const MENU_ITEMS = [
  { section: 'ACCOUNT ACTIVITY', items: [{ id: '1', label: 'My Orders', icon: 'bag-outline', iconColor: Colors.primary }, { id: '2', label: 'Wishlist', icon: 'heart-outline', iconColor: Colors.primary }] },
  { section: 'PREFERENCES', items: [{ id: '3', label: 'Address Management', icon: 'location-outline', iconColor: Colors.primary }, { id: '4', label: 'Settings', icon: 'settings-outline', iconColor: Colors.primary }, { id: '5', label: 'Logout', icon: 'log-out-outline', iconColor: Colors.error }] },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const handleMenuItemPress = (label: string) => {
    if (label === 'Logout') {
      handleLogout();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="pencil-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={60} color={Colors.textLight} />
              </View>
            )}
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={14} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.membership}>{user ? 'Premium Member' : 'Welcome!'}</Text>
          <Text style={styles.email}>{user?.email || 'Please login to continue'}</Text>
          {user && <Text style={styles.phone}>+91 98765 43210</Text>}
        </View>
        {MENU_ITEMS.map((s) => (
          <View key={s.section} style={styles.menuSection}>
            <Text style={styles.sectionHeader}>{s.section}</Text>
            <View style={styles.menuList}>
              {s.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, item.label === 'Logout' && styles.menuItemLogout]}
                  onPress={() => handleMenuItemPress(item.label)}
                >
                  <View style={[styles.menuIconBg, item.label === 'Logout' && styles.menuIconBgLogout]}>
                    <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
                  </View>
                  <Text style={[styles.menuLabel, item.label === 'Logout' && styles.menuLabelLogout]}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <Text style={styles.version}>Prashanthi Uniforms v2.4.2</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, backgroundColor: Colors.white, paddingTop: Spacing.xxl + 10 },
  headerBtn: { padding: Spacing.xs },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  content: { paddingBottom: Spacing.xxl * 2 },
  profileSection: { alignItems: 'center', backgroundColor: Colors.white, paddingVertical: Spacing.xxl, marginBottom: Spacing.md },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.backgroundGray, justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white },
  userName: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text, marginTop: Spacing.lg },
  membership: { fontSize: FontSizes.md, color: Colors.primary, fontWeight: '600', marginTop: Spacing.xs },
  email: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.xs },
  phone: { fontSize: FontSizes.sm, color: Colors.text, marginTop: Spacing.xs },
  menuSection: { marginTop: Spacing.md },
  sectionHeader: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textMuted, marginBottom: Spacing.sm, marginLeft: Spacing.lg, marginTop: Spacing.lg },
  menuList: { backgroundColor: Colors.white, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.borderLight },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuItemLogout: { borderBottomWidth: 0 },
  menuIconBg: { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.backgroundGray, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  menuIconBgLogout: { backgroundColor: '#FFE5E5' },
  menuLabel: { flex: 1, fontSize: FontSizes.md, color: Colors.text, fontWeight: '500' },
  menuLabelLogout: { color: Colors.error, fontWeight: '600' },
  version: { textAlign: 'center', fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: Spacing.xxl, marginBottom: Spacing.xl },
});
