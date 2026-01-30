import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../constants/theme';

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color={Colors.primary} />
      </TouchableOpacity>
      <Text style={styles.title}>Create Account</Text>
      <View style={styles.logoSection}>
        <View style={styles.logoCircle}>
          <Ionicons name="shirt" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.appName}>Prashanthi Uniforms</Text>
        <Text style={styles.tagline}>Quality attire for every student</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="person-outline" size={20} color={Colors.textLight} />
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor={Colors.textLight}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="mail-outline" size={20} color={Colors.textLight} />
          <TextInput
            style={styles.input}
            placeholder="john@example.com"
            placeholderTextColor={Colors.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="call-outline" size={20} color={Colors.textLight} />
          <TextInput
            style={styles.input}
            placeholder="+1 (555) 000-0000"
            placeholderTextColor={Colors.textLight}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        <Text style={styles.label}>Password</Text>
        <View style={[styles.inputWithIcon, styles.passwordRow]}>
          <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} />
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="••••••••"
            placeholderTextColor={Colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="refresh-outline" size={20} color={Colors.textLight} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.textLight}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.signupBtnText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.terms}>
        By signing up, you agree to our{' '}
        <Text style={styles.link}>Terms of Service</Text> and{' '}
        <Text style={styles.link}>Privacy Policy.</Text>
      </Text>
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
  backBtn: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.logoBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.lg,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
  },
  signupBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  signupBtnText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  loginText: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
  },
  loginLink: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  terms: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  link: {
    color: Colors.primary,
    fontWeight: '500',
  },
});
