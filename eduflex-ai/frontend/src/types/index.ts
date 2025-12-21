export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  role: 'student' | 'faculty' | 'admin' | 'super_admin';
  department_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
