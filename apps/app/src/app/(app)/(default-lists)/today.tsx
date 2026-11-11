import { useLocalSearchParams } from 'expo-router';

import { type CreateRequest } from '@compose/types/task';

import { getTaskFilter } from '@services/api/helpers';
import { getDateToday } from '@utils/date';

import Icon from '@components/primitive/icon';

import TaskListScreen, {
  type TaskListSearchParams,
} from '@screens/task-list-screen';

type SearchParams = TaskListSearchParams;

export default function TodayPage() {
  const searchParams = useLocalSearchParams<SearchParams>();

  const filter = getTaskFilter('today');
  const defaults: Partial<CreateRequest> = {
    start: {
      type: 'datetime',
      value: getDateToday(),
    },
  };

  return (
    <TaskListScreen
      filter={filter}
      creation={{ enabled: true, defaults }}
      listName="Today"
      listIcon={
        <Icon
          name="today"
          color="#EAB308"
        />
      }
      searchParams={searchParams}
    />
  );
}
