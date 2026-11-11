import { getTaskFilter } from '@services/api/helpers';

import Icon from '@components/primitive/icon';

import TaskListScreen from '@screens/task-list-screen';

export default function DeadlinePage() {
  const filter = getTaskFilter('logged');

  return (
    <TaskListScreen
      filter={filter}
      creation={{ enabled: false }}
      listName="Logbook"
      listIcon={
        <Icon
          name="checkmark-circle"
          color="green"
        />
      }
    />
  );
}
