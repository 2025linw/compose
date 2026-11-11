import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type Task } from '@compose/types/task';

import { getDateToday } from '@utils/date';

import { useSearchContext } from '@contexts/search';
import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';
import { useDebouncedValue } from '@hooks/use-debounced-value';
import { useTaskSearch } from '@hooks/use-task-search';
import { useToast } from '@hooks/use-toast';

import TextInput from '@components/primitive/text-input';

import SearchResults from './search-results';

export default function TaskSearchModal() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const toast = useToast();
  const { visible, closeSearch } = useSearchContext();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const searchResults = useTaskSearch(debouncedSearch);

  const styles = buildStyles(theme);
  const tasks = searchResults.data?.data.tasks ?? [];

  function taskSelectHandler(task: Task) {
    const href = resolveTaskDestination(task);
    if (!href) {
      toast.error('Unable to resolve task destination');
      return;
    }

    router.navigate(href);
    setSearch('');
    closeSearch();
  }

  return (
    <Modal
      visible={visible}
      transparent
    >
      <View
        style={[
          styles.overlay,
          { paddingTop: insets.top + theme.spacings.x16 },
        ]}
      >
        <Pressable
          onPress={() => {
            closeSearch();
            setSearch('');
          }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.container}>
          <TextInput
            onChangeText={setSearch}
            autoFocus
            autoCorrect={false}
            autoComplete="off"
            autoCapitalize="none"
          />

          {tasks.length > 0 && (
            <View style={styles.results}>
              <SearchResults
                data={searchResults.data?.data.tasks ?? []}
                onSelectTask={taskSelectHandler}
              />
            </View>
          )}
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
      justifyContent: 'flex-start',
    },
    container: {
      width: '90%',
      maxWidth: 600,
      maxHeight: '80%',

      flexShrink: 1,

      marginHorizontal: theme.spacings.x4,
      padding: theme.spacings.x4,
      gap: theme.spacings.x4,

      borderWidth: theme.spacings.thin,
      borderColor: theme.palette.border,
      borderRadius: theme.rounded.lg,

      backgroundColor: theme.palette.surface,
    },
    results: {
      minHeight: 0,

      flexShrink: 1,
    },
  });
}

function resolveTaskDestination(item: Task): Href | null {
  const today = getDateToday();

  const startDate = item.start?.value.startOf('day');
  const deadlineDate = item.deadline?.startOf('day');

  let href: Href;
  if (!startDate) {
    href = '/inbox';
  } else if (!startDate.isAfter(today)) {
    href = '/today';
  } else if (startDate.isAfter(today)) {
    href = '/upcoming';
  } else if (deadlineDate) {
    href = '/deadline';
  } else {
    return null;
  }

  return (href + `?taskId=${item.id}`) as Href;
}
