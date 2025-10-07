import React, { useState } from 'react';
import { HealthMetric } from '../types/metrics';
import { validateThresholdValue } from '../utils/validation';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/design';

interface ThresholdInputsProps {
  metric: HealthMetric;
  onThresholdChange: (thresholdId: string, newValue: number) => void;
}

export const ThresholdInputs: React.FC<ThresholdInputsProps> = ({
  metric,
  onThresholdChange,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>(
    metric.thresholds.reduce((acc, t) => ({ ...acc, [t.id]: t.value.toString() }), {})
  );

  const handleInputChange = (thresholdId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [thresholdId]: value }));

    const numValue = parseFloat(value);
    const error = validateThresholdValue(numValue, thresholdId, metric);

    if (error) {
      setErrors(prev => ({ ...prev, [thresholdId]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[thresholdId];
        return newErrors;
      });
      onThresholdChange(thresholdId, numValue);
    }
  };

  // Update input values when metric changes externally (e.g., from dragging)
  React.useEffect(() => {
    setInputValues(
      metric.thresholds.reduce((acc, t) => ({ ...acc, [t.id]: t.value.toString() }), {})
    );
  }, [metric.thresholds]);

  const sortedThresholds = [...metric.thresholds].sort((a, b) => a.value - b.value);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '8px',
      }}
    >
      {sortedThresholds.map((threshold, index) => (
        <div key={threshold.id} style={{ display: 'flex', flexDirection: 'column' }}>
          <label
            htmlFor={`input-${threshold.id}`}
            style={{
              fontSize: '11px',
              color: COLORS.thresholdText,
              marginBottom: '2px',
              fontFamily: TYPOGRAPHY.fontFamily,
            }}
          >
            T{index + 1}
          </label>
          <input
            id={`input-${threshold.id}`}
            type="number"
            value={inputValues[threshold.id] || ''}
            onChange={(e) => handleInputChange(threshold.id, e.target.value)}
            style={{
              width: '70px',
              padding: '4px 6px',
              fontSize: TYPOGRAPHY.fontSize.input,
              fontFamily: TYPOGRAPHY.fontFamily,
              border: `1px solid ${errors[threshold.id] ? COLORS.errorRed : COLORS.border}`,
              borderRadius: '4px',
              outline: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = errors[threshold.id] ? COLORS.errorRed : '#4A90E2'}
            onBlur={(e) => e.target.style.borderColor = errors[threshold.id] ? COLORS.errorRed : COLORS.border}
            step="0.01"
            min={metric.minValue}
            max={metric.maxValue}
            aria-label={`Threshold ${index + 1} value`}
            aria-invalid={!!errors[threshold.id]}
            aria-describedby={errors[threshold.id] ? `error-${threshold.id}` : undefined}
          />
          {errors[threshold.id] && (
            <div
              id={`error-${threshold.id}`}
              style={{
                fontSize: '10px',
                color: COLORS.errorRed,
                marginTop: '2px',
                maxWidth: '150px',
              }}
              role="alert"
            >
              {errors[threshold.id]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};