import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, FontSizes, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="school" size={40} color={Colors.primary} />
      </View>

      <Text style={styles.headerTitle}>Prashanthi Uniforms</Text>
      <Text style={styles.welcomeSubtitle}>Quality Uniforms for Every School</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
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
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.loginBtnText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-google" size={24} color="#DB4437" />
          <Text style={styles.socialLabel}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-facebook" size={24} color="#4267B2" />
          <Text style={styles.socialLabel}>Facebook</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signupRow}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.xxl * 2, paddingTop: Spacing.xxl * 2 },
  header: { alignItems: 'center', marginBottom: Spacing.md },
  headerTitle: { fontSize: FontSizes.xxxl, fontWeight: '800', color: Colors.primaryDark, textAlign: 'center', marginBottom: Spacing.xs },
  welcomeSubtitle: { fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.xxl },
  form: { marginBottom: Spacing.xl },
  label: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, marginLeft: Spacing.xs },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, fontSize: FontSizes.md, color: Colors.text, marginBottom: Spacing.lg, backgroundColor: Colors.backgroundLight },
  passwordContainer: { position: 'relative', marginBottom: Spacing.sm },
  passwordInput: { paddingRight: 48 },
  eyeBtn: { position: 'absolute', right: Spacing.md, top: 0, bottom: 0, justifyContent: 'center' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: Spacing.xl },
  forgotText: { fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '600' },
  loginBtn: { backgroundColor: Colors.primary, paddingVertical: 18, borderRadius: 12, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  loginBtnText: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { marginHorizontal: Spacing.md, fontSize: FontSizes.xs, color: Colors.textMuted, fontWeight: '600' },
  socialButtons: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxl },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, backgroundColor: Colors.white },
  socialLabel: { fontSize: FontSizes.md, color: Colors.textSecondary, fontWeight: '600' },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText: { fontSize: FontSizes.md, color: Colors.textMuted },
  signupLink: { fontSize: FontSizes.md, color: Colors.primary, fontWeight: '700' },
});
