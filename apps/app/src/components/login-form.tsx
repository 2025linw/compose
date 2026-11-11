import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSessionApi } from '@contexts/auth';
import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';
import { useToast } from '@hooks/use-toast';

import FormField from '@components/forms/form-field';
import PasswordInput from '@components/password-input';
import Button from '@components/primitive/button';
import TextInput from '@components/primitive/text-input';
import Typography from '@components/primitive/typography';

export type State = 'login' | 'register';

type LoginFormProps = {
  type: State;
};

export default function LoginForm({ type }: LoginFormProps) {
  const router = useRouter();
  const theme = useTheme();
  const toast = useToast();
  const { createAccount, login: loginApi } = useSessionApi();

  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState('will@email.com');
  const [password, setPassword] = useState('testpass');

  const styles = buildStyles(theme);

  const register = (info: { email: string; password: string }) => {
    createAccount(info)
      .then(
        (success) => {
          router.setParams({ animation: 'none' });

          if (success) router.replace('/');
        },
        (err) => {
          toast.error(`Error registering: ${err}`);
        },
      )
      .finally(() => setLoading(false));
  };

  const login = (info: { email: string; password: string }) => {
    loginApi(info)
      .then(
        (success) => {
          router.setParams({ animation: 'none' });

          if (success) router.replace('/');
        },
        (err) => {
          toast.error(`Error logging in: ${err}`);
        },
      )
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.box, styles.loginBox]}>
        <View style={styles.inputContainer}>
          <FormField
            label={'Email'}
            style={styles.loginField}
          >
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
            />
          </FormField>

          <FormField
            label={'Password'}
            style={styles.loginField}
          >
            <PasswordInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoComplete={
                type === 'register' ? 'new-password' : 'current-password'
              }
              autoCorrect={false}
            />
          </FormField>
        </View>

        <Button
          scheme="primary"
          disabled={isLoading}
          onPress={async () => {
            if (isLoading) return;
            setLoading(true);

            (type === 'register' ? register : login)({ email, password });
          }}
          style={styles.button}
        >
          {type === 'register' ? 'Register' : 'Login'}
        </Button>
      </View>

      <View style={styles.box}>
        <Typography>
          {type === 'register' ? 'Have an account?' : "Don't have an account?"}
        </Typography>

        <Button
          scheme="tertiary"
          hasBorder
          onPress={() =>
            router.replace(type === 'register' ? '/login' : '/register')
          }
          style={styles.button}
        >
          {type === 'register' ? 'Login' : 'Register'}
        </Button>
      </View>
    </View>
  );
}

function buildStyles(theme: Theme) {
  const gap = theme.spacings.x4;

  return StyleSheet.create({
    container: {
      padding: theme.spacings.x4,

      width: '100%',

      justifyContent: 'space-between',
      gap,
    },
    box: {
      padding: theme.spacings.x3,

      gap,
    },
    loginBox: {
      borderRadius: theme.rounded.lg,
      borderWidth: 1,
      borderColor: theme.palette.border,

      backgroundColor: theme.palette.surface,
    },
    inputContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginField: {
      margin: theme.spacings.x2,
    },
    button: {
      justifyContent: 'center',
    },
  });
}
