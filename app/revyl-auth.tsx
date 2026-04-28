import { useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { useAuthBypass } from '../context/AuthBypassContext';

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] || null;
  }
  return value || null;
}

export default function RevylAuthRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    token?: string | string[];
    role?: string | string[];
    redirect?: string | string[];
  }>();
  const { handleAuthBypassURL } = useAuthBypass();
  const token = firstValue(params.token);
  const role = firstValue(params.role);
  const redirect = firstValue(params.redirect);

  const authURL = useMemo(() => {
    const query = new URLSearchParams();
    if (token) query.set('token', token);
    if (role) query.set('role', role);
    if (redirect) query.set('redirect', redirect);
    return `bug-bazaar://revyl-auth?${query.toString()}`;
  }, [redirect, role, token]);

  useEffect(() => {
    const result = handleAuthBypassURL(authURL);
    if (!result.accepted) {
      router.replace('/(tabs)/account');
    }
  }, [authURL, handleAuthBypassURL, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.stickerGreen} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.paperWhite,
  },
});
