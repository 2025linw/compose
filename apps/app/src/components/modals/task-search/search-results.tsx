import {
  FlatList,
  type ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';

import { type Task } from '@compose/types/task';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';

import Typography from '@components/primitive/typography';

type SearchResultsProps = {
  data: Task[];
};

export default function SearchResults({ data }: SearchResultsProps) {
  const theme = useTheme();

  const styles = buildStyles(theme);

  const renderTask = ({ item }: ListRenderItemInfo<Task>) => {
    return (
      <View style={styles.container}>
        <Typography>{item.title}</Typography>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderTask}
    />
  );
}

function buildStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      padding: theme.spacings.x2,
    },
  });
}
