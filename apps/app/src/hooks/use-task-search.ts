import { useQuery } from '@tanstack/react-query';

import { searchTasks } from '@services/api/tasks';

export function useTaskSearch(search: string) {
  const query = search.trim();

  return useQuery({
    queryKey: ['tasks', 'search', query],
    queryFn: () => searchTasks(query),
    enabled: query.length > 0,
  });
}
