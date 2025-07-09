export type AccessTokenResult = {
  accessToken: string;
  expiresOn: Date | null;
};

export type AcquireAccessTokenFn = () => Promise<AccessTokenResult>;

export type AuthContext = {
  isAuthenticated: () => boolean;
  getName: () => string;
  getEmail: () => string;
  getInitials: () => string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};
