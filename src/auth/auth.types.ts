export type AuthContext = {
  isAuthenticated: () => boolean;
  getName: () => string;
  getEmail: () => string;
  getInitials: () => string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};
