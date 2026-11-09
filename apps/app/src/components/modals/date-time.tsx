import { Modal, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';

import dayjs from '@lib/datetime';
import { getDateToday } from '@utils/date';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';

import Button from '@components/primitive/button';
import Icon from '@components/primitive/icon';
import Typography from '@components/primitive/typography';

export type Mode = 'start' | 'deadline';

type DateSelectModalProps = {
  visible?: boolean;
  mode: Mode;
  taskId: string;
  initialDate?: dayjs.Dayjs;
  onDateSelect?: (selectedDate: dayjs.Dayjs | null) => void;
  dismiss?: () => void;
};

export default function DateSelectModal({
  mode,
  taskId,
  initialDate,
  ...props
}: DateSelectModalProps) {
  const theme = useTheme();
  const styles = buildStyles(theme);

  return (
    <Modal
      visible={props.visible}
      transparent
    >
      <View style={styles.overlay}>
        <Pressable
          onPress={props.dismiss}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Button
                scheme="danger"
                leftIcon={<Icon name="trash-bin" />}
                style={styles.headerButton}
                onPress={() => props.onDateSelect?.(null)}
              />

              <Typography>{mode === 'start' ? 'When?' : 'Deadline'}</Typography>

              <Button
                scheme="secondary"
                hasBorder={false}
                leftIcon={<Icon name="close" />}
                style={styles.headerButton}
                onPress={props.dismiss}
              />
            </View>

            <DateTimePicker
              mode="single"
              date={initialDate ? dayjs(initialDate) : undefined}
              onChange={({ date: date_type }) => {
                const date = dayjs(date_type);
                if (!date.isValid()) return;

                props.onDateSelect?.(date);
              }}
              minDate={getDateToday()}
              styles={{
                button_prev_image: { tintColor: theme.palette.primary },
                button_next_image: { tintColor: theme.palette.primary },

                disabled_label: { color: theme.palette.subtle },

                month_label: { color: theme.palette.text },
                month_selector_label: { color: theme.palette.primary },
                selected_month_label: { color: theme.palette.primary },

                year_label: { color: theme.palette.text },
                year_selector_label: { color: theme.palette.primary },
                selected_year_label: { color: theme.palette.primary },

                weekday_label: { color: theme.palette.primary },

                day_label: { color: theme.palette.text },
                today_label: { color: theme.palette.danger },
                selected_label: { color: theme.palette.success },
              }}
            />

            <Button>Set Time</Button>
          </View>
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
    content: {
      gap: theme.spacings.x2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerButton: {
      borderRadius: theme.rounded.full,
    },
  });
}
