# Health Metric Dashboard

A customizable, interactive health metric dashboard application that allows users to visualize and configure health parameters with draggable range controls.

![Health Dashboard Preview](PRD.md)

## Features

✨ **Key Features:**

- **Visual Health Metrics Display** - View 9 different health metrics with color-coded ranges (Red/Yellow/Green)
- **Draggable Range Controls** - Intuitively adjust threshold boundaries by dragging handles on the bars
- **Manual Input Fields** - Precise numerical entry for exact threshold values
- **Real-time Validation** - Instant feedback on invalid threshold configurations
- **Bidirectional Sync** - Dragging handles updates input fields and vice versa
- **LocalStorage Persistence** - Your custom configurations are saved automatically
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Touch Support** - Full touch gesture support for mobile devices
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support

## Health Metrics Included

1. **Systolic Pressure** (mmHg)
2. **Diastolic Pressure** (mmHg)
3. **Pulse** (bpm)
4. **O2 Saturation** (%)
5. **Fasting Glucose** (mg/dL)
6. **Glucose After Breakfast** (mg/dL)
7. **Glucose Before Lunch** (mg/dL)
8. **Glucose After Lunch** (mg/dL)
9. **Glucose Before Dinner** (mg/dL)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Start the development server:**

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Viewing Metrics

By default, the dashboard displays all health metrics with pre-configured threshold ranges:
- **Red segments** = Critical ranges (too low or too high)
- **Yellow segments** = Cautionary ranges
- **Green segments** = Healthy/optimal ranges

### Editing Ranges

1. Click the **"Edit Ranges"** button to enter edit mode
2. **Drag handles** on the bars to adjust thresholds visually
3. Or use the **input fields** below each bar for precise values
4. Handles cannot cross each other (logical constraints enforced)
5. Invalid inputs show red borders with error messages
6. Click **"Done Editing"** when finished

### Resetting to Defaults

Click the **"Reset to Defaults"** button to restore original threshold values.

### Data Persistence

All your customizations are automatically saved to your browser's localStorage. Your settings will persist across sessions.

## Project Structure

```
AIAUTO/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard container
│   │   ├── MetricRow.tsx    # Individual metric row
│   │   ├── MetricBar.tsx    # Colored bar with draggable handles
│   │   ├── ThresholdLabels.tsx  # Threshold value display
│   │   └── ThresholdInputs.tsx  # Manual input fields
│   ├── constants/
│   │   └── design.ts        # Design system constants
│   ├── data/
│   │   └── initialMetrics.ts # Default metric configurations
│   ├── types/
│   │   └── metrics.ts       # TypeScript type definitions
│   ├── utils/
│   │   ├── rangeCalculator.ts  # Range calculation logic
│   │   ├── validation.ts       # Input validation
│   │   └── storage.ts          # LocalStorage utilities
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── PRD.md                   # Product Requirements Document
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS-in-JS** (inline styles) - Styling approach
- **LocalStorage API** - Data persistence

## Design Principles

- **Pixel-perfect implementation** matching the reference design
- **Simple, clean code** with minimal dependencies
- **No code duplication** - reusable components
- **Accessibility-first** approach (WCAG compliant)
- **Mobile-first responsive design**

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Adding New Metrics

Edit `src/data/initialMetrics.ts` to add new health metrics:

```typescript
{
  id: 'your-metric',
  name: 'Your Metric Name',
  unit: 'unit',
  minValue: 0,
  maxValue: 200,
  thresholds: [
    { id: 'threshold-1', value: 50 },
    { id: 'threshold-2', value: 100 },
    // ... more thresholds
  ],
}
```

### Changing Colors

Modify `src/constants/design.ts` to adjust the color scheme:

```typescript
export const COLORS = {
  red: '#E97C7C',
  yellow: '#F5C842',
  green: '#6BBF73',
  // ... other colors
};
```

## Development Notes

- No external UI libraries used (pure React)
- All drag functionality implemented from scratch
- Touch events handled separately for mobile compatibility
- Validation runs on every threshold change
- Automatic debouncing on drag operations

## Future Enhancements

- [ ] User authentication and cloud sync
- [ ] Historical data tracking and charts
- [ ] Export/import configurations
- [ ] Multiple user profiles
- [ ] Medical advisor recommendations
- [ ] Integration with health devices
- [ ] PDF report generation

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please ensure all PRs include:
- Updated tests
- Documentation updates
- Adherence to existing code style

## Support

For issues, questions, or feature requests, please open an issue on the repository.

---

**Built with ❤️ for better health monitoring**