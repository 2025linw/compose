import { DatePicker, Host } from '@expo/ui/swift-ui';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';

import { type DateSelectModalProps } from './types';

export default function DateSelectModal({
  visible,
  value,
  defaultValue,
  onChangeValue,
  onDismiss,
  canSelectTime,
}: DateSelectModalProps) {
  const theme = useTheme();

  const [internalDate, setInternalDate] = useState(defaultValue ?? new Date());

  const styles = buildStyles(theme);
  const resolvedDate = value ?? internalDate;

  return (
    <Modal
      visible={visible}
      transparent
    >
      <View style={styles.overlay}>
        <Pressable
          onPress={onDismiss}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.container}>
          <Host matchContents>
            <DatePicker
              displayedComponents={
                canSelectTime ? ['date', 'hourAndMinute'] : ['date']
              }
              selection={resolvedDate}
              onDateChange={(selectedDate) => {
                setInternalDate(selectedDate);

                onChangeValue?.(selectedDate);
                onDismiss?.();
              }}
            />
          </Host>
        </View>
      </View>
    </Modal>
  );
}

function buildStyles(theme: Theme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,

      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      padding: theme.spacings.x4,

      borderWidth: theme.spacings.thin,
      borderColor: theme.palette.border,
      borderRadius: theme.rounded.lg,

      backgroundColor: theme.palette.surface,
    },
    picker: {
      flex: 1,
      borderWidth: theme.spacings.thin,
      borderColor: theme.palette.border,
    },
  });
}
