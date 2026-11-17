import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { useCalendars, useLocales } from 'expo-localization';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';

import Button from '@components/primitive/button';

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
  const locales = useLocales();
  const calendars = useCalendars();

  const [showDialog, setShowDialog] = useState<'date' | 'time' | null>(null);
  const [internalDate, setInternalDate] = useState(defaultValue ?? new Date());

  const styles = buildStyles(theme);
  const resolvedDate = value ?? internalDate;
  const formattedDate = resolvedDate.toLocaleDateString(
    locales[0].languageTag,
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  );
  const formattedTime = resolvedDate.toLocaleTimeString(
    locales[0].languageTag,
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !calendars[0].uses24hourClock,
    },
  );

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
          <Button
            scheme="secondary"
            hasBorder={false}
            onPress={() => setShowDialog('date')}
            rounded
          >{`${formattedDate}`}</Button>

          {canSelectTime && (
            <Button
              scheme="secondary"
              hasBorder={false}
              onPress={() => setShowDialog('time')}
              rounded
            >{`${formattedTime}`}</Button>
          )}
        </View>

        {showDialog !== null && (showDialog === 'date' || canSelectTime) && (
          <DateTimePicker
            mode={showDialog}
            value={resolvedDate}
            onValueChange={(_event, selectedDate) => {
              setInternalDate(selectedDate);
              setShowDialog(null);

              onChangeValue?.(selectedDate);
              onDismiss?.();
            }}
            onDismiss={() => setShowDialog(null)}
          />
        )}
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

      width: 300,
      maxWidth: '100%',

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacings.x1,

      backgroundColor: theme.palette.surface,
    },
  });
}
