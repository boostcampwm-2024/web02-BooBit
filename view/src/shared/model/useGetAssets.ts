import { useQuery } from '@tanstack/react-query';
import getAssetsApi from '../api/getAssetsApi';

const useGetAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: getAssetsApi,
    select: (data) => data.assets,
  });
};

export default useGetAssets;
