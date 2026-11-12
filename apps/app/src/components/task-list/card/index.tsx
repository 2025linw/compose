import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { type Task, type UpdateRequest } from '@compose/types/task';

import dayjs from '@lib/datetime';

import { useTheme } from '@contexts/theme';
import { type Theme } from '@contexts/theme/types';
import { useDebouncedCallback } from '@hooks/use-debounced-callback';

import Checkbox from '@components/primitive/checkbox';
import EditableTypography from '@components/primitive/editable-typography';

import { CARD_TRANSITION_SPEED } from '../constants';
import DateBadge from './date-badge';
import DateButtonLabel from './date-button-label';

type Draft = Pick<UpdateRequest, 'title' | 'notes'>;

type TaskCardProps = {
  task: Task;
  expanded?: boolean;

  onTaskComplete?: () => void;
  onTaskReopen?: () => void;
  onTaskUpdate?: (patch: Partial<UpdateRequest>) => void;

  onPressStartDate?: (initialDate?: dayjs.Dayjs) => void;
  onPressDeadline?: (initialDate?: dayjs.Dayjs) => void;
  onPressTags?: () => void;
};

export default function TaskCard({
  task,
  expanded = false,
  ...props
}: TaskCardProps) {
  const theme = useTheme();

  const wasExpanded = useRef(expanded);
  const draftRef = useRef<Draft>({
    title: task.title,
    notes: task.notes,
  });
  const [draft, setDraft] = useState<Pick<UpdateRequest, 'title' | 'notes'>>({
    title: task.title,
    notes: task.notes,
  });
  const [panelHeight, setPanelHeight] = useState(0);
  const animatedHeight = useSharedValue(0);
  const animatedOpacity = useSharedValue(0);

  const styles = buildStyles(theme, expanded);

  const { run: scheduleUpdate, flush: flushUpdate } = useDebouncedCallback(
    (patch: Draft) => {
      props.onTaskUpdate?.(patch);
    },
    800,
  );

  function updateHandler(patch: Partial<Draft>) {
    const nextDraft = {
      ...draftRef.current,
      ...patch,
    };

    draftRef.current = nextDraft;
    setDraft(nextDraft);

    scheduleUpdate(nextDraft);
  }

  useEffect(() => {
    const justCollapsed = wasExpanded.current && !expanded;

    if (justCollapsed) {
      flushUpdate();
    }

    wasExpanded.current = expanded;
  }, [expanded, flushUpdate]);
  useEffect(() => {
    const config = {
      duration: CARD_TRANSITION_SPEED,
      easing: Easing.linear,
    };

    animatedHeight.set(withTiming(expanded ? panelHeight : 0, config));
    animatedOpacity.set(withTiming(expanded ? 1 : 0, config));
  }, [expanded, panelHeight, animatedHeight, animatedOpacity]);

  const panelAnimation = useAnimatedStyle(() => ({
    height: animatedHeight.get(),
    opacity: animatedOpacity.get(),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        <Checkbox
          defaultValue={!!task.completedAt}
          onValueChange={(checked) => {
            const handler = checked ? props.onTaskComplete : props.onTaskReopen;

            handler?.();
          }}
        />

        {task.start && !expanded && (
          <DateBadge
            type="start"
            date={dayjs(task.start.value)}
          />
        )}

        <View style={styles.titleContainer}>
          <EditableTypography
            value={draft.title}
            onChangeText={(title) => {
              updateHandler({ title });
            }}
            onSave={flushUpdate}
            placeholder="New Task"
            disabled={!expanded}
            style={styles.titleTypography}
          />
        </View>

        {task.deadline && !expanded && (
          <DateBadge
            type="deadline"
            date={dayjs(task.deadline)}
          />
        )}
      </View>

      <Animated.View
        style={panelAnimation}
        pointerEvents={expanded ? 'auto' : 'none'}
      >
        <View
          style={styles.panelContent}
          onLayout={({ nativeEvent }) => {
            setPanelHeight(nativeEvent.layout.height);
          }}
        >
          <View style={styles.fieldPanel}>
            <View style={styles.inputPanel}>
              <EditableTypography
                value={draft.notes || undefined}
                onChangeText={(notes) => {
                  updateHandler({ notes });
                }}
                onSave={flushUpdate}
                placeholder="Notes"
                disabled={!expanded}
                multiline
              />
            </View>
          </View>

          <View style={styles.buttonSet}>
            {!(task.completedAt && task.deletedAt) && (
              <DateButtonLabel
                type="start"
                date={task.start?.value || undefined}
                onPress={() => props.onPressStartDate?.(task.start?.value)}
                disabled={!expanded}
              />
            )}

            <DateButtonLabel
              type="deadline"
              date={task.deadline || undefined}
              onPress={() => props.onPressDeadline?.(task.deadline)}
              disabled={!expanded}
            />

            {/* <Button
                scheme="tertiary"
                icon={
                  <Icon
                  name="pricetag-outline"
                  size={22}
                  />
                  }
                  /> */}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function buildStyles(theme: Theme, expanded: boolean) {
  return StyleSheet.create({
    container: {
      borderRadius: theme.rounded.lg,
      padding: theme.spacings.x3,

      backgroundColor: expanded ? theme.palette.surface : 'transparent',
      overflow: 'hidden',
    },
    mainRow: {
      flexShrink: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: theme.spacings.x2,
    },
    panelContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      paddingTop: theme.spacings.x5,

      gap: theme.spacings.x2,
    },
    titleContainer: {
      flex: 1,
    },
    titleTypography: {
      backgroundColor: 'transparent',
      fontSize: 20,
    },
    fieldPanel: {
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacings.x4,
    },
    inputPanel: {
      flex: 1,

      marginLeft: 18,

      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      gap: theme.spacings.x4,
    },
    buttonSet: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: theme.spacings.x4,
    },
  });
}
