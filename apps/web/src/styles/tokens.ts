export const tokens = {
  colors: {
    brand: {
      950: '#0b1b2b', // Deep Navy canvas
      900: '#102a43', // Surface panel background
      800: '#243b53', // Border / Header dark
      700: '#334e68', // Subtle hover border
      600: '#486581', // Text muted / icon secondary
      500: '#627d98',
      400: '#829ab1', // Text body secondary
      300: '#9fb3c8', // Header label
      200: '#bcccdc',
      100: '#d9e2ec',
      50:  '#f0f4f8',
    },
    accent: {
      blue: '#2563eb',    // Primary action
      blueHover: '#1d4ed8',
      emerald: '#059669', // Valid / Success
      amber: '#d97706',   // Warning / Ordinal
      purple: '#7c3aed',  // AI Copilot accent
      rose: '#e11d48',    // Error / Delete
    },
    measurementLevel: {
      scale: { bg: 'bg-blue-950', text: 'text-blue-300', border: 'border-blue-800', label: 'SCALE' },
      ordinal: { bg: 'bg-amber-950', text: 'text-amber-300', border: 'border-amber-800', label: 'ORDINAL' },
      nominal: { bg: 'bg-emerald-950', text: 'text-emerald-300', border: 'border-emerald-800', label: 'NOMINAL' },
    }
  },
  typography: {
    fontSans: "'Inter', system-ui, -apple-system, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  }
};
