import { useLocalSearchParams } from 'expo-router/build/hooks';

import { type CreateRequest } from '@compose/types/task';

import { getTaskFilter } from '@services/api/helpers';
import { getDateToday } from '@utils/date';

import Icon from '@components/primitive/icon';

import TaskListScreen, {
  type TaskListSearchParams,
} from '@screens/task-list-screen';

type SearchParams = TaskListSearchParams;

export default function DeadlinePage() {
  const searchParams = useLocalSearchParams<SearchParams>();

  const filter = getTaskFilter('deadline');
  const defaults: Partial<CreateRequest> = {
    deadline: getDateToday(),
  };

  return (
    <TaskListScreen
      filter={filter}
      creation={{ enabled: true, defaults }}
      listName="Deadline"
      listIcon={
        <Icon
          name="flag"
          color="red"
        />
      }
      searchParams={searchParams}
    />
  );
}
