import React from 'react';
import { MetricConfig } from '../types/metrics';
import { MetricBar } from './MetricBar';
import { ThresholdInputs } from './ThresholdInputs';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/design';

interface MetricRowProps {
  metric: MetricConfig;
  onThresholdChange: (metricId: string, thresholdId: string, newValue: number) => void;
  isEditing: boolean;
  isMobile?: boolean;
}

export const MetricRow: React.FC<MetricRowProps> = ({
  metric,
  onThresholdChange,
  isEditing,
  isMobile = false,
}) => {
  const handleThresholdChange = (thresholdId: string, newValue: number) => {
    onThresholdChange(metric.id, thresholdId, newValue);
  };

  return (
    <div
      style={{
        marginBottom: `${SPACING.metricRowGap}px`,
        padding: isMobile ? '8px' : `${SPACING.padding.metricRow}px`,
        backgroundColor: COLORS.background,
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'flex-start',
          gap: isMobile ? '8px' : '16px',
        }}
      >
        {/* Metric label */}
        <div
          style={{
            minWidth: isMobile ? 'auto' : '200px',
            width: isMobile ? 'auto' : '200px',
            paddingTop: isMobile ? '0' : '4px',
          }}
        >
          <div
            style={{
              fontSize: isMobile ? '14px' : TYPOGRAPHY.fontSize.label,
              fontFamily: TYPOGRAPHY.fontFamily,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              color: COLORS.labelText,
            }}
          >
            {metric.name}
          </div>
        </div>

        {/* Bar and controls */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <MetricBar
            metric={metric}
            ranges={metric.ranges}
            onThresholdChange={handleThresholdChange}
            isEditing={isEditing}
          />
          {isEditing && (
            <ThresholdInputs
              metric={metric}
              onThresholdChange={handleThresholdChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};