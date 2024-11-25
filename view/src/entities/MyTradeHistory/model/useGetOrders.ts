import { useInfiniteQuery } from '@tanstack/react-query';
import getOrdersApi from '../api/getOrdersApi';

const useGetOrders = () => {
  return useInfiniteQuery({
    queryKey: ['orderHistory'],
    queryFn: ({ pageParam }) => getOrdersApi({ id: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextId,
    getPreviousPageParam: () => null,
  });
};
export default useGetOrders;
