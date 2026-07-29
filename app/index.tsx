import { Redirect } from 'expo-router';
import { useStore } from '../src/presentation/store/useStore';

export default function Index() {
  const profile = useStore((state) => state.profile);

  // Si no hay perfil, lo mandamos al onboarding.
  // Si ya hay perfil, lo mandamos al dashboard dentro de los tabs.
  if (!profile) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/dashboard" />;
}
