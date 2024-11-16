import { useQuery } from '@tanstack/react-query';
import getAssetsApi from '../api/getAssetsApi';

const useGetAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: getAssetsApi,
    retry: 1,
  });
};

export default useGetAssets;
