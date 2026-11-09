import { type ReactElement } from 'react';
import { StyleSheet } from 'react-native';

import { type CreateRequest } from '@compose/types/task';

import { getCategoryQuery } from '@services/api/helpers';
import { type Category } from '@services/api/types';
import { getDateToday } from '@utils/date';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';
import { useBreakpoints } from '@hooks/use-breakpoint';
import * as TaskHook from '@hooks/use-tasks';

import Layout from '@components/layout';
import { type IconProps } from '@components/primitive/icon';
import TaskList from '@components/task-list';

type ListScreenProps = {
  listName: string;
  listIcon?: ReactElement<IconProps>;
  category: Category;
};

export default function ListScreen(props: ListScreenProps) {
  const theme = useTheme();
  const { gtTablet } = useBreakpoints();

  const styles = buildStyles(theme, !gtTablet);

  const searchQuery = getCategoryQuery(props.category);

  const queryTasks = TaskHook.useTasks(searchQuery);

  const createTask = TaskHook.useCreateTask();
  const updateTask = TaskHook.useUpdateTask();
  const completeTask = TaskHook.useCompleteTask();
  const reopenTask = TaskHook.useReopenTask();
  const trashTask = TaskHook.useTrashTask();
  const restoreTask = TaskHook.useRestoreTask();

  return (
    <Layout
      headerText={props.listName}
      headerIcon={props.listIcon}
      showBackButton={!gtTablet}
      style={styles.container}
    >
      <TaskList
        data={queryTasks.data?.data.tasks}

        onAddTask={(onCreateCallback) => {
          const category = props.category;
          if (category !== 'logged' && category !== 'trash')
            createTask.mutate(createTaskPayload(category), {
              onSuccess: ({ data }) => {
                onCreateCallback(data.id);
              },
            });
        }}
        onTaskUpdate={(id, update) =>
          updateTask.mutate({ id, payload: update })
        }
        onTaskComplete={(id) => completeTask.mutate(id)}
        onTaskReopen={(id) => reopenTask.mutate(id)}
        onTaskTrash={(id) => trashTask.mutate(id)}
        onTaskRestore={(id) => restoreTask.mutate(id)}
      />
    </Layout>
  );
}

function buildStyles(theme: Theme, isMobile: boolean) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: isMobile ? theme.spacings.x2 : theme.spacings.x10,
    },
  });
}

const requiredTask: CreateRequest = {
  title: '',
  tags: [],
  positionKey: 'm',
};

type CreatableCategory = Extract<
  Category,
  'inbox' | 'today' | 'upcoming' | 'deadline'
>;

function createTaskPayload(category: CreatableCategory): CreateRequest {
  switch (category) {
    case 'inbox':
      return requiredTask;
    case 'today':
      return {
        ...requiredTask,
        start: {
          type: 'datetime',
          value: getDateToday(),
        },
      };
    case 'upcoming':
      return {
        ...requiredTask,
        start: {
          type: 'datetime',
          value: getDateToday().add(1, 'day'),
        },
      };
    case 'deadline':
      return {
        ...requiredTask,
        deadline: getDateToday(),
      };
    default:
      const exhaustive: never = category;
      return exhaustive;
  }
}
