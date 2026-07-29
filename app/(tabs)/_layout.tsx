import { Tabs } from 'expo-router';
import { colors } from '../../src/presentation/theme/colors';
import { Activity, Heart, Award } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: { 
        backgroundColor: colors.surface, 
        borderTopWidth: 0, 
        elevation: 10, 
        shadowColor: '#000', 
        shadowOpacity: 0.05, 
        height: 65,
        paddingBottom: 10,
        paddingTop: 5
      },
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { color: colors.text, fontWeight: 'bold' },
      headerShadowVisible: false,
    }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Progreso', 
          tabBarIcon: ({ color }) => <Activity color={color} size={24} /> 
        }} 
      />
      <Tabs.Screen 
        name="health" 
        options={{ 
          title: 'Salud', 
          tabBarIcon: ({ color }) => <Heart color={color} size={24} /> 
        }} 
      />
      <Tabs.Screen 
        name="badges" 
        options={{ 
          title: 'Logros', 
          tabBarIcon: ({ color }) => <Award color={color} size={24} /> 
        }} 
      />
    </Tabs>
  );
}
