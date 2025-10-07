import { TOKEN_KEY } from "@/constants/index";

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  return !!token;
};
