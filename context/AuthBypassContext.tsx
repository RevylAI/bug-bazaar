import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

const DEMO_AUTH_BYPASS_TOKEN = 'revyl-demo-token';

type AuthBypassRole = 'collector' | 'support';

type AuthBypassSession = {
  name: string;
  email: string;
  role: AuthBypassRole;
  source: 'revyl-deeplink';
};

type AuthBypassStatus = {
  state: 'idle' | 'accepted' | 'rejected';
  message: string;
};

type AuthBypassLaunchConfig = {
  enabled: boolean;
  expectedToken: string;
  source: 'launch-env' | 'demo-fallback';
};

type AuthBypassHandleResult = {
  handled: boolean;
  accepted: boolean;
};

type AuthBypassContextType = {
  session: AuthBypassSession | null;
  status: AuthBypassStatus;
  launchConfig: AuthBypassLaunchConfig;
  handleAuthBypassURL: (rawURL: string) => AuthBypassHandleResult;
  signOut: () => void;
};

const AuthBypassContext = createContext<AuthBypassContextType | undefined>(
  undefined,
);

const profiles: Record<AuthBypassRole, AuthBypassSession> = {
  collector: {
    name: 'Revyl Test Collector',
    email: 'revyl.collector@bugbazaar.test',
    role: 'collector',
    source: 'revyl-deeplink',
  },
  support: {
    name: 'Revyl Support Agent',
    email: 'support.agent@bugbazaar.test',
    role: 'support',
    source: 'revyl-deeplink',
  },
};

const allowedRedirects: Record<string, string> = {
  '/': '/(tabs)',
  '/shop': '/(tabs)',
  '/account': '/(tabs)/account',
  '/cart': '/cart',
  '/checkout': '/checkout',
  '/product/3': '/product/3',
};

function readLaunchConfig(): AuthBypassLaunchConfig {
  const env = (globalThis as { process?: { env?: Record<string, string> } })
    .process?.env;
  const enabled = env?.REVYL_AUTH_BYPASS_ENABLED;
  const token = env?.REVYL_AUTH_BYPASS_TOKEN;

  return {
    enabled: enabled == null ? true : enabled === 'true',
    expectedToken: token || DEMO_AUTH_BYPASS_TOKEN,
    source: token ? 'launch-env' : 'demo-fallback',
  };
}

function getAuthBypassPath(url: URL): string {
  if (url.hostname === 'revyl-auth') {
    return 'revyl-auth';
  }
  return url.pathname.replace(/^\/+/, '');
}

function getSingleParam(url: URL, key: string): string | null {
  const value = url.searchParams.get(key);
  if (value == null || value.trim() === '') {
    return null;
  }
  return value.trim();
}

function resolveRedirect(rawRedirect: string | null): string | null {
  if (!rawRedirect) {
    return '/(tabs)/account';
  }
  return allowedRedirects[rawRedirect] || null;
}

function resolveRole(rawRole: string | null): AuthBypassRole | null {
  if (!rawRole) {
    return 'collector';
  }
  if (rawRole === 'collector' || rawRole === 'support') {
    return rawRole;
  }
  return null;
}

export function AuthBypassProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const launchConfig = useMemo(readLaunchConfig, []);
  const [session, setSession] = useState<AuthBypassSession | null>(null);
  const [status, setStatus] = useState<AuthBypassStatus>({
    state: 'idle',
    message:
      'No auth bypass link has been opened. Start the app with launch vars, then open bug-bazaar://revyl-auth.',
  });

  const handleAuthBypassURL = useCallback(
    (rawURL: string) => {
      let url: URL;
      try {
        url = new URL(rawURL);
      } catch {
        setStatus({
          state: 'rejected',
          message: 'Rejected auth bypass link because the URL could not be parsed.',
        });
        return { handled: true, accepted: false };
      }

      if (url.protocol !== 'bug-bazaar:' || getAuthBypassPath(url) !== 'revyl-auth') {
        return { handled: false, accepted: false };
      }

      if (!launchConfig.enabled) {
        setStatus({
          state: 'rejected',
          message: 'Rejected auth bypass link because REVYL_AUTH_BYPASS_ENABLED is not true.',
        });
        return { handled: true, accepted: false };
      }

      const token = getSingleParam(url, 'token');
      if (token !== launchConfig.expectedToken) {
        setStatus({
          state: 'rejected',
          message:
            'Rejected auth bypass link because the token did not match the launch variable.',
        });
        return { handled: true, accepted: false };
      }

      const role = resolveRole(getSingleParam(url, 'role'));
      if (!role) {
        setStatus({
          state: 'rejected',
          message: 'Rejected auth bypass link because the role is not allowlisted.',
        });
        return { handled: true, accepted: false };
      }

      const redirect = resolveRedirect(getSingleParam(url, 'redirect'));
      if (!redirect) {
        setStatus({
          state: 'rejected',
          message: 'Rejected auth bypass link because the redirect is not allowlisted.',
        });
        return { handled: true, accepted: false };
      }

      const profile = profiles[role];
      setSession(profile);
      setStatus({
        state: 'accepted',
        message: `Signed in as ${profile.name} and routed to ${redirect}.`,
      });
      router.replace(redirect as Parameters<typeof router.replace>[0]);
      return { handled: true, accepted: true };
    },
    [launchConfig.enabled, launchConfig.expectedToken, router],
  );

  useEffect(() => {
    let mounted = true;

    Linking.getInitialURL()
      .then(url => {
        if (mounted && url) {
          handleAuthBypassURL(url);
        }
      })
      .catch(() => {
        setStatus({
          state: 'rejected',
          message: 'Could not read the initial deep link URL.',
        });
      });

    const subscription = Linking.addEventListener('url', event => {
      handleAuthBypassURL(event.url);
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [handleAuthBypassURL]);

  const signOut = useCallback(() => {
    setSession(null);
    setStatus({
      state: 'idle',
      message: 'Signed out of the Revyl auth bypass demo session.',
    });
  }, []);

  return (
    <AuthBypassContext.Provider
      value={{ session, status, launchConfig, handleAuthBypassURL, signOut }}
    >
      {children}
    </AuthBypassContext.Provider>
  );
}

export function useAuthBypass() {
  const context = useContext(AuthBypassContext);
  if (!context) {
    throw new Error('useAuthBypass must be used within AuthBypassProvider');
  }
  return context;
}
