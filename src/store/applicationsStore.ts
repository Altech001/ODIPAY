import { create } from 'zustand';
import { apiClient, Application, ApplicationWithKey, CreateApplicationInput, UpdateApplicationInput} from '../lib/api';

/**
 * Applications Store
 * Manages merchant applications state
 */

interface ApplicationsState {
  // State
  applications: Application[];
  currentApplication: Application | null;
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchApplications: (page?: number, perPage?: number) => Promise<void>;
  fetchApplication: (applicationId: string) => Promise<void>;
  createApplication: (input: CreateApplicationInput) => Promise<ApplicationWithKey>;
  updateApplication: (applicationId: string, input: UpdateApplicationInput) => Promise<void>;
  suspendApplication: (applicationId: string) => Promise<void>;
  activateApplication: (applicationId: string) => Promise<void>;
  deleteApplication: (applicationId: string) => Promise<void>;
  rotateApiKey: (applicationId: string) => Promise<string>;
  regenerateWebhookSecret: (applicationId: string) => Promise<string>;
  setCurrentApplication: (application: Application | null) => void;
  clearError: () => void;
}

export const useApplicationsStore = create<ApplicationsState>((set) => ({
  // Initial state
  applications: [],
  currentApplication: null,
  pagination: {
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 0,
    hasMore: false,
  },
  isLoading: false,
  error: null,

  // Fetch applications
  fetchApplications: async (page = 1, perPage = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getApplications(page, perPage);
      set({
        applications: response.items,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch applications';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Fetch single application
  fetchApplication: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const app = await apiClient.getApplication(applicationId);
      set({ currentApplication: app, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch application';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Create application
  createApplication: async (input: CreateApplicationInput) => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiClient.createApplication(input);
      set((state) => ({
        applications: [result, ...state.applications],
        isLoading: false,
      }));
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create application';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Update application
  updateApplication: async (applicationId: string, input: UpdateApplicationInput) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await apiClient.updateApplication(applicationId, input);
      set((state) => ({
        applications: state.applications.map((app) => (app.id === applicationId ? updated : app)),
        currentApplication: state.currentApplication?.id === applicationId ? updated : state.currentApplication,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update application';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Suspend application
  suspendApplication: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await apiClient.suspendApplication(applicationId);
      set((state) => ({
        applications: state.applications.map((app) => (app.id === applicationId ? updated : app)),
        currentApplication: state.currentApplication?.id === applicationId ? updated : state.currentApplication,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to suspend application';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Activate application
  activateApplication: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await apiClient.activateApplication(applicationId);
      set((state) => ({
        applications: state.applications.map((app) => (app.id === applicationId ? updated : app)),
        currentApplication: state.currentApplication?.id === applicationId ? updated : state.currentApplication,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to activate application';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Delete application
  deleteApplication: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteApplication(applicationId);
      set((state) => ({
        applications: state.applications.filter((app) => app.id !== applicationId),
        currentApplication: state.currentApplication?.id === applicationId ? null : state.currentApplication,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete application';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Rotate API key
  rotateApiKey: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiKey = await apiClient.rotateApiKey(applicationId);
      set({ isLoading: false });
      return apiKey;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to rotate API key';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Regenerate webhook secret
  regenerateWebhookSecret: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const secret = await apiClient.regenerateWebhookSecret(applicationId);
      set({ isLoading: false });
      return secret;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to regenerate webhook secret';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Set current application
  setCurrentApplication: (application: Application | null) => {
    set({ currentApplication: application });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
