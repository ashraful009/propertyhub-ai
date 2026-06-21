import { useQuery } from '@tanstack/react-query';
import { PropertyService } from '../../services/property.service';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: () => PropertyService.getAllProperties(),
  });
};

export const useSearchProperties = (filters: any) => {
  return useQuery({
    queryKey: ['properties', 'search', filters],
    queryFn: () => PropertyService.searchProperties(filters),
    enabled: !!filters,
  });
};
