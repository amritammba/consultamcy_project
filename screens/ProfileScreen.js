import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../constants/theme';

const MENU_ITEMS = [
  {
    section: 'ACCOUNT ACTIVITY',
    items: [
      { id: '1', label: 'My Orders', icon: 'bag-outline', iconColor: Colors.primary },
      { id: '2', label: 'Wishlist', icon: 'heart-outline', iconColor: Colors.primary },
    ],
  },
  {
    section: 'PREFERENCES',
    items: [
      { id: '3', label: 'Address Management', icon: 'location-outline', iconColor: Colors.primary },
      { id: '4', label: 'Settings', icon: 'settings-outline', iconColor: Colors.primary },
      { id: '5', label: 'Logout', icon: 'log-out-outline', iconColor: Colors.error },
  ],
  },
];

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.getParent()?.navigate('HomeTab')
          }
        >
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="pencil-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={60} color={Colors.textLight} />
            </View>
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={14} color={Colors.white} />
            </View>
          </View>
          <Text style={styles.userName}>Rahul Sharma</Text>
          <Text style={styles.membership}>Premium Member</Text>
          <Text style={styles.email}>rahul.sharma@example.com</Text>
          <Text style={styles.phone}>+91 98765 43210</Text>
        </View>
        {MENU_ITEMS.map((section) => (
          <View key={section.section} style={styles.menuSection}>
            <Text style={styles.sectionHeader}>{section.section}</Text>
            <View style={styles.menuList}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    item.label === 'Logout' && styles.menuItemLogout,
                  ]}
                >
                  <View
                    style={[
                      styles.menuIconBg,
                      item.label === 'Logout' && styles.menuIconBgLogout,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={item.iconColor}
                    />
                  </View>
                  <Text
                    style={[
                      styles.menuLabel,
                      item.label === 'Logout' && styles.menuLabelLogout,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <Text style={styles.version}>Prashanthi Uniforms v2.4.1</Text>
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
  headerBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    paddingBottom: Spacing.xxl * 2,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.xxl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  membership: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  email: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  phone: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  menuSection: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.lg,
  },
  menuList: {
    backgroundColor: Colors.white,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemLogout: {
    borderBottomWidth: 0,
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuIconBgLogout: {
    backgroundColor: '#FFE5E5',
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  menuLabelLogout: {
    color: Colors.error,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xxl,
  },
});
