export const theme = {
  colors: {
    // Main backgrounds
    background: '#0a0f1a', // Darker Navy Blue
    surface: '#0f172a', // Card backgrounds
    surfaceLight: '#1e293b', // Lighter surface for contrast

    // Primary accents
    primary: '#22d3ee', // Bright Cyan
    primaryDark: '#0891b2', // Darker cyan for gradients
    primaryGlow: 'rgba(34, 211, 238, 0.3)', // Glow effect

    // Secondary/Action colors
    secondary: '#f97316', // Vibrant Orange
    secondaryDark: '#ea580c',

    // Text
    text: '#f1f5f9', // Bright white text
    textSecondary: '#94a3b8', // Muted text
    textMuted: '#64748b',

    // Borders & Lines
    border: '#334155',
    borderLight: '#475569',

    // Status colors
    success: '#22c55e',
    successGlow: 'rgba(34, 197, 94, 0.3)',
    error: '#ef4444',
    errorGlow: 'rgba(239, 68, 68, 0.4)',
    warning: '#eab308',

    // Game specific
    water: '#0c4a6e', // Deep ocean blue
    waterLight: '#0369a1', // Lighter water for hover
    waterDark: '#082f49', // Darker water
    ship: '#cbd5e1', // Light gray for ships
    shipPlaced: '#22d3ee', // Cyan highlight for placed ships
    hit: '#dc2626', // Bright red for hits
    hitGlow: 'rgba(220, 38, 38, 0.5)',
    miss: '#e2e8f0', // Off-white for misses
    gridLine: '#1e3a5f',

    // Special effects
    gold: '#fbbf24',
    explosion: '#ff6b35',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    title: {
      fontSize: 48,
      fontWeight: '900',
      letterSpacing: 4,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      letterSpacing: 2,
    },
    subHeader: {
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 1,
    },
    body: {
      fontSize: 16,
      fontWeight: '500',
    },
    button: {
      fontSize: 14,
      fontWeight: 'bold',
      letterSpacing: 1.5,
    },
    caption: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
    },
  },
  layout: {
    borderRadius: 12,
    borderRadiusSmall: 8,
    borderRadiusLarge: 16,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 12,
    },
    glow: color => ({
      shadowColor: color,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 8,
    }),
  },
};
