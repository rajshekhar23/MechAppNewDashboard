import { SubService } from './subServices';
export interface Service {
  service_display_name: string;
  service_name: string;
  vehicle_type: string;
  vehicle_type_id: string;
  sub_service: SubService[];
  id: string;
}
