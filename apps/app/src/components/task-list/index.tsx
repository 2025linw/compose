import { useEffect, useRef, useState } from 'react';
import { type ListRenderItemInfo, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';

import { type Task, type UpdateRequest } from '@compose/types/task';

import type dayjs from '@lib/datetime';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';

import DateTimeModal from '@components/modals/date-time';

import Card from './card';
import MenuButton from './menu-button';

type TaskListProp = {
  data?: Task[];
  initTaskId?: string;
  onAddTask?: (onCreateCallback: (id: string) => void) => void;
  onTaskUpdate?: (id: string, update: Partial<UpdateRequest>) => void;
  onTaskComplete?: (id: string) => void;
  onTaskReopen?: (id: string) => void;
  onTaskTrash?: (id: string) => void;
  onTaskRestore?: (id: string) => void;
};

export default function TaskList({
  data,
  initTaskId,
  onAddTask,
  onTaskUpdate,
  onTaskComplete,
  onTaskReopen,
  onTaskTrash,
  onTaskRestore,
}: TaskListProp) {
  const theme = useTheme();

  const taskAdded = useRef<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(
    initTaskId || null,
  );
  const [dateModal, setDateModal] = useState<{
    taskId: string;
    state: 'start' | 'deadline';
    initialDate?: dayjs.Dayjs;
  } | null>(null);
  const touchedCard = useSharedValue(false);

  const styles = buildStyles(theme);
  const activeExpandedTask =
    data?.find((task) => task.id === expandedTaskId) ?? null;

  function taskPressHandler(id: string) {
    if (activeExpandedTask === null) {
      setExpandedTaskId(id);
    } else if (id !== activeExpandedTask.id) {
      setExpandedTaskId(null);
    }
  }
  const addTaskHandler = onAddTask
    ? () => {
        onAddTask?.((id) => {
          taskAdded.current = id;
        });
      }
    : undefined;

  function renderTask({ item: task }: ListRenderItemInfo<Task>) {
    const expanded = !!activeExpandedTask && task.id === activeExpandedTask.id;

    return (
      <Pressable
        onPress={() => taskPressHandler(task.id)}
        onStartShouldSetResponderCapture={() => {
          touchedCard.set(true);

          return false;
        }}
      >
        <Card
          task={task}
          expanded={expanded}

          onTaskUpdate={(patch) => onTaskUpdate?.(task.id, patch)}
          onTaskComplete={() => onTaskComplete?.(task.id)}
          onTaskReopen={() => onTaskReopen?.(task.id)}

          onPressStartDate={(date) => {
            setDateModal({
              taskId: task.id,
              state: 'start',
              initialDate: date,
            });
          }}
          onPressDeadline={(date) => {
            setDateModal({
              taskId: task.id,
              state: 'deadline',
              initialDate: date,
            });
          }}
        />
      </Pressable>
    );
  }

  useEffect(() => {
    const newTask = data?.find((task) => task.id === taskAdded.current);
    if (newTask) {
      setExpandedTaskId(newTask.id);
    }

    taskAdded.current = null;
  }, [taskAdded, data]);

  return (
    <>
      <Pressable
        style={styles.container}
        onStartShouldSetResponderCapture={() => {
          touchedCard.set(false);

          return false;
        }}
        onPress={() => setExpandedTaskId(null)}
      >
        <Animated.FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
        />
      </Pressable>

      <MenuButton
        state={activeExpandedTask ? 'card' : 'list'}
        style={styles.menuButton}
        deleted={!!activeExpandedTask?.deletedAt}
        onAddTask={addTaskHandler}
        onTrashTask={() => {
          if (activeExpandedTask) onTaskTrash?.(activeExpandedTask.id);
        }}
        onRestoreTask={() => {
          if (activeExpandedTask) onTaskRestore?.(activeExpandedTask.id);
        }}
      />

      {dateModal && (
        <DateTimeModal
          mode={dateModal.state}
          taskId={dateModal.taskId}
          initialDate={dateModal.initialDate}
          onDateSelect={(selectedDate) => {
            const state = dateModal.state;
            if (state === 'start') {
              onTaskUpdate?.(dateModal.taskId, {
                start: selectedDate && {
                  type: 'datetime',
                  value: selectedDate,
                },
              });
            } else {
              onTaskUpdate?.(dateModal.taskId, {
                deadline: selectedDate,
              });
            }

            setDateModal(null);
          }}
          dismiss={() => {
            setDateModal(null);
          }}
        />
      )}
    </>
  );
}

function buildStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    menuButton: {
      position: 'absolute',
      bottom: theme.spacings.x8,
      right: theme.spacings.x8,

      zIndex: theme.zHeight.modal,
    },
  });
}
