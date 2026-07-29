import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { UserRepository } from '../src/data/repositories/UserRepository';
import { useStore } from '../src/presentation/store/useStore';
import { colors } from '../src/presentation/theme/colors';

export default function OnboardingScreen() {
  const router = useRouter();
  const setProfile = useStore((state) => state.setProfile);

  const [cigsPerDay, setCigsPerDay] = useState('10');
  const [cigsPerPack, setCigsPerPack] = useState('20');
  const [pricePerPack, setPricePerPack] = useState('20');
  const [yearsSmoking, setYearsSmoking] = useState('5');

  const handleSave = async () => {
    const profile = {
      startDate: new Date().toISOString(), // Asume que deja de fumar AHORA
      cigsPerDay: parseInt(cigsPerDay) || 0,
      cigsPerPack: parseInt(cigsPerPack) || 20,
      pricePerPack: parseFloat(pricePerPack) || 0,
      yearsSmoking: parseInt(yearsSmoking) || 0,
    };

    await UserRepository.saveProfile(profile);
    setProfile(profile);
    router.replace('/(tabs)/dashboard');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>¡Felicidades por tu decisión!</Text>
      <Text style={styles.subtitle}>Configura tus datos para comenzar tu nueva vida libre de humo.</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cigarrillos por día</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={cigsPerDay} onChangeText={setCigsPerDay} placeholderTextColor={colors.textSecondary} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cigarrillos por cajetilla</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={cigsPerPack} onChangeText={setCigsPerPack} placeholderTextColor={colors.textSecondary} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Precio por cajetilla (Bs)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={pricePerPack} onChangeText={setPricePerPack} placeholderTextColor={colors.textSecondary} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Años fumando</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={yearsSmoking} onChangeText={setYearsSmoking} placeholderTextColor={colors.textSecondary} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>¡Empezar mi nueva vida!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingTop: 80, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 40, textAlign: 'center', lineHeight: 22 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: colors.text, marginBottom: 8, fontWeight: '600' },
  input: { 
    backgroundColor: colors.surface, 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    color: colors.text, 
    borderWidth: 1, 
    borderColor: 'rgba(0,180,216,0.2)' 
  },
  button: { 
    backgroundColor: colors.primary, 
    borderRadius: 16, 
    padding: 18, 
    alignItems: 'center', 
    marginTop: 30, 
    shadowColor: colors.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 5 
  },
  buttonText: { color: colors.surface, fontSize: 18, fontWeight: 'bold' }
});
