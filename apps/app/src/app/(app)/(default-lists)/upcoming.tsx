import { useLocalSearchParams } from 'expo-router';

import { type CreateRequest } from '@compose/types/task';

import { getTaskFilter } from '@services/api/helpers';
import { getDateToday } from '@utils/date';

import Icon from '@components/primitive/icon';

import TaskListScreen, {
  type TaskListSearchParams,
} from '@screens/task-list-screen';

type SearchParams = TaskListSearchParams;

export default function UpcomingPage() {
  const searchParams = useLocalSearchParams<SearchParams>();

  const filter = getTaskFilter('upcoming');
  const defaults: Partial<CreateRequest> = {
    start: {
      type: 'datetime',
      value: getDateToday().add(1, 'day'),
    },
  };

  return (
    <TaskListScreen
      filter={filter}
      creation={{ enabled: true, defaults }}
      listName="Upcoming"
      listIcon={
        <Icon
          name="calendar"
          color="red"
        />
      }
      searchParams={searchParams}
    />
  );
}
