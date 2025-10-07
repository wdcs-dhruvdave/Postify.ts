import axios from "axios";
import { SignupForm, LoginForm } from "@/types/auth.types";
import { BASE_URL, HEADERS, AUTH_API, errorMessages } from "@/constants/index";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: HEADERS,
});

export const registerUser = async (data: SignupForm) => {
  try {
    const response = await apiClient.post(AUTH_API.REGISTER, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        error.message || `${errorMessages.generic} Registration Failed.`,
      );
    }
  }
};

export const loginUser = async (data: LoginForm) => {
  try {
    const response = await apiClient.post(AUTH_API.LOGIN, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || `${errorMessages.generic} Login Failed`);
    }
  }
};
