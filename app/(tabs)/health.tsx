import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '../../src/presentation/store/useStore';
import { colors } from '../../src/presentation/theme/colors';
import { differenceInMinutes } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react-native';

const MILESTONES = [
  { id: 1, timeReq: 20, title: 'Presión Arterial', desc: 'Tu presión arterial y ritmo cardíaco vuelven a la normalidad.' },
  { id: 2, timeReq: 480, title: 'Oxigenación (8h)', desc: 'Los niveles de oxígeno en tu sangre se normalizan.' },
  { id: 3, timeReq: 720, title: 'Monóxido de Carbono (12h)', desc: 'El monóxido de carbono cae a niveles normales.' },
  { id: 4, timeReq: 2880, title: 'Gusto y Olfato (48h)', desc: 'Las terminaciones nerviosas comienzan a regenerarse.' },
  { id: 5, timeReq: 4320, title: 'Respiración (72h)', desc: 'Los bronquios se relajan, es más fácil respirar.' },
  { id: 6, timeReq: 20160, title: 'Pulmones (2 sem)', desc: 'Mejora notable en la circulación y función pulmonar.' },
  { id: 7, timeReq: 525600, title: 'Corazón (1 año)', desc: 'El riesgo de enfermedad coronaria es la mitad del de un fumador.' },
];

export default function HealthScreen() {
  const profile = useStore((state) => state.profile);
  const [minutesFree, setMinutesFree] = useState(0);

  useEffect(() => {
    if (!profile?.startDate) return;
    const startDate = new Date(profile.startDate);
    
    const update = () => {
      setMinutesFree(differenceInMinutes(new Date(), startDate));
    };
    
    update();
    const interval = setInterval(update, 1000 * 60); // Update every minute
    return () => clearInterval(interval);
  }, [profile]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Hitos de Salud</Text>
      <Text style={styles.headerSubtitle}>Mira cómo se recupera tu cuerpo con el tiempo.</Text>

      {MILESTONES.map((milestone) => {
        let progress = (minutesFree / milestone.timeReq) * 100;
        if (progress > 100) progress = 100;
        const isComplete = progress === 100;

        return (
          <View key={milestone.id} style={[styles.card, isComplete && styles.cardComplete]}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{milestone.title}</Text>
                <Text style={styles.desc}>{milestone.desc}</Text>
              </View>
              {isComplete ? (
                <CheckCircle2 color={colors.success} size={28} />
              ) : (
                <Circle color={colors.textSecondary} size={28} />
              )}
            </View>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: isComplete ? colors.success : colors.primary }]} />
            </View>
            <Text style={styles.progressText}>{progress.toFixed(1)}% Completado</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 25 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,180,216,0.1)',
  },
  cardComplete: {
    borderColor: colors.success,
    backgroundColor: '#F9FFF9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  desc: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    fontWeight: 'bold',
  }
});
