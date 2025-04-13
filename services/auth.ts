import api from '@/apiconfig'; // Import the API configuration
import { RegisterRoleRequest, RegisterRoleResponse, ErrorResponse } from '@/types/auth_types'; // Import the types

// Function to register a role
export const registerRole = async (role: RegisterRoleRequest['role']): Promise<RegisterRoleResponse> => {
    try {
        const response = await api.post<RegisterRoleResponse>('/register-role', {
            role,
        });
        return response.data;
    } catch (error: any) {
        // Handling errors in the API call
        const errorData: ErrorResponse = error.response?.data || {
            message: 'Something went wrong',
            status: error.response?.status || 500,
        };
        throw new Error(errorData.message);
    }
};

// Example of another API call, for fetching user data (can be expanded)
export const fetchUserData = async (userId: string): Promise<any> => {
    try {
        const response = await api.get(`/user/${userId}`);
        return response.data;
    } catch (error: any) {
        const errorData: ErrorResponse = error.response?.data || {
            message: 'Error fetching user data',
            status: error.response?.status || 500,
        };
        throw new Error(errorData.message);
    }
};
