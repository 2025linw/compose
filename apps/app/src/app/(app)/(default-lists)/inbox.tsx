import { useLocalSearchParams } from 'expo-router';

import { getTaskFilter } from '@services/api/helpers';

import Icon from '@components/primitive/icon';

import TaskListScreen, {
  type TaskListSearchParams,
} from '@screens/task-list-screen';

type SearchParams = TaskListSearchParams;

export default function InboxPage() {
  const searchParams = useLocalSearchParams<SearchParams>();

  const filter = getTaskFilter('inbox');
  const creation = {
    enabled: true,
  };

  return (
    <TaskListScreen
      filter={filter}
      creation={creation}
      listName="Inbox"
      listIcon={
        <Icon
          name="file-tray"
          color="skyblue"
        />
      }
      searchParams={searchParams}
    />
  );
}
