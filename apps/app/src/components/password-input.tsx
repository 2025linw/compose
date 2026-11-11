import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';

import Icon from '@components/primitive/icon';
import TextInput, {
  type TextInputProps,
} from '@components/primitive/text-input';

type PasswordInputType = Omit<TextInputProps, 'secureTextEntry'> & {};

export default function PasswordInput({
  style,
  onFocus,
  onBlur,
  ...props
}: PasswordInputType) {
  const theme = useTheme();

  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);

  const styles = buildStyles(theme);

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <TextInput
        {...props}
        secureTextEntry={hidden}
        style={styles.input}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
      />

      <Pressable
        onPress={() => setHidden((prev) => !prev)}
        hitSlop={10}
      >
        <Icon name={hidden ? 'eye-outline' : 'eye-off-outline'} />
      </Pressable>
    </View>
  );
}

function buildStyles(theme: Theme, disabled?: boolean) {
  const componentStyle = theme.components.TextInput;

  return StyleSheet.create({
    container: {
      ...componentStyle.container,

      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacings.x2,
    },
    focused: componentStyle.focused,
    input: {
      flex: 1,
      minWidth: 0,

      padding: 0,

      borderWidth: 0,
      borderRadius: 0,
      backgroundColor: 'transparent',

      ...Platform.select({
        web: {
          outlineWidth: 0,
        },
      }),
    },
  });
}
