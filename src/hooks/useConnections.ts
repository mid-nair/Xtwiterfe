import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from '@/lib/queryKeys';
import { userService } from '@/services/userService';
import type { ConnectionKind } from '@/types/user';

/** Cursor-paginated Followers / Following list for a profile. */
export function useConnections(username: string, kind: ConnectionKind) {
    const query = useInfiniteQuery({
        queryKey: queryKeys.users.connections(username, kind),
        queryFn: ({ pageParam }) => userService.connections(username, kind, pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
        enabled: !!username,
    });

    const users = useMemo(() => query.data?.pages.flatMap((page) => page.data) ?? [], [query.data]);

    return {
        users,
        isLoading: query.isLoading,
        isError: query.isError,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: query.fetchNextPage,
        refetch: query.refetch,
    };
}
