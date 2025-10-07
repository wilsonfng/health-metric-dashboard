import { HealthMetric, MetricRange, RangeType } from '../types/metrics';
import { COLORS } from '../constants/design';

/**
 * Calculates the colored ranges based on threshold values
 */
export function calculateRanges(metric: HealthMetric): MetricRange[] {
  const ranges: MetricRange[] = [];
  const sortedThresholds = [...metric.thresholds].sort((a, b) => a.value - b.value);
  
  // If we have thresholds, create ranges between them
  if (sortedThresholds.length >= 2) {
    // Critical low (min to first threshold)
    ranges.push({
      min: metric.minValue,
      max: sortedThresholds[0].value,
      type: 'critical-low',
      color: COLORS.red,
    });
    
    // Cautionary low (first to second threshold)
    if (sortedThresholds.length >= 2) {
      ranges.push({
        min: sortedThresholds[0].value,
        max: sortedThresholds[1].value,
        type: 'cautionary-low',
        color: COLORS.yellow,
      });
    }
    
    // Healthy (second to third threshold, or to end if only 2 thresholds)
    if (sortedThresholds.length >= 3) {
      ranges.push({
        min: sortedThresholds[1].value,
        max: sortedThresholds[2].value,
        type: 'healthy',
        color: COLORS.green,
      });
    } else {
      ranges.push({
        min: sortedThresholds[1].value,
        max: metric.maxValue,
        type: 'healthy',
        color: COLORS.green,
      });
    }
    
    // Cautionary high (third to fourth threshold)
    if (sortedThresholds.length >= 4) {
      ranges.push({
        min: sortedThresholds[2].value,
        max: sortedThresholds[3].value,
        type: 'cautionary-high',
        color: COLORS.yellow,
      });
      
      // Critical high (fourth threshold to max)
      ranges.push({
        min: sortedThresholds[3].value,
        max: metric.maxValue,
        type: 'critical-high',
        color: COLORS.red,
      });
    } else if (sortedThresholds.length === 3) {
      // If only 3 thresholds, make the rest critical high
      ranges.push({
        min: sortedThresholds[2].value,
        max: metric.maxValue,
        type: 'critical-high',
        color: COLORS.red,
      });
    }
  }
  
  return ranges;
}

/**
 * Converts a value to a percentage position on the bar
 */
export function valueToPercentage(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

/**
 * Converts a percentage position to a value
 */
export function percentageToValue(percentage: number, min: number, max: number): number {
  return min + (percentage / 100) * (max - min);
}