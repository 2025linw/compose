import { getDateToday, toDate, toDatetime } from '@utils/date';

import { type Category, type QueryParams, type TaskFilterQuery } from './types';

export function getTaskFilter(category: Category): TaskFilterQuery {
  const today = getDateToday();
  const tomorrow = today.add(1, 'day');

  switch (category) {
    case 'inbox':
      return { startDate: { type: 'ex', state: false } };
    case 'today':
      return { startDate: { type: 'cmp', date: tomorrow, cmp: 'lt' } };
    case 'upcoming':
      return { startDate: { type: 'cmp', date: tomorrow, cmp: 'gte' } };
    case 'deadline':
      return { deadline: { type: 'ex', state: true } };
    case 'logged':
      return { completed: true, sortBy: 'completedAt', sortOrder: 'desc' };
    case 'trash':
      return { deleted: true, sortBy: 'deletedAt', sortOrder: 'desc' };
    default: {
      const exhaustive: never = category;
      return exhaustive;
    }
  }
}

export function buildTaskQuery(query: TaskFilterQuery): QueryParams {
  const params: QueryParams = {};
  if (query.startDate !== undefined) {
    const type = query.startDate.type;
    if (type === 'ex') {
      params['start'] = String(query.startDate.state);
    } else if (type === 'eq') {
      params['start'] = toDatetime(query.startDate.date);
    } else {
      params[`start[${query.startDate.cmp}]`] = toDatetime(
        query.startDate.date,
      );
    }
  }
  if (query.deadline !== undefined) {
    const type = query.deadline.type;
    if (type === 'ex') {
      params['deadline'] = String(query.deadline.state);
    } else if (type === 'eq') {
      params['deadline'] = toDate(query.deadline.date);
    } else {
      params[`deadline[${query.deadline.cmp}]`] = toDate(query.deadline.date);
    }
  }

  if (query.completed !== undefined) {
    params['completed'] = String(query.completed);
  }
  if (query.deleted !== undefined) {
    params['deleted'] = String(query.deleted);
  }

  if (query.sortBy !== undefined) {
    params['sort'] = query.sortBy;
  }
  if (query.sortOrder !== undefined) {
    params['order'] = query.sortOrder;
  }

  return params;
}
