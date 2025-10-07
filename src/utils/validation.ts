import { HealthMetric, ValidationError } from '../types/metrics';

/**
 * Validates that thresholds are in correct order and don't overlap
 */
export function validateThresholds(metric: HealthMetric): ValidationError[] {
  const errors: ValidationError[] = [];
  const sortedThresholds = [...metric.thresholds].sort((a, b) => a.value - b.value);
  
  // Check if thresholds are within min/max bounds
  sortedThresholds.forEach((threshold) => {
    if (threshold.value < metric.minValue) {
      errors.push({
        thresholdId: threshold.id,
        message: `Value ${threshold.value} is below minimum ${metric.minValue}`,
      });
    }
    if (threshold.value > metric.maxValue) {
      errors.push({
        thresholdId: threshold.id,
        message: `Value ${threshold.value} is above maximum ${metric.maxValue}`,
      });
    }
  });
  
  // Check for overlapping thresholds (same values)
  for (let i = 0; i < sortedThresholds.length - 1; i++) {
    if (sortedThresholds[i].value === sortedThresholds[i + 1].value) {
      errors.push({
        thresholdId: sortedThresholds[i].id,
        message: `Threshold overlaps with another threshold at value ${sortedThresholds[i].value}`,
      });
    }
  }
  
  return errors;
}

/**
 * Validates a single threshold value before updating
 */
export function validateThresholdValue(
  value: number,
  thresholdId: string,
  metric: HealthMetric
): string | null {
  // Check if value is a valid number
  if (isNaN(value)) {
    return 'Please enter a valid number';
  }
  
  // Check bounds
  if (value < metric.minValue || value > metric.maxValue) {
    return `Value must be between ${metric.minValue} and ${metric.maxValue}`;
  }
  
  // Get all thresholds sorted by their current values
  const sortedThresholds = [...metric.thresholds].sort((a, b) => a.value - b.value);
  
  // Find the current threshold's position in the sorted order
  const currentThresholdIndex = sortedThresholds.findIndex(t => t.id === thresholdId);
  
  if (currentThresholdIndex === -1) {
    return 'Threshold not found';
  }
  
  // Check non-crossing constraints
  // Left constraint: value should not be lower than the threshold to its left
  if (currentThresholdIndex > 0) {
    const leftThreshold = sortedThresholds[currentThresholdIndex - 1];
    if (value < leftThreshold.value) {
      return `Value must be at least ${leftThreshold.value} (cannot be lower than ${leftThreshold.value})`;
    }
    if (value === leftThreshold.value) {
      return `Value cannot equal ${leftThreshold.value} (must be higher than left threshold)`;
    }
  }
  
  // Right constraint: value should not be higher than the threshold to its right
  if (currentThresholdIndex < sortedThresholds.length - 1) {
    const rightThreshold = sortedThresholds[currentThresholdIndex + 1];
    if (value > rightThreshold.value) {
      return `Value must be at most ${rightThreshold.value} (cannot be higher than ${rightThreshold.value})`;
    }
    if (value === rightThreshold.value) {
      return `Value cannot equal ${rightThreshold.value} (must be lower than right threshold)`;
    }
  }
  
  return null;
}