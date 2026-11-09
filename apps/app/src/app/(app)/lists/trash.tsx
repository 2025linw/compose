import { getTaskFilter } from '@services/api/helpers';

import Icon from '@components/primitive/icon';

import TaskListScreen from '@screens/task-list-screen';

export default function TrashPage() {
  const filter = getTaskFilter('trash');

  return (
    <TaskListScreen
      filter={filter}
      creation={{ enabled: false }}
      listName="Trash"
      listIcon={
        <Icon
          name="trash-bin"
          color="gray"
        />
      }
    />
  );
}
