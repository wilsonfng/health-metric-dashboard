import { HealthMetric } from '../types/metrics';

const STORAGE_KEY = 'health-metrics-config';
const DEFAULTS_STORAGE_KEY = 'health-metrics-defaults';

/**
 * Save metrics configuration to localStorage
 */
export function saveMetricsToStorage(metrics: HealthMetric[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
  } catch (error) {
    console.error('Failed to save metrics to storage:', error);
  }
}

/**
 * Load metrics configuration from localStorage
 */
export function loadMetricsFromStorage(): HealthMetric[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load metrics from storage:', error);
  }
  return null;
}

/**
 * Clear metrics configuration from localStorage
 */
export function clearMetricsFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear metrics from storage:', error);
  }
}

/**
 * Save default values configuration to localStorage
 */
export function saveDefaultsToStorage(defaults: HealthMetric[]): void {
  try {
    localStorage.setItem(DEFAULTS_STORAGE_KEY, JSON.stringify(defaults));
  } catch (error) {
    console.error('Failed to save defaults to storage:', error);
  }
}

/**
 * Load default values configuration from localStorage
 */
export function loadDefaultsFromStorage(): HealthMetric[] | null {
  try {
    const stored = localStorage.getItem(DEFAULTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load defaults from storage:', error);
  }
  return null;
}

/**
 * Clear default values configuration from localStorage
 */
export function clearDefaultsFromStorage(): void {
  try {
    localStorage.removeItem(DEFAULTS_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear defaults from storage:', error);
  }
}