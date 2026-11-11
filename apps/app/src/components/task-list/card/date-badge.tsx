import { StyleSheet } from 'react-native';

import type dayjs from '@lib/datetime';
import { getDateToday, getDayOfWeek } from '@utils/date';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';

import Icon from '@components/primitive/icon';
import Typography from '@components/primitive/typography';

import { type DateType } from './types';

type DateBadgeProps = {
  type: DateType;
  date: dayjs.Dayjs;
};

export default function DateBadge({ type, ...props }: DateBadgeProps) {
  const theme = useTheme();
  const styles = buildStyles(theme);

  const today = getDateToday();
  const date = props.date.startOf('day');

  if (type === 'start' && date.isSame(today)) {
    // today star (only for Start Badge)
    return (
      <Icon
        name="star"
        color="gold"
      />
    );
  } else {
    return (
      <Typography style={styles.text}>
        {formatDate(props.date, type)}
      </Typography>
    );
  }
}

function buildStyles(theme: Theme) {
  return StyleSheet.create({
    text: {
      color: theme.palette.primary,
    },
  });
}

function formatDate(inputDate: dayjs.Dayjs, type: DateType) {
  const date = inputDate.startOf('day');
  const today = getDateToday();

  const isBeforeToday = date.isBefore(today);
  const isToday = date.isSame(today);
  const isWithinWeek = date.isBefore(today.add(1, 'week'));
  const isWithinMonth = date.isBefore(today.add(1, 'month'));
  const isWithin6Months = date.isBefore(
    today.startOf('month').add(6, 'months'),
  );
  const isWithinYear = date.isBefore(today.startOf('year').add(1, 'year'));

  switch (type) {
    case 'start':
      if (isBeforeToday) {
        return date.format('M/D');
      } else if (isToday) {
        return 'Today';
      } else if (isWithinWeek) {
        return getDayOfWeek(date, true);
      } else if (isWithin6Months) {
        return date.format('M/D');
      } else {
        return date.format('M/YYYY');
      }
    case 'deadline':
      if (isBeforeToday) {
        return `${today.diff(date, 'day')}d ago`;
      } else if (isToday) {
        return 'Today';
      } else if (isWithinMonth) {
        return `${date.diff(today, 'day')}d left`;
      } else if (isWithinYear) {
        return date.format('M/D');
      } else {
        return date.format('M/YYYY');
      }
    default:
      const exhaustive: never = type;
      return exhaustive;
  }
}
