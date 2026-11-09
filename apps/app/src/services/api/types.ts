import type dayjs from '@lib/datetime';

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type SortOrder = 'asc' | 'desc';

export type Cmp = 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';

export type DateQuery =
  | { type: 'ex'; state: boolean }
  | { type: 'eq'; date: dayjs.Dayjs }
  | {
      type: 'cmp';
      cmp: Cmp;
      date: dayjs.Dayjs;
    };

export type TaskQuery = {
  startDate?: DateQuery;
  deadline?: DateQuery;

  completed?: boolean;
  deleted?: boolean;

  sortBy?: string;
  sortOrder?: SortOrder;
};

export type Category =
  'inbox' | 'today' | 'upcoming' | 'deadline' | 'logged' | 'trash';
