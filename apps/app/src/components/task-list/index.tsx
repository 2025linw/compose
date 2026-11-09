import { useEffect, useRef, useState } from 'react';
import { type ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { type Task, type UpdateRequest } from '@compose/types/task';

import type dayjs from '@lib/datetime';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';

import DateTimeModal from '@components/modals/date-time';

import Card from './card';
import MenuButton from './menu-button';

type TaskListProp = {
  data?: Task[];
  onAddTask?: (onCreateCallback: (id: string) => void) => void;
  onTaskUpdate?: (id: string, update: Partial<UpdateRequest>) => void;
  onTaskComplete?: (id: string) => void;
  onTaskReopen?: (id: string) => void;
  onTaskTrash?: (id: string) => void;
  onTaskRestore?: (id: string) => void;
};

export default function TaskList({
  data,
  onAddTask,
  onTaskUpdate,
  onTaskComplete,
  onTaskReopen,
  onTaskTrash,
  onTaskRestore,
}: TaskListProp) {
  const theme = useTheme();

  const taskAdded = useRef<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<Task | null>(null);
  const [dateModal, setDateModal] = useState<{
    taskId: string;
    state: 'start' | 'deadline';
    initialDate?: dayjs.Dayjs;
  } | null>(null);
  const touchedCard = useSharedValue(false);

  const styles = buildStyles(theme);
  const activeExpandedTask = data?.some(({ id }) => id === expandedTask?.id)
    ? expandedTask
    : null;
  const tapGesture = Gesture.Tap()
    .maxDistance(5)
    .cancelsTouchesInView(false)
    .onEnd((_e, success) => {
      if (success && !touchedCard.get()) {
        scheduleOnRN(setExpandedTask, null);
      }
    });

  const taskPressHandler = (id: string) => {
    if (activeExpandedTask === null) {
      setExpandedTask(data?.find((task) => task.id === id) || null);
    } else if (activeExpandedTask.id !== id) {
      setExpandedTask(null);
    }
  };
  const addTaskHandler = onAddTask
    ? () => {
        onAddTask?.((id) => {
          taskAdded.current = id;
        });
      }
    : undefined;

  const renderTask = ({ item }: ListRenderItemInfo<Task>) => {
    const expanded = item.id === activeExpandedTask?.id;

    return (
      <View
        onStartShouldSetResponderCapture={() => {
          touchedCard.set(true);

          return false;
        }}
      >
        <Card
          task={item}
          expanded={expanded}

          onPress={() => taskPressHandler(item.id)}

          onTaskUpdate={(patch) => onTaskUpdate?.(item.id, patch)}
          onTaskComplete={() => onTaskComplete?.(item.id)}
          onTaskReopen={() => onTaskReopen?.(item.id)}

          onPressStartDate={(date) => {
            setDateModal({
              taskId: item.id,
              state: 'start',
              initialDate: date,
            });
          }}
          onPressDeadline={(date) => {
            setDateModal({
              taskId: item.id,
              state: 'deadline',
              initialDate: date,
            });
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    const newTask = data?.find((task) => taskAdded.current === task.id);
    if (newTask) {
      setExpandedTask(newTask);
    }

    taskAdded.current = null;
  }, [taskAdded, data]);

  return (
    <>
      <View
        style={styles.container}
        onStartShouldSetResponderCapture={() => {
          touchedCard.set(false);

          return false;
        }}
      >
        <GestureDetector gesture={tapGesture}>
          <Animated.FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderTask}
            showsVerticalScrollIndicator={false}
          />
        </GestureDetector>
      </View>

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
