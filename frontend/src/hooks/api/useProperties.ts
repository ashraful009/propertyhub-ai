import { useQuery } from '@tanstack/react-query';
import { PropertyService } from '../../services/property.service';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: () => PropertyService.getAllProperties(),
  });
};

export const usePropertyDetails = (id: string) => {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => PropertyService.getPropertyById(id),
    enabled: !!id,
  });
};

export const useSearchProperties = (filters: Record<string, string>) => {
  return useQuery({
    queryKey: ['properties', 'search', filters],
    queryFn: () => PropertyService.searchProperties(filters),
    enabled: !!filters,
  });
};
