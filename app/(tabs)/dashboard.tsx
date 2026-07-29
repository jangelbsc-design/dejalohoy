import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useStore } from '../../src/presentation/store/useStore';
import { colors } from '../../src/presentation/theme/colors';
import { 
  calculateFreeTime, 
  calculateFreeTimeInDays, 
  calculateMoneySaved, 
  calculateCigsAvoided, 
  calculateLifeRecovered,
  FreeTime,
  LifeRecovered
} from '../../src/core/utils/calculations';
import { Clock, DollarSign, Activity, AlertCircle } from 'lucide-react-native';

export default function DashboardScreen() {
  const profile = useStore((state) => state.profile);

  const [time, setTime] = useState<FreeTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [money, setMoney] = useState(0);
  const [cigs, setCigs] = useState(0);
  const [life, setLife] = useState<LifeRecovered>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!profile?.startDate) return;
    const startDate = new Date(profile.startDate);

    const updateStats = () => {
      const now = new Date();
      setTime(calculateFreeTime(startDate, now));
      
      const freeDays = calculateFreeTimeInDays(startDate, now);
      setMoney(calculateMoneySaved(freeDays, profile.cigsPerDay, profile.cigsPerPack, profile.pricePerPack));
      
      const avoided = calculateCigsAvoided(freeDays, profile.cigsPerDay);
      setCigs(Math.floor(avoided));
      setLife(calculateLifeRecovered(avoided));
    };

    updateStats(); // Initial call
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [profile]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Tarjeta Principal: Tiempo Libre */}
      <View style={[styles.card, styles.mainCard]}>
        <View style={styles.cardHeader}>
          <Clock color={colors.primary} size={24} />
          <Text style={styles.cardTitle}>Tiempo Libre de Humo</Text>
        </View>
        <View style={styles.timeContainer}>
          <View style={styles.timeBox}>
            <Text style={styles.timeValue}>{time.days}</Text>
            <Text style={styles.timeLabel}>DÍAS</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeValue}>{time.hours}</Text>
            <Text style={styles.timeLabel}>HRS</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeValue}>{time.minutes}</Text>
            <Text style={styles.timeLabel}>MIN</Text>
          </View>
          <View style={styles.timeBox}>
            <Text style={styles.timeValue}>{time.seconds}</Text>
            <Text style={styles.timeLabel}>SEG</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        {/* Tarjeta: Dinero Ahorrado */}
        <View style={[styles.card, styles.halfCard]}>
          <View style={styles.cardHeader}>
            <DollarSign color={colors.success} size={20} />
            <Text style={styles.cardTitleSmall}>Ahorrado</Text>
          </View>
          <Text style={styles.statsValue}>Bs {money.toFixed(2)}</Text>
        </View>

        {/* Tarjeta: Cigarrillos No Fumados */}
        <View style={[styles.card, styles.halfCard]}>
          <View style={styles.cardHeader}>
            <Activity color={colors.primary} size={20} />
            <Text style={styles.cardTitleSmall}>Evitados</Text>
          </View>
          <Text style={styles.statsValue}>{cigs}</Text>
          <Text style={styles.statsSubtitle}>cigarrillos</Text>
        </View>
      </View>

      {/* Tarjeta: Vida Recuperada */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <HeartIcon color={colors.warning} size={24} />
          <Text style={styles.cardTitle}>Vida Recuperada</Text>
        </View>
        <Text style={styles.lifeValue}>
          {life.days > 0 ? `${life.days}d ` : ''}{life.hours}h {life.minutes}m
        </Text>
        <Text style={styles.statsSubtitle}>Estimado basado en 11 min por cigarrillo</Text>
      </View>

      {/* Botón de Pánico / Antojo */}
      <TouchableOpacity style={styles.panicButton}>
        <AlertCircle color={colors.surface} size={24} />
        <Text style={styles.panicButtonText}>¡Tengo Ansiedad!</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// Para usar el icono de corazón en la vida recuperada
import { Heart as HeartIcon } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  mainCard: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardTitleSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  timeBox: {
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    minWidth: 65,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  halfCard: {
    flex: 1,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
  },
  statsSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  lifeValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.warning,
    textAlign: 'center',
    marginVertical: 10,
  },
  panicButton: {
    backgroundColor: colors.danger,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 10
  },
  panicButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
