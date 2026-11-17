import { useCalendars } from 'expo-localization';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';

import dayjs from '@lib/datetime';
import { getDateToday } from '@utils/date';

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
  const calendars = useCalendars();

  const [internalDate, setInternalDate] = useState<Date | null>(
    defaultValue ?? null,
  );

  const styles = buildStyles(theme);
  const use24Hours = calendars[0].uses24hourClock;
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
          <DateTimePicker
            mode="single"
            use12Hours={!use24Hours}
            date={resolvedDate}
            onChange={({ date }) => {
              if (date === undefined) return;

              let resolvedDate: Date | null;
              if (dayjs.isDayjs(date)) {
                resolvedDate = date.toDate();
              } else if (date) {
                resolvedDate = new Date(date);
              } else {
                resolvedDate = null;
              }

              setInternalDate(resolvedDate);

              onChangeValue?.(resolvedDate);
              onDismiss?.();
            }}
            minDate={getDateToday()}
            styles={{
              // Main Element Styles
              button_prev_image: { tintColor: theme.palette.primary },
              button_next_image: { tintColor: theme.palette.primary },

              month_selector_label: { color: theme.palette.text },
              year_selector_label: { color: theme.palette.text },
              weekday_label: { color: theme.palette.text },

              day_label: { color: theme.palette.text },
              today_label: { color: theme.palette.error },
              selected_label: { color: theme.palette.primary },
              disabled_label: { color: theme.palette.subtle },

              // Month Selector Styles
              month_label: { color: theme.palette.subtle },
              selected_month_label: { color: theme.palette.primary },

              // Year Selector Styles
              year_label: { color: theme.palette.subtle },
              selected_year_label: { color: theme.palette.primary },
            }}
          />
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
  });
}
