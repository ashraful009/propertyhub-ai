export interface ISystemPolicy {
  id?: number;
  policy_type: string;
  title: string;
  content: string;
  is_mandatory?: boolean;
  updated_at?: Date;
  created_at?: Date;
}
