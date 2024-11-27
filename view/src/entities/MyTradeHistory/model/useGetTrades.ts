import { useInfiniteQuery } from '@tanstack/react-query';
import getTradesApi from '../api/getTradesApi';

const useGetTrades = () => {
  return useInfiniteQuery({
    queryKey: ['tradeHistory'],
    queryFn: ({ pageParam }) => getTradesApi({ id: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextId,
    getPreviousPageParam: () => null,
  });
};
export default useGetTrades;
