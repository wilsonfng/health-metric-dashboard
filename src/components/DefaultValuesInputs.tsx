import React, { useState } from 'react';
import { HealthMetric } from '../types/metrics';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/design';

interface DefaultValuesInputsProps {
  metric: HealthMetric;
  onDefaultsChange: (metricId: string, newDefaults: { minValue: number; maxValue: number; thresholds: Array<{ id: string; value: number }> }) => void;
}

export const DefaultValuesInputs: React.FC<DefaultValuesInputsProps> = ({
  metric,
  onDefaultsChange,
}) => {
  const [minValue, setMinValue] = useState(metric.minValue.toString());
  const [maxValue, setMaxValue] = useState(metric.maxValue.toString());
  const [thresholdValues, setThresholdValues] = useState<Record<string, string>>(
    metric.thresholds.reduce((acc, t) => ({ ...acc, [t.id]: t.value.toString() }), {})
  );

  const handleMinValueChange = (value: string) => {
    setMinValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onDefaultsChange(metric.id, {
        minValue: numValue,
        maxValue: metric.maxValue,
        thresholds: metric.thresholds.map(t => ({ id: t.id, value: t.value }))
      });
    }
  };

  const handleMaxValueChange = (value: string) => {
    setMaxValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onDefaultsChange(metric.id, {
        minValue: metric.minValue,
        maxValue: numValue,
        thresholds: metric.thresholds.map(t => ({ id: t.id, value: t.value }))
      });
    }
  };

  const handleThresholdChange = (thresholdId: string, value: string) => {
    setThresholdValues(prev => ({ ...prev, [thresholdId]: value }));
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const updatedThresholds = metric.thresholds.map(t =>
        t.id === thresholdId ? { id: t.id, value: numValue } : { id: t.id, value: t.value }
      );
      onDefaultsChange(metric.id, {
        minValue: metric.minValue,
        maxValue: metric.maxValue,
        thresholds: updatedThresholds
      });
    }
  };

  const sortedThresholds = [...metric.thresholds].sort((a, b) => a.value - b.value);

  return (
    <div
      style={{
        marginTop: '12px',
        padding: '12px',
        backgroundColor: '#F8F9FA',
        border: `1px solid ${COLORS.border}`,
        borderRadius: '6px',
        fontSize: '13px',
      }}
    >
      <div
        style={{
          fontWeight: TYPOGRAPHY.fontWeight.medium,
          color: COLORS.labelText,
          marginBottom: '8px',
          fontFamily: TYPOGRAPHY.fontFamily,
        }}
      >
        Default Values for {metric.name}
      </div>
      
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        {/* Min/Max Range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label
            style={{
              fontSize: '12px',
              color: COLORS.thresholdText,
              fontFamily: TYPOGRAPHY.fontFamily,
              minWidth: '60px',
            }}
          >
            Range:
          </label>
          <input
            type="number"
            value={minValue}
            onChange={(e) => handleMinValueChange(e.target.value)}
            style={{
              width: '70px',
              padding: '4px 6px',
              fontSize: '12px',
              fontFamily: TYPOGRAPHY.fontFamily,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '4px',
              outline: 'none',
            }}
            step="0.01"
            placeholder="Min"
            title="Minimum value for this metric"
          />
          <span style={{ color: COLORS.thresholdText, fontSize: '12px' }}>to</span>
          <input
            type="number"
            value={maxValue}
            onChange={(e) => handleMaxValueChange(e.target.value)}
            style={{
              width: '70px',
              padding: '4px 6px',
              fontSize: '12px',
              fontFamily: TYPOGRAPHY.fontFamily,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '4px',
              outline: 'none',
            }}
            step="0.01"
            placeholder="Max"
            title="Maximum value for this metric"
          />
        </div>

        {/* Threshold Values */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label
            style={{
              fontSize: '12px',
              color: COLORS.thresholdText,
              fontFamily: TYPOGRAPHY.fontFamily,
              minWidth: '80px',
            }}
          >
            Thresholds:
          </label>
          {sortedThresholds.map((threshold, index) => (
            <div key={threshold.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label
                style={{
                  fontSize: '11px',
                  color: COLORS.thresholdText,
                  fontFamily: TYPOGRAPHY.fontFamily,
                  minWidth: '20px',
                }}
              >
                T{index + 1}:
              </label>
              <input
                type="number"
                value={thresholdValues[threshold.id] || ''}
                onChange={(e) => handleThresholdChange(threshold.id, e.target.value)}
                style={{
                  width: '60px',
                  padding: '3px 5px',
                  fontSize: '11px',
                  fontFamily: TYPOGRAPHY.fontFamily,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '3px',
                  outline: 'none',
                }}
                step="0.01"
                title={`Default threshold ${index + 1} value`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};