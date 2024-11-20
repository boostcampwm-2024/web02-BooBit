import { useQuery } from '@tanstack/react-query';
import getAssetsApi from '../../../pages/MyPage/api/getAssetsApi';

const useGetAssets = () => {
  return useQuery({
    queryKey: ['asset', 'order'],
    queryFn: getAssetsApi,
    select: (data) => data.assets,
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetAssets;
