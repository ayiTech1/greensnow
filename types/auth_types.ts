// Define the data structure for user registration
export interface RegisterRoleResponse {
  sessionId: string;
  message: string;
}

export interface RegisterRoleRequest {
  role: 'EMPLOYER' | 'EMPLOYEE';
}

export interface ErrorResponse {
  message: string;
  status: number;
}
