import React, { useRef, useState } from 'react';
import { HealthMetric, MetricRange } from '../types/metrics';
import { valueToPercentage, percentageToValue } from '../utils/rangeCalculator';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/design';

interface MetricBarProps {
  metric: HealthMetric;
  ranges: MetricRange[];
  onThresholdChange: (thresholdId: string, newValue: number) => void;
  isEditing: boolean;
}

export const MetricBar: React.FC<MetricBarProps> = ({
  metric,
  ranges,
  onThresholdChange,
  isEditing,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [draggingThresholdId, setDraggingThresholdId] = useState<string | null>(null);

  const handleMouseDown = (thresholdId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingThresholdId(thresholdId);
  };

  const handleTouchStart = (thresholdId: string, e: React.TouchEvent) => {
    e.preventDefault();
    setDraggingThresholdId(thresholdId);
  };

  const handleMove = (clientX: number) => {
    if (!draggingThresholdId || !barRef.current) return;

    const rect = barRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newValue = percentageToValue(percentage, metric.minValue, metric.maxValue);
    
    // Round to 2 decimal places
    const roundedValue = Math.round(newValue * 100) / 100;
    
    // Find adjacent thresholds to constrain movement
    const currentThreshold = metric.thresholds.find(t => t.id === draggingThresholdId);
    if (!currentThreshold) return;

    const sortedThresholds = [...metric.thresholds].sort((a, b) => a.value - b.value);
    const currentIndex = sortedThresholds.findIndex(t => t.id === draggingThresholdId);
    
    // Get min and max constraints - prevent handles from crossing
    const minConstraint = currentIndex > 0 
      ? sortedThresholds[currentIndex - 1].value + 0.5  // Small gap to prevent overlap
      : metric.minValue;
    const maxConstraint = currentIndex < sortedThresholds.length - 1 
      ? sortedThresholds[currentIndex + 1].value - 0.5  // Small gap to prevent overlap
      : metric.maxValue;
    
    // Apply constraints - handle cannot move past adjacent handles
    const constrainedValue = Math.max(minConstraint, Math.min(maxConstraint, roundedValue));
    
    onThresholdChange(draggingThresholdId, constrainedValue);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleEnd = () => {
    setDraggingThresholdId(null);
  };

  React.useEffect(() => {
    if (draggingThresholdId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleEnd);
      };
    }
  }, [draggingThresholdId]);

  return (
    <div style={{ position: 'relative', width: '100%', height: SPACING.barHeight }}>
      {/* Range segments */}
      <div
        ref={barRef}
        style={{
          display: 'flex',
          height: '100%',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {ranges.map((range, index) => {
          const widthPercentage =
            ((range.max - range.min) / (metric.maxValue - metric.minValue)) * 100;
          
          return (
            <div
              key={`${range.type}-${index}`}
              style={{
                width: `${widthPercentage}%`,
                backgroundColor: range.color,
                transition: 'width 0.1s ease-out',
              }}
            />
          );
        })}
      </div>

      {/* Draggable handles with value labels - Always visible */}
      {metric.thresholds.map((threshold) => {
        const percentage = valueToPercentage(
          threshold.value,
          metric.minValue,
          metric.maxValue
        );

        const handleHeight = SPACING.barHeight + 12; // Taller than bar
        const handleWidth = 20; // Wider for easier mobile touch

        // Calculate the value box height for proper centering
        const valueBoxHeight = 20; // Approximate height of value box
        const valueBoxMargin = 4; // marginBottom of value box
        const totalValueBoxSpace = valueBoxHeight + valueBoxMargin;

        return (
          <div
            key={threshold.id}
            style={{
              position: 'absolute',
              left: `${percentage}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: draggingThresholdId === threshold.id ? 10 : 5,
              // Center the handle on the bar by accounting for the value box above it
              marginTop: '-13px',
            }}
          >
            {/* Value label above handle */}
            <div
              style={{
                fontSize: TYPOGRAPHY.fontSize.threshold,
                color: COLORS.thresholdText,
                fontFamily: TYPOGRAPHY.fontFamily,
                marginBottom: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: `1px solid ${COLORS.border}`,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {threshold.value.toFixed(2)}
            </div>

            {/* Handle - positioned to be centered on the bar */}
            <div
              onMouseDown={(e) => handleMouseDown(threshold.id, e)}
              onTouchStart={(e) => handleTouchStart(threshold.id, e)}
              style={{
                width: `${handleWidth}px`,
                height: `${handleHeight}px`,
                backgroundColor: '#FFFFFF',
                border: `2px solid #333333`,
                borderRadius: '4px',
                cursor: 'ew-resize',
                boxShadow: `0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)`,
                transition: draggingThresholdId === threshold.id ? 'none' : 'left 0.1s ease-out',
                userSelect: 'none',
              }}
              title={`Drag to adjust threshold: ${threshold.value}`}
              role="slider"
              aria-label={`Threshold at ${threshold.value}`}
              aria-valuemin={metric.minValue}
              aria-valuemax={metric.maxValue}
              aria-valuenow={threshold.value}
              tabIndex={0}
            />
          </div>
        );
      })}
    </div>
  );
};