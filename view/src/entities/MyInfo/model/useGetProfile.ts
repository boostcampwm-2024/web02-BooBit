import { useQuery } from '@tanstack/react-query';
import getProfileApi from '../api/getProfileApi';

const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfileApi,
    retry: 1,
  });
};

export default useGetProfile;
