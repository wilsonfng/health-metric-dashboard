import React, { useState, useEffect } from 'react';
import { HealthMetric, MetricConfig } from '../types/metrics';
import { MetricRow } from './MetricRow';
import { DefaultValuesInputs } from './DefaultValuesInputs';
import { calculateRanges } from '../utils/rangeCalculator';
import { validateThresholds } from '../utils/validation';
import { saveMetricsToStorage, loadMetricsFromStorage, saveDefaultsToStorage, loadDefaultsFromStorage } from '../utils/storage';
import { initialMetrics } from '../data/initialMetrics';
import { COLORS, TYPOGRAPHY, SPACING, BREAKPOINTS } from '../constants/design';

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricConfig[]>([]);
  const [defaultValues, setDefaultValues] = useState<HealthMetric[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);

  // Check screen size for responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.tablet);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize metrics and default values from storage or use defaults
  useEffect(() => {
    const stored = loadMetricsFromStorage();
    const storedDefaults = loadDefaultsFromStorage();
    
    const metricsToUse = stored || initialMetrics;
    const defaultsToUse = storedDefaults || initialMetrics;
    
    const enrichedMetrics: MetricConfig[] = metricsToUse.map(metric => ({
      ...metric,
      ranges: calculateRanges(metric),
      validationErrors: validateThresholds(metric),
    }));
    
    setMetrics(enrichedMetrics);
    setDefaultValues(defaultsToUse);
  }, []);

  // Save to storage whenever metrics change
  useEffect(() => {
    if (metrics.length > 0) {
      saveMetricsToStorage(metrics);
    }
  }, [metrics]);

  // Save to storage whenever default values change
  useEffect(() => {
    if (defaultValues.length > 0) {
      saveDefaultsToStorage(defaultValues);
    }
  }, [defaultValues]);

  const handleThresholdChange = (
    metricId: string,
    thresholdId: string,
    newValue: number
  ) => {
    setMetrics(prevMetrics =>
      prevMetrics.map(metric => {
        if (metric.id === metricId) {
          const updatedThresholds = metric.thresholds.map(t =>
            t.id === thresholdId ? { ...t, value: newValue } : t
          );
          
          const updatedMetric = { ...metric, thresholds: updatedThresholds };
          
          return {
            ...updatedMetric,
            ranges: calculateRanges(updatedMetric),
            validationErrors: validateThresholds(updatedMetric),
          };
        }
        return metric;
      })
    );
  };

  const handleReset = () => {
    const resetMetrics = defaultValues.length > 0 ? defaultValues : initialMetrics;
    const enrichedMetrics: MetricConfig[] = resetMetrics.map(metric => ({
      ...metric,
      ranges: calculateRanges(metric),
      validationErrors: validateThresholds(metric),
    }));
    
    setMetrics(enrichedMetrics);
  };

  const handleDefaultsChange = (
    metricId: string,
    newDefaults: { minValue: number; maxValue: number; thresholds: Array<{ id: string; value: number }> }
  ) => {
    // Update the default values state
    setDefaultValues(prevDefaults =>
      prevDefaults.map(metric => {
        if (metric.id === metricId) {
          return {
            ...metric,
            minValue: newDefaults.minValue,
            maxValue: newDefaults.maxValue,
            thresholds: metric.thresholds.map(t => {
              const newThreshold = newDefaults.thresholds.find(nt => nt.id === t.id);
              return newThreshold ? { ...t, value: newThreshold.value } : t;
            }),
          };
        }
        return metric;
      })
    );

    // Also update the current metrics to reflect the changes
    setMetrics(prevMetrics =>
      prevMetrics.map(metric => {
        if (metric.id === metricId) {
          const updatedMetric = {
            ...metric,
            minValue: newDefaults.minValue,
            maxValue: newDefaults.maxValue,
            thresholds: metric.thresholds.map(t => {
              const newThreshold = newDefaults.thresholds.find(nt => nt.id === t.id);
              return newThreshold ? { ...t, value: newThreshold.value } : t;
            }),
          };
          
          return {
            ...updatedMetric,
            ranges: calculateRanges(updatedMetric),
            validationErrors: validateThresholds(updatedMetric),
          };
        }
        return metric;
      })
    );
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '16px' : `${SPACING.padding.container}px`,
        fontFamily: TYPOGRAPHY.fontFamily,
        backgroundColor: '#F9F9F9',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            color: COLORS.labelText,
            margin: 0,
          }}
        >
          Health Metric Dashboard
        </h1>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: isMobile ? '8px 16px' : '10px 20px',
              fontSize: TYPOGRAPHY.fontSize.input,
              fontFamily: TYPOGRAPHY.fontFamily,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              backgroundColor: isEditing ? COLORS.green : '#4A90E2',
              color: COLORS.background,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            aria-pressed={isEditing}
          >
            {isEditing ? 'Done Editing' : 'Edit Ranges'}
          </button>
          
          <button
            onClick={() => setShowDefaults(!showDefaults)}
            style={{
              padding: isMobile ? '8px 16px' : '10px 20px',
              fontSize: TYPOGRAPHY.fontSize.input,
              fontFamily: TYPOGRAPHY.fontFamily,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              backgroundColor: showDefaults ? '#FF6B35' : '#6C757D',
              color: COLORS.background,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            aria-pressed={showDefaults}
          >
            {showDefaults ? 'Hide Defaults' : 'Edit Defaults'}
          </button>
          
          <button
            onClick={handleReset}
            style={{
              padding: isMobile ? '8px 16px' : '10px 20px',
              fontSize: TYPOGRAPHY.fontSize.input,
              fontFamily: TYPOGRAPHY.fontFamily,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              backgroundColor: COLORS.background,
              color: COLORS.labelText,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F0F0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.background)}
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Metrics list */}
      <div>
        {metrics.map(metric => (
          <MetricRow
            key={metric.id}
            metric={metric}
            onThresholdChange={handleThresholdChange}
            isEditing={isEditing}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Default Values Section */}
      {showDefaults && (
        <div
          style={{
            marginTop: '32px',
            padding: '20px',
            backgroundColor: '#F8F9FA',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: TYPOGRAPHY.fontWeight.semibold,
              color: COLORS.labelText,
              margin: '0 0 16px 0',
              fontFamily: TYPOGRAPHY.fontFamily,
            }}
          >
            Default Values Configuration
          </h2>
          <p
            style={{
              fontSize: isMobile ? '13px' : TYPOGRAPHY.fontSize.input,
              color: COLORS.thresholdText,
              margin: '0 0 20px 0',
              fontFamily: TYPOGRAPHY.fontFamily,
            }}
          >
            Configure the default values for each health metric. These values will be used when resetting to defaults.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {defaultValues.map(metric => (
              <DefaultValuesInputs
                key={metric.id}
                metric={metric}
                onDefaultsChange={handleDefaultsChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Info message */}
      {isEditing && (
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#E3F2FD',
            borderLeft: `4px solid #4A90E2`,
            borderRadius: '4px',
            fontSize: isMobile ? '13px' : TYPOGRAPHY.fontSize.input,
            color: COLORS.labelText,
          }}
          role="status"
          aria-live="polite"
        >
          <strong>Edit Mode Active:</strong> Drag the handles on the bars or use the input
          fields below each metric to adjust threshold values.
        </div>
      )}
    </div>
  );
};