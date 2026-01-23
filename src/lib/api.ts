import axios, { AxiosInstance, AxiosError } from 'axios';
import { z } from 'zod';

/**
 * Type-safe API client for Odi Pay
 * Provides structured endpoints with Zod validation
 */

// ============================================================================
// Shared Types & Schemas
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ============================================================================
// Authentication Types
// ============================================================================

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;

export interface AuthSession {
  id: string;
  expiresAt: string;
}

export interface AuthResponse {
  user: CurrentUser;
  session: AuthSession;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: 'ADMIN' | 'MERCHANT' | 'DEVELOPER';
  emailVerified: boolean;
  createdAt: string;
}

// ============================================================================
// Application Types
// ============================================================================

export interface Application {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  webhookUrl?: string;
  rateLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationWithKey extends Application {
  apiKey?: string;
}

export const CreateApplicationSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  webhookUrl: z.string().url().optional(),
  rateLimit: z.number().min(10).max(10000).optional(),
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;

export const UpdateApplicationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  webhookUrl: z.string().url().optional().or(z.null()),
  rateLimit: z.number().min(10).max(10000).optional(),
});

export type UpdateApplicationInput = z.infer<typeof UpdateApplicationSchema>;

// ============================================================================
// Transaction Types
// ============================================================================

export type TransactionType = 'COLLECTION' | 'PAYOUT';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'PROCESSING';
export type PaymentProvider = 'MTN' | 'AIRTEL';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  currency: string;
  fee: string;
  netAmount: string;
  msisdn: string;
  provider: PaymentProvider;
  providerRef?: string;
  narration?: string;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export const InitiateCollectionSchema = z.object({
  amount: z.number().positive().int(),
  currency: z.string().length(3).default('UGX'),
  msisdn: z.string().min(9).max(15),
  narration: z.string().max(200).optional(),
  externalRef: z.string().max(100).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type InitiateCollectionInput = z.infer<typeof InitiateCollectionSchema>;

// ============================================================================
// Wallet Types
// ============================================================================

export interface Wallet {
  id: string;
  type: string;
  currency: string;
  status: string;
  balance: {
    walletId: string;
    currency: string;
    availableBalance: string;
    pendingBalance: string;
    totalBalance: string;
  };
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  type: string;
  amount: string;
  balanceAfter: string;
  description: string;
  transactionId?: string;
  createdAt: string;
}

// ============================================================================
// API Client
// ============================================================================

class OdiPayApiClient {
  private client: AxiosInstance;
  private onUnauthenticated?: () => void;

  constructor(baseURL: string = '/api/v1') {
    // During local development, we MUST use the proxy to handle cookies correctly.
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Essential for cookie-based auth
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean };
        
        // Skip refresh for auth endpoints to prevent infinite loops
        const isAuthEndpoint = originalRequest?.url?.includes('/auth/sign-in') ||
                              originalRequest?.url?.includes('/auth/sign-up') ||
                              originalRequest?.url?.includes('/auth/refresh-tokens');
        
        if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
          originalRequest._retry = true;
          
          try {
            await this.client.post('/auth/refresh-tokens');
            return this.client.request(originalRequest);
          } catch (refreshError) {
            // Refresh failed, trigger unauthenticated callback if session is gone
            if (this.onUnauthenticated) {
              this.onUnauthenticated();
            }
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public setOnUnauthenticated(callback: () => void) {
    this.onUnauthenticated = callback;
  }

  // ========================================================================
  // Authentication Endpoints
  // ========================================================================

  async signUp(input: SignUpInput): Promise<AuthResponse> {
    const validated = SignUpSchema.parse(input);
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/sign-up', validated);
    if (!response.data.success || !response.data.data) {
      throw new Error('Sign up failed');
    }
    return response.data.data;
  }

  async signIn(input: SignInInput): Promise<AuthResponse> {
    const validated = SignInSchema.parse(input);
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/sign-in', validated);
    if (!response.data.success || !response.data.data) {
      throw new Error('Sign in failed');
    }
    return response.data.data;
  }

  async signOut(): Promise<void> {
    await this.client.post<ApiResponse>('/auth/sign-out');
  }

  async getCurrentUser(): Promise<CurrentUser> {
    const response = await this.client.get<ApiResponse<{ user: CurrentUser }>>('/auth/me');
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch current user');
    }
    return response.data.data.user;
  }

  async updateProfile(input: { name?: string; image?: string }): Promise<CurrentUser> {
    const response = await this.client.patch<ApiResponse<{ user: CurrentUser }>>('/auth/me', input);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update profile');
    }
    return response.data.data.user;
  }

  async refreshTokens(): Promise<void> {
    // With cookie-based auth, just call the endpoint - browser handles cookies
    const response = await this.client.post<ApiResponse>('/auth/refresh-tokens');
    if (!response.data.success) {
      throw new Error('Failed to refresh tokens');
    }
  }

  // ========================================================================
  // Applications Endpoints
  // ========================================================================

  async createApplication(input: CreateApplicationInput): Promise<ApplicationWithKey> {
    const validated = CreateApplicationSchema.parse(input);
    const response = await this.client.post<ApiResponse<{ application: ApplicationWithKey; apiKey: string }>>('/applications', validated);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to create application');
    }
    return { ...response.data.data.application, apiKey: response.data.data.apiKey };
  }

  async getApplications(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Application>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<Application>>>('/applications', {
      params: { page, perPage },
    });
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch applications');
    }
    return response.data.data;
  }

  async getApplication(applicationId: string): Promise<Application> {
    const response = await this.client.get<ApiResponse<{ application: Application }>>(`/applications/${applicationId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch application');
    }
    return response.data.data.application;
  }

  async updateApplication(applicationId: string, input: UpdateApplicationInput): Promise<Application> {
    const validated = UpdateApplicationSchema.parse(input);
    const response = await this.client.patch<ApiResponse<{ application: Application }>>(`/applications/${applicationId}`, validated);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update application');
    }
    return response.data.data.application;
  }

  async suspendApplication(applicationId: string): Promise<Application> {
    const response = await this.client.post<ApiResponse<{ application: Application }>>(`/applications/${applicationId}/suspend`);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to suspend application');
    }
    return response.data.data.application;
  }

  async activateApplication(applicationId: string): Promise<Application> {
    const response = await this.client.post<ApiResponse<{ application: Application }>>(`/applications/${applicationId}/activate`);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to activate application');
    }
    return response.data.data.application;
  }

  async deleteApplication(applicationId: string): Promise<void> {
    await this.client.delete<ApiResponse>(`/applications/${applicationId}`);
  }

  async rotateApiKey(applicationId: string): Promise<string> {
    const response = await this.client.post<ApiResponse<{ apiKey: string }>>(`/applications/${applicationId}/rotate-key`);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to rotate API key');
    }
    return response.data.data.apiKey;
  }

  async regenerateWebhookSecret(applicationId: string): Promise<string> {
    const response = await this.client.post<ApiResponse<{ webhookSecret: string }>>(`/applications/${applicationId}/regenerate-webhook-secret`);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to regenerate webhook secret');
    }
    return response.data.data.webhookSecret;
  }

  // ========================================================================
  // Wallets Endpoints
  // ========================================================================

  async getWallets(): Promise<Wallet[]> {
    const response = await this.client.get<ApiResponse<{ wallets: Wallet[] }>>('/wallets');
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch wallets');
    }
    return response.data.data.wallets;
  }

  async createWallet(currency: string = 'UGX'): Promise<Wallet> {
    const response = await this.client.post<ApiResponse<{ wallet: Wallet }>>('/wallets', { currency });
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to create wallet');
    }
    return response.data.data.wallet;
  }

  async getWalletBalance(walletId: string) {
    const response = await this.client.get<ApiResponse<{ balance: Wallet['balance'] }>>(`/wallets/${walletId}/balance`);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch wallet balance');
    }
    return response.data.data.balance;
  }

  async getWalletLedger(
    walletId: string,
    page: number = 1,
    perPage: number = 50,
    startDate?: Date,
    endDate?: Date
  ): Promise<PaginatedResponse<LedgerEntry>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<LedgerEntry>>>(`/wallets/${walletId}/ledger`, {
      params: {
        page,
        perPage,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      },
    });
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch wallet ledger');
    }
    return response.data.data;
  }
}

export const apiClient = new OdiPayApiClient();
