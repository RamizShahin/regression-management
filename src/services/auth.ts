export type UserRole = "admin" | "manager" | "user";

export interface AuthUser {
  user_id: number;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
}

class AuthService {
  private accessToken: string | null = null;
  private currentUser: AuthUser | null = null;

  async login(email: string, password: string) {
    const response = await fetch("api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      this.accessToken = data.accessToken;
      this.currentUser = {
        user_id: data.user.user_id,
        email: data.user.email,
        name: data.user.name,
        phone: data.user.phone,
        role: data.user.role,
      };
    } else {
      throw new Error(data.message || "Login failed");
    }
  }

  async refreshAccessToken() {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      this.accessToken = data.accessToken;
      if (data.user) {
        this.currentUser = {
          user_id: data.user.user_id,
          email: data.user.email,
          name: data.user.name,
          phone: data.user.phone,
          role: data.user.role,
        };
      }
      return this.accessToken;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    this.accessToken = null;
    this.currentUser = null;
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (response.status === 401) {
        const error = await response.json();
        if (error.code === "TOKEN_EXPIRED") {
          const newToken = await this.refreshAccessToken();
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async initializeAuth() {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        this.accessToken = data.accessToken;
        this.currentUser = {
          user_id: data.user.user_id,
          email: data.user.email,
          name: data.user.name,
          phone: data.user.phone,
          role: data.user.role,
        };
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  getUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }
}

const authService = new AuthService();
export default authService;
