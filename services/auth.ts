import { api } from "./api";
import type { AuthResponse, Identifier, User } from "@/types";

export const authService = {
  login: (who: Identifier, password: string) =>
    api<AuthResponse>(who.email ? "/auth/login/email" : "/auth/login/phone", {
      method: "POST",
      body: { ...who, password },
      anonymous: true,
    }),

  signup: (name: string, who: Identifier, password: string) =>
    api<AuthResponse>(who.email ? "/auth/signup/email" : "/auth/signup/phone", {
      method: "POST",
      body: { name, ...who, password },
      anonymous: true,
    }),

  forgotPassword: (who: Identifier) =>
    api<null>("/auth/forgot-password", { method: "POST", body: who, anonymous: true }),

  resetPassword: (who: Identifier, otp: string, newPassword: string) =>
    api<null>("/auth/reset-password", {
      method: "POST",
      body: { ...who, otp, newPassword },
      anonymous: true,
    }),

  changePassword: (oldPassword: string, newPassword: string) =>
    api<null>("/auth/change-password", { method: "POST", body: { oldPassword, newPassword } }),

  getUser: (id: string) => api<User>(`/users/${id}`),

  updateUser: (id: string, patch: { name: string }) =>
    api<User>(`/users/${id}`, { method: "PATCH", body: patch }),
};
