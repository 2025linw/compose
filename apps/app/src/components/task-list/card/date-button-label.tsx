import { StyleSheet } from 'react-native';

import type dayjs from '@lib/datetime';
import { getDateToday } from '@utils/date';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';

import Button from '@components/primitive/button';
import Icon from '@components/primitive/icon';

import { type DateType } from './types';

type DateButtonLabelProps = {
  type: DateType;
  date?: dayjs.Dayjs;
  disabled?: boolean;
  onPress?: () => void;
};

export default function DateButtonLabel({
  type,
  disabled = false,
  ...props
}: DateButtonLabelProps) {
  const theme = useTheme();
  const styles = buildStyles(theme);

  return (
    <Button
      scheme="tertiary"
      textStyle={styles.text}
      leftIcon={
        <Icon
          name={type === 'start' ? 'calendar-outline' : 'flag'}
          size={22}
          color={type === 'start' ? undefined : theme.palette.danger}
        />
      }
      onPress={() => props.onPress?.()}
      disabled={disabled}
    >
      {props.date && formatDate(props.date, type)}
    </Button>
  );
}

function buildStyles(theme: Theme) {
  return StyleSheet.create({
    text: {
      ...theme.components.Typography.variants.text,
    },
  });
}

function formatDate(inputDate: dayjs.Dayjs, type: DateType) {
  const date = inputDate.startOf('day');
  const today = getDateToday();

  const isBeforeToday = date.isBefore(today);
  const isToday = date.isSame(today);
  const isWithinYear = date.isBefore(today.startOf('year').add(1, 'year'));

  switch (type) {
    case 'start':
      if (isBeforeToday) {
        return date.format('M/D');
      } else if (isToday) {
        return 'Today';
      } else if (isWithinYear) {
        return date.format('ddd, MMM D');
      } else {
        return date.format('ddd, M/YYYY');
      }
    case 'deadline':
      if (isBeforeToday) {
        return date.format(`MM/DD[, ${today.diff(date, 'day')}d ago]`);
      } else if (isToday) {
        return 'Today';
      } else if (isWithinYear) {
        return date.format(`ddd, MMM D[, ${date.diff(today, 'day')}d left]`);
      } else {
        return date.format('ddd, M/YYYY');
      }
    default:
      const exhaustive: never = type;
      return exhaustive;
  }
}
