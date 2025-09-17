export const TOKEN_KEY = "token";

export const AUTH_HEADER = (token: string) => `Bearer ${token}`;

export const authEndpoints = {
  register: "/auth/register",
  login: "/auth/login",
};
