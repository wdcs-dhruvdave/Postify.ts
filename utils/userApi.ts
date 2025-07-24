import axios from 'axios';
import { SignupForm, LoginForm } from '../types/auth.types'; 

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const registerUser = async (data: SignupForm) => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Internel Server Error,Registration Failed.');
  }
};

export const loginUser = async (data: LoginForm) => {
  try {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error( error.response?.data?.message|| 'Internel Server Error,Login Failed')
  }
}
