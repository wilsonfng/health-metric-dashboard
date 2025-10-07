// Design constants extracted from reference image
export const COLORS = {
  // Range colors from the reference image
  red: '#E97C7C',        // Critical range
  yellow: '#F5C842',     // Cautionary range
  green: '#6BBF73',      // Healthy range
  
  // UI colors
  background: '#FFFFFF',
  labelBackground: '#F5F5F5',
  labelText: '#5A5A5A',
  thresholdText: '#7A7A7A',
  border: '#E0E0E0',
  errorRed: '#DC3545',
  
  // Handle colors
  handleBorder: '#FFFFFF',
  handleShadow: 'rgba(0, 0, 0, 0.2)',
} as const;

export const SPACING = {
  metricRowGap: 40, // Increased to accommodate value boxes above handles
  labelWidth: 200,
  barHeight: 32,
  handleSize: 16,
  padding: {
    container: 24,
    metricRow: 12,
  },
} as const;

export const TYPOGRAPHY = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: {
    label: '15px',
    threshold: '12px',
    input: '14px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
} as const;

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
} as const;