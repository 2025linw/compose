import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useSearchContext } from '@contexts/search';
import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';
import { useDebouncedValue } from '@hooks/use-debounced-value';
import { useTaskSearch } from '@hooks/use-task-search';

import TextInput from '@components/primitive/text-input';

import SearchResults from './search-results';

export default function TaskSearchModal() {
  const theme = useTheme();
  const { visible, closeSearch } = useSearchContext();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const results = useTaskSearch(debouncedSearch);
  const styles = buildStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
    >
      <View style={styles.overlay}>
        <Pressable
          onPress={() => {
            closeSearch();
            setSearch('');
          }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.container}>
          <View style={styles.content}>
            <TextInput onChangeText={setSearch} />

            <SearchResults data={results.data?.data.tasks ?? []} />
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
    content: {},
  });
}
