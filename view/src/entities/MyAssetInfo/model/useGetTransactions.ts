import { useInfiniteQuery } from '@tanstack/react-query';
import getTransactionsApi from '../api/getTransactionsApi';

const useGetTransactions = ({ currencyCode }: { currencyCode: string }) => {
  return useInfiniteQuery({
    queryKey: ['transactions', currencyCode],
    queryFn: ({ pageParam }) => getTransactionsApi({ currencyCode, id: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextId,
    getPreviousPageParam: () => null,
  });
};
export default useGetTransactions;
