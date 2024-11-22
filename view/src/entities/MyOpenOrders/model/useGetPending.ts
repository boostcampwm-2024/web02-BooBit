import { useQuery } from '@tanstack/react-query';
import getPendingApi from '../api/getPendingApi';

const useGetPending = () => {
  return useQuery({
    queryKey: ['pending'],
    queryFn: getPendingApi,
  });
};

export default useGetPending;
