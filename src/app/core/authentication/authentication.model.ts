/**
 * Credentials model.
 */
export interface Credentials {
  accessToken?: string;
  authenticated: boolean;
  base64EncodedAuthenticationKey?: string;
  isTwoFactorAuthenticationRequired?: boolean;
  officeId: number;
  officeName: string;
  staffId?: number;
  staffDisplayName?: string;
  organizationalRole?: any;
  permissions: string[];
  roles: any;
  userId: number;
  username: string;
  shouldRenewPassword: boolean;
  rememberMe?: boolean;
}

/**
 * Login context model.
 */
 export interface LoginContext {
  username: string;
  password: string;
  remember: boolean;
}

/**
 * OAuth2 token model.
 */
 export interface OAuth2Token {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

