import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: string | number, currency: string = 'UGX'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(num);
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format phone number (MSISDN)
 */
export function formatPhoneNumber(msisdn: string): string {
  const digits = msisdn.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('256')) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return msisdn;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Get status badge color based on transaction status
 */
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    SUCCESS: 'bg-emerald-100 text-emerald-800',
    PENDING: 'bg-amber-100 text-amber-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    FAILED: 'bg-red-100 text-red-800',
    ACTIVE: 'bg-emerald-100 text-emerald-800',
    SUSPENDED: 'bg-red-100 text-red-800',
  };
  return statusMap[status] || 'bg-slate-100 text-slate-800';
}

/**
 * Get status icon based on transaction status
 */
export function getStatusIcon(status: string): string {
  const iconMap: Record<string, string> = {
    SUCCESS: '✓',
    PENDING: '⏱',
    PROCESSING: '⟳',
    FAILED: '✕',
    ACTIVE: '✓',
    SUSPENDED: '⊘',
  };
  return iconMap[status] || '•';
}

/**
 * Parse error message from API response
 */
export function parseErrorMessage(error: unknown): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as any;
  // Check if it's an axios error with a response
  if (err?.response?.data) {
    const data = err.response.data;
    if (data.error?.message) return data.error.message;
    if (data.message) return data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unexpected error occurred';
}

/**
 * Check if string is valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if string is valid phone number
 */
export function isValidPhoneNumber(msisdn: string): boolean {
  const phoneRegex = /^(\+?256|0)[0-9]{9}$/;
  return phoneRegex.test(msisdn.replace(/\s/g, ''));
}
