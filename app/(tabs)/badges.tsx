import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../../src/presentation/store/useStore';
import { colors } from '../../src/presentation/theme/colors';
import { calculateFreeTimeInDays, calculateMoneySaved } from '../../src/core/utils/calculations';
import { Award, Lock, Star } from 'lucide-react-native';

const BADGES = [
  { id: 't1', title: 'Primeras 24h', desc: '¡Superaste el primer día!', type: 'time', req: 1 },
  { id: 't2', title: 'Primera Semana', desc: '7 días libre de humo', type: 'time', req: 7 },
  { id: 't3', title: 'Un Mes Fuerte', desc: '30 días de victoria', type: 'time', req: 30 },
  { id: 'm1', title: 'Primeros 100 Bs', desc: 'Ahorraste 100 Bs', type: 'money', req: 100 },
  { id: 'm2', title: 'Cena Pagada', desc: 'Ahorraste 500 Bs', type: 'money', req: 500 },
];

export default function BadgesScreen() {
  const profile = useStore((state) => state.profile);
  const [daysFree, setDaysFree] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);

  useEffect(() => {
    if (!profile?.startDate) return;
    const startDate = new Date(profile.startDate);
    
    const freeDays = calculateFreeTimeInDays(startDate);
    setDaysFree(freeDays);
    setMoneySaved(calculateMoneySaved(freeDays, profile.cigsPerDay, profile.cigsPerPack, profile.pricePerPack));
  }, [profile]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Tus Logros</Text>
      <Text style={styles.headerSubtitle}>Celebra cada pequeña victoria en tu camino.</Text>

      <View style={styles.grid}>
        {BADGES.map((badge) => {
          const isUnlocked = badge.type === 'time' ? daysFree >= badge.req : moneySaved >= badge.req;
          
          return (
            <View key={badge.id} style={[styles.badgeCard, isUnlocked ? styles.unlocked : styles.locked]}>
              <View style={styles.iconContainer}>
                {isUnlocked ? (
                  <Star color={colors.warning} size={40} fill={colors.warning} />
                ) : (
                  <Lock color={colors.textSecondary} size={40} />
                )}
              </View>
              <Text style={[styles.badgeTitle, isUnlocked ? styles.textUnlocked : styles.textLocked]}>{badge.title}</Text>
              <Text style={styles.badgeDesc} numberOfLines={2} ellipsizeMode="tail">{badge.desc}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 25 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  unlocked: {
    borderColor: colors.warning,
    borderWidth: 2,
  },
  locked: {
    opacity: 0.6,
  },
  iconContainer: {
    marginBottom: 12,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  textUnlocked: { color: colors.text },
  textLocked: { color: colors.textSecondary },
  badgeDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  }
});
