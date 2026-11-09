import { getTaskFilter } from '@services/api/helpers';

import Icon from '@components/primitive/icon';

import TaskListScreen from '@screens/task-list-screen';

export default function InboxPage() {
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
    />
  );
}
