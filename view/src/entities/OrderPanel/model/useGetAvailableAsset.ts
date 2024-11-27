import { useQuery } from '@tanstack/react-query';
import getAvailableAssetApi from '../api/getAvailableAssetApi';

const useGetAvailableAsset = ({ currencyCode }: { currencyCode: string }) => {
  return useQuery({
    queryKey: ['available'],
    queryFn: () => getAvailableAssetApi({ currencyCode }),
  });
};

export default useGetAvailableAsset;
