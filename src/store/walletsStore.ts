import { create } from 'zustand';
import { LedgerEntry, Wallet } from '../lib/api';
import { apiClient } from '../lib/api';

/**
 * Wallets Store
 * Manages wallet and ledger state
 */

interface WalletsState {
  // State
  wallets: Wallet[];
  currentWallet: Wallet | null;
  ledgerEntries: LedgerEntry[];
  ledgerPagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWallets: () => Promise<void>;
  createWallet: (currency?: string) => Promise<void>;
  setCurrentWallet: (wallet: Wallet | null) => void;
  fetchWalletLedger: (walletId: string, page?: number, perPage?: number, startDate?: Date, endDate?: Date) => Promise<void>;
  clearError: () => void;
}

export const useWalletsStore = create<WalletsState>((set, get) => ({
  // Initial state
  wallets: [],
  currentWallet: null,
  ledgerEntries: [],
  ledgerPagination: {
    page: 1,
    perPage: 50,
    total: 0,
    totalPages: 0,
    hasMore: false,
  },
  isLoading: false,
  error: null,

  // Fetch wallets
  fetchWallets: async () => {
    set({ isLoading: true, error: null });
    try {
      const wallets = await apiClient.getWallets();
      set({ wallets, isLoading: false });
      // Set first wallet as current if available
      if (wallets.length > 0 && !get().currentWallet) {
        set({ currentWallet: wallets[0] });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch wallets';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Create wallet
  createWallet: async (currency = 'UGX') => {
    set({ isLoading: true, error: null });
    try {
      const wallet = await apiClient.createWallet(currency);
      set((state) => ({
        wallets: [...state.wallets, wallet],
        currentWallet: state.currentWallet || wallet,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create wallet';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Set current wallet
  setCurrentWallet: (wallet: Wallet | null) => {
    set({ currentWallet: wallet });
  },

  // Fetch wallet ledger
  fetchWalletLedger: async (walletId: string, page = 1, perPage = 50, startDate?: Date, endDate?: Date) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getWalletLedger(walletId, page, perPage, startDate, endDate);
      set({
        ledgerEntries: response.items,
        ledgerPagination: response.pagination,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch wallet ledger';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
