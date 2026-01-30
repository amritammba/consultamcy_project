import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../constants/theme';

export default function SplashScreen({ navigation }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => navigation.replace('Auth'), 200);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="school" size={48} color={Colors.primary} />
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={12} color={Colors.white} />
          </View>
        </View>
      </View>
      <Text style={styles.appName}>Prashanthi</Text>
      <Text style={styles.tagline}>UNIFORMS</Text>
      <Text style={styles.slogan}>Excellence in every stitch.</Text>
      <Text style={styles.slogan}>Premium Schoolwear Catalog</Text>
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>INITIALIZING</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressPercent}>{progress}%</Text>
      </View>
      <Text style={styles.footer}>V24.0 • QUALITY GUARANTEED</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.logoBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  slogan: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xxl * 2,
    gap: Spacing.md,
    width: '100%',
  },
  progressLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressPercent: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    minWidth: 36,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
});
