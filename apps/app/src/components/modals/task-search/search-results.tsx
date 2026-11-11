import { FlatList, type ListRenderItemInfo } from 'react-native';

import { type Task } from '@compose/types/task';

import Button from '@components/primitive/button';

type SearchResultsProps = {
  data: Task[];
  onSelectTask: (task: Task) => void;
};

export default function SearchResults({
  data,
  onSelectTask,
}: SearchResultsProps) {
  function renderTask({ item }: ListRenderItemInfo<Task>) {
    return (
      <Button
        scheme="tertiary"
        onPress={() => onSelectTask(item)}
      >
        {item.title}
      </Button>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderTask}
      scrollEnabled={false}
    />
  );
}
