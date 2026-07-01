import type { AuthProvider } from "@refinedev/core";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  timezone?: string;
  avatarUrl?: string;
};

export const authCredentials = {
  email: "michael.scott@dundermifflin.com",
  password: "demodemo",
};

const MOCK_USER: User = {
  id: "1",
  name: "Michael Scott",
  email: "michael.scott@dundermifflin.com",
  phone: "+1-555-000-0001",
  jobTitle: "Head of Talent Acquisition",
  timezone: "America/New_York",
  avatarUrl: undefined,
};

const SESSION_KEY = "talentlens_user";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    if (
      email === authCredentials.email &&
      password === authCredentials.password
    ) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_USER));
      return { success: true, redirectTo: "/" };
    }
    return {
      success: false,
      error: {
        name: "Invalid credentials",
        message: "Email or password is incorrect. Use the demo credentials shown below.",
      },
    };
  },

  logout: async () => {
    localStorage.removeItem(SESSION_KEY);
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const user = localStorage.getItem(SESSION_KEY);
    return user
      ? { authenticated: true }
      : { authenticated: false, redirectTo: "/login" };
  },

  onError: async (error) => ({ error }),

  getIdentity: async () => {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : undefined;
  },
};
