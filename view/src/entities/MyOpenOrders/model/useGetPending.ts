import { useInfiniteQuery } from '@tanstack/react-query';
import getPendingApi from '../api/getPendingApi';

const useGetPending = () => {
  return useInfiniteQuery({
    queryKey: ['pending'],
    queryFn: ({ pageParam }) => getPendingApi({ id: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextId,
    getPreviousPageParam: () => null,
  });
};

export default useGetPending;
