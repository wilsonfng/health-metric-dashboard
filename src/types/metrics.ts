// Type definitions for health metrics and ranges

export type RangeType = 'critical-low' | 'cautionary-low' | 'healthy' | 'cautionary-high' | 'critical-high';

export interface Threshold {
  value: number;
  id: string;
}

export interface MetricRange {
  min: number;
  max: number;
  type: RangeType;
  color: string;
}

export interface HealthMetric {
  id: string;
  name: string;
  unit: string;
  thresholds: Threshold[];
  minValue: number;
  maxValue: number;
  currentValue?: number;
}

export interface ValidationError {
  thresholdId: string;
  message: string;
}

export interface MetricConfig extends HealthMetric {
  ranges: MetricRange[];
  validationErrors?: ValidationError[];
}
