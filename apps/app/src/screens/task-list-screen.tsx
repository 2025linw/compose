import { type ReactElement } from 'react';
import { StyleSheet } from 'react-native';

import { type CreateRequest } from '@compose/types/task';

import { type TaskFilterQuery } from '@services/api/types';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';
import { useBreakpoints } from '@hooks/use-breakpoint';
import * as TaskHook from '@hooks/use-tasks';

import Layout from '@components/layout';
import { type IconProps } from '@components/primitive/icon';
import TaskList from '@components/task-list';

const taskDefaults = {
  title: '',
  positionKey: 'm',
  tags: [],
};

type TaskCreation =
  | {
      enabled: false;
    }
  | {
      enabled: true;
      defaults?: Partial<CreateRequest>;
    };

type TaskListScreenProps = {
  filter: TaskFilterQuery;
  creation: TaskCreation;
  listName: string;
  listIcon?: ReactElement<IconProps>;
};

export default function TaskListScreen({
  filter,
  creation,
  ...props
}: TaskListScreenProps) {
  const theme = useTheme();
  const { gtTablet } = useBreakpoints();

  const styles = buildStyles(theme, !gtTablet);

  const queryTasks = TaskHook.useTasks(filter);

  const createTask = TaskHook.useCreateTask();
  const updateTask = TaskHook.useUpdateTask();
  const completeTask = TaskHook.useCompleteTask();
  const reopenTask = TaskHook.useReopenTask();
  const trashTask = TaskHook.useTrashTask();
  const restoreTask = TaskHook.useRestoreTask();

  const onAddTask = creation.enabled
    ? (onCreateCallback: (id: string) => void) => {
        createTask.mutate(
          { ...taskDefaults, ...creation.defaults },
          {
            onSuccess: ({ data }) => {
              onCreateCallback(data.id);
            },
          },
        );
      }
    : undefined;

  return (
    <Layout
      headerText={props.listName}
      headerIcon={props.listIcon}
      showBackButton={!gtTablet}
      style={styles.container}
    >
      <TaskList
        data={queryTasks.data?.data.tasks}

        onAddTask={onAddTask}
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
