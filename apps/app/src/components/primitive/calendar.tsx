import { useCalendars } from 'expo-localization';
import { useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';

import dayjs from '@lib/datetime';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';

import Button from '@components/primitive/button';

type CalendarProps = {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (selectedDate: Date | null) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

export default function Calendar({
  value,
  defaultValue,
  onValueChange,
  disabled,
  minDate,
  maxDate,
}: CalendarProps) {
  const theme = useTheme();
  const calendars = useCalendars();

  const [internalDate, setInternalDate] = useState(defaultValue ?? null);
  const [gridWidth, setGridWidth] = useState(0);

  const styles = buildStyles(theme);
  const firstDayOfWeek = (calendars[0]?.firstWeekday ?? 1) - 1;
  const use12Hours = !calendars[0].uses24hourClock;
  const resolvedDate = value ?? internalDate;

  const [visibleDate, setVisibleDate] = useState(() =>
    (resolvedDate ? dayjs(resolvedDate) : dayjs()).startOf('month'),
  );
  const weekCount = getWeekCount(visibleDate, firstDayOfWeek);

  function setMonth(offset: number) {
    setVisibleDate((current) => {
      return current.add(offset, 'month');
    });
  }

  return (
    <View
      onLayout={({ nativeEvent }) => {
        setGridWidth(nativeEvent.layout.width);
      }}
    >
      <DateTimePicker
        mode="single"
        use12Hours={use12Hours}
        hideHeader
        firstDayOfWeek={firstDayOfWeek}
        year={visibleDate.year()}
        month={visibleDate.month()}
        date={resolvedDate ?? undefined}
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

          onValueChange?.(resolvedDate);
        }}
        minDate={minDate}
        maxDate={maxDate}
        navigationPosition="right"
        containerHeight={
          gridWidth > 0 ? Math.ceil((gridWidth / 7) * weekCount) : undefined
        }
        style={styles.container}
        containerStyle={styles.calendar_container}
        styles={{
          // Header Elements
          header: styles.header_container,

          month_selector_label: styles.selector_label,
          year_selector_label: styles.selector_label,

          button_prev: styles.nav_button_container,
          button_prev_image: styles.nav_button_icon,
          button_next: styles.nav_button_container,
          button_next_image: styles.nav_button_icon,

          // Weekday Elements

          // Main Calendar Elements
          year_label: styles.ui_label,
          month_label: styles.ui_label,
          weekday_label: styles.ui_label,
          day_label: styles.ui_label,

          today_label: styles.today_label,

          day_cell: styles.day_cell,
          day: styles.day_container,
          today: styles.today_container,
          outside_label: styles.disabled_label,
          disabled_label: styles.disabled_label,

          // Selected Element Styles
          active_year_label: styles.today_label,
          selected_year_label: styles.selected_label,
          selected_month_label: styles.selected_label,
          selected_label: styles.selected_label,
        }}
      />

      <View>
        <Button onPress={() => setMonth(-1)}>Prev</Button>
        <Button onPress={() => setMonth(1)}>Next</Button>
      </View>
    </View>
  );
}

function buildStyles(theme: Theme) {
  const day_container: ViewStyle = {
    borderWidth: theme.spacings.thin,
    borderRadius: theme.rounded.base,
  };

  return StyleSheet.create({
    container: {
      padding: theme.spacings.x2,

      borderRadius: theme.rounded.lg,

      backgroundColor: theme.palette.surface,
    },
    calendar_container: {
      width: '100%',
    },

    // Header Styles
    header_container: {
      flex: 1,
      marginBottom: theme.spacings.x2,
      paddingHorizontal: theme.spacings.x1,

      borderRadius: theme.rounded.base,

      backgroundColor: theme.palette.primary,
    },

    nav_button_container: {
      padding: 1.5 * theme.spacings.x1,

      borderWidth: theme.spacings.thin,
      borderColor: theme.palette.text,
      borderRadius: theme.rounded.base,
    },
    nav_button_icon: {
      tintColor: theme.palette.text,
    },

    // UI Text Styles
    ui_label: {
      // Default text style
      color: theme.palette.text,
    },
    selector_label: {
      // Selectable text style
      color: theme.palette.text,
    },
    today_label: {
      // Today button text style
      color: theme.palette.colors.red['red-9'],
    },
    selected_label: {
      // Selected element text style
      color: theme.palette.colors.blue['blue-9'],
    },
    disabled_label: {
      // Disabled element text style
      color: 'transparent',
    },

    // Calendar Element Styles
    day_cell: {
      // Calendar grid style
      aspectRatio: 1,

      padding: theme.spacings.x2,
    },
    day_container: {
      // Day button style
      ...day_container,
      borderColor: 'transparent',
    },
    today_container: {
      // Today button style
      ...day_container,
      borderColor: theme.palette.colors.blue['blue-9'],
    },
  });
}

function getWeekCount(month: dayjs.Dayjs, firstDayOfWeek = 0) {
  const firstDay = month.startOf('month').day();
  const leadingDays = (firstDay - firstDayOfWeek + 7) % 7;

  return Math.ceil((leadingDays + month.daysInMonth()) / 7);
}

export function Demo() {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ gap: 16, padding: 10 }}>
      <Calendar />

      <Calendar value={dayjs().toDate()} />

      <Calendar minDate={dayjs().toDate()} />
    </View>
  );
}
