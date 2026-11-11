import { type CreateRequest } from '@compose/types/task';

import { getTaskFilter } from '@services/api/helpers';
import { getDateToday } from '@utils/date';

import Icon from '@components/primitive/icon';

import TaskListScreen from '@screens/task-list-screen';

export default function DeadlinePage() {
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
    />
  );
}
