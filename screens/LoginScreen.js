import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="school" size={28} color={Colors.primary} />
        <Text style={styles.headerTitle}>Prashanthi Uniforms</Text>
      </View>
      <View style={styles.heroImage}>
        <View style={styles.heroPlaceholder}>
          <Ionicons name="shirt" size={60} color={Colors.textLight} />
        </View>
      </View>
      <Text style={styles.welcomeTitle}>Welcome Back</Text>
      <Text style={styles.welcomeSubtitle}>Sign in to manage your school uniform orders</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Email / Phone number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email or phone"
          placeholderTextColor={Colors.textLight}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Enter your password"
            placeholderTextColor={Colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
        <View style={styles.dividerLine} />
      </View>
      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialBtn}>
          <Text style={styles.socialBtnText}>G</Text>
          <Text style={styles.socialLabel}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-facebook" size={24} color={Colors.primary} />
          <Text style={styles.socialLabel}>Facebook</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signupRow}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  heroImage: {
    marginBottom: Spacing.xl,
  },
  heroPlaceholder: {
    height: 180,
    backgroundColor: '#2F8D8B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    fontSize: FontSizes.md,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: Spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
  },
  forgotText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginBtnText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },
  socialBtnText: {
    fontSize: FontSizes.xl,
    color: '#4285F4',
    fontWeight: '700',
  },
  socialLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
  },
  signupLink: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
  },
});
