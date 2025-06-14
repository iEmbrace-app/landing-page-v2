// Design Token System for Wellness Meditation App
// Centralized design values for consistency and maintainability

export const designTokens = {  // Color System - Lavender Pastel Purple Wellness-focused palette
  colors: {
    // Primary Brand Colors - Lavender Purple Scale
    primary: {
      50: '#F2E4EE',   // Lightest lavender
      100: '#F2D8EE',  // Light lavender
      200: '#E6CAE6',  // Soft lavender
      300: '#D3BDF2',  // Medium lavender
      400: '#C1A8E8',  // Vibrant lavender
      500: '#A496D9',  // Core brand purple
      600: '#8B7BC7',  // Deep lavender
      700: '#7669B5',  // Dark lavender
      800: '#6865BF',  // Darkest purple
      900: '#5A4FA3',  // Deep purple
      950: '#4A4191'   // Deepest purple
    },
    
    // Wellness-specific colors - Updated for lavender theme
    wellness: {
      'lavender-light': '#F2E4EE',
      'lavender-soft': '#F2D8EE',
      'lavender-medium': '#D3BDF2',
      'lavender-vibrant': '#A496D9',
      'lavender-deep': '#6865BF',
      'accent-pink': '#E6CAE6',
      'accent-purple': '#C1A8E8'
    },
    
    // Semantic Colors
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
      // Text Colors - Updated for lavender theme
    text: {
      primary: '#6865BF',      // Deep purple for primary text
      secondary: '#8B7BC7',    // Medium purple for secondary text
      tertiary: '#A496D9',     // Light purple for tertiary text
      inverse: '#ffffff',      // White for dark backgrounds
      muted: '#C1A8E8',        // Soft purple for muted text
      accent: '#D3BDF2'        // Light accent text
    },
    
    // Background Colors - Updated for lavender theme
    background: {
      primary: '#ffffff',       // Pure white
      secondary: '#F2E4EE',     // Lightest lavender
      tertiary: '#F2D8EE',      // Light lavender
      overlay: 'rgba(242, 228, 238, 0.15)',     // Lavender overlay
      glass: 'rgba(242, 216, 238, 0.25)',       // Lavender glassmorphism
      gradient: 'linear-gradient(135deg, #F2E4EE 0%, #F2D8EE 50%, #D3BDF2 100%)'
    },
    
    // Border Colors - Updated for lavender theme
    border: {
      light: '#F2D8EE',        // Light lavender border
      medium: '#D3BDF2',       // Medium lavender border
      dark: '#A496D9',         // Dark lavender border
      focus: '#6865BF',        // Deep purple for focus states
      gradient: 'linear-gradient(135deg, #D3BDF2, #A496D9, #6865BF)'
    }
  },
  
  // Typography System
  typography: {
    // Font Families
    fontFamily: {
      primary: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, sans-serif',
      monospace: '"Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace'
    },
    
    // Font Sizes (rem units for accessibility)
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
      '8xl': '6rem',    // 96px
      '9xl': '8rem'     // 128px
    },
    
    // Font Weights
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    },
    
    // Letter Spacing
    letterSpacing: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },
  
  // Spacing System (based on 4px grid)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    40: '10rem',    // 160px
    48: '12rem',    // 192px
    56: '14rem',    // 224px
    64: '16rem'     // 256px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: '0 0 #0000'
  },
  
  // Animation & Transitions
  animation: {
    // Duration
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms'
    },
    
    // Easing Functions
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    
    // Common Keyframes
    keyframes: {
      fadeIn: {
        from: { opacity: '0' },
        to: { opacity: '1' }
      },
      fadeOut: {
        from: { opacity: '1' },
        to: { opacity: '0' }
      },
      slideUp: {
        from: { transform: 'translateY(100%)' },
        to: { transform: 'translateY(0)' }
      },
      slideDown: {
        from: { transform: 'translateY(-100%)' },
        to: { transform: 'translateY(0)' }
      },
      scale: {
        from: { transform: 'scale(0.95)' },
        to: { transform: 'scale(1)' }
      },
      spin: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' }
      }
    }
  },
  
  // Breakpoints for Responsive Design
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },
  
  // Component-specific tokens
  components: {    // Button variants - Updated for lavender theme
    button: {
      primary: {
        background: '#6865BF',
        color: '#ffffff',
        border: 'transparent',
        hover: {
          background: '#8B7BC7',
          transform: 'translateY(-1px)'
        },
        focus: {
          outline: '2px solid #A496D9',
          outlineOffset: '2px'
        }
      },
      secondary: {
        background: 'transparent',
        color: '#6865BF',
        border: '#A496D9',
        hover: {
          background: '#F2E4EE',
          transform: 'translateY(-1px)'
        }
      },
      glassmorphism: {
        background: 'rgba(242, 216, 238, 0.25)',
        color: '#6865BF',
        border: 'linear-gradient(135deg, #D3BDF2, #A496D9, #6865BF)',
        backdropFilter: 'blur(20px) saturate(180%)',
        hover: {
          background: 'rgba(164, 150, 217, 0.35)',
          transform: 'translateY(-1px)'
        }
      }
    },
    
    // Navigation - Updated for lavender theme
    navigation: {
      height: '80px',
      background: 'rgba(242, 228, 238, 0.95)',
      backdropFilter: 'blur(20px) saturate(180%)',
      zIndex: 1100
    },
    
    // Cards - Updated for lavender theme
    card: {
      background: '#ffffff',
      border: '#F2D8EE',
      borderRadius: '0.75rem',
      shadow: '0 8px 32px rgba(164, 150, 217, 0.15)',
      padding: '1.5rem',
      glassmorphism: {
        background: 'rgba(242, 216, 238, 0.15)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(211, 189, 242, 0.3)'
      }
    },
      // Form elements - Updated for lavender theme
    input: {
      background: '#ffffff',
      border: '#D3BDF2',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      focus: {
        border: '#6865BF',
        outline: '2px solid rgba(164, 150, 217, 0.2)',
        outlineOffset: '0'
      }
    }
  },
  
  // Accessibility tokens
  accessibility: {
    // WCAG contrast ratios
    contrast: {
      aa: 4.5,      // WCAG AA standard
      aaa: 7,       // WCAG AAA standard
      large: 3      // Large text minimum
    },
      // Focus indicators - Updated for lavender theme
    focus: {
      width: '2px',
      style: 'solid',
      color: '#6865BF',
      offset: '2px'
    },
    
    // Touch targets (minimum 44x44px)
    touchTarget: {
      minSize: '44px'
    }
  }
} as const

// CSS Custom Properties generator
export function generateCSSVariables(tokens: typeof designTokens): string {
  const cssVariables: string[] = []
  
  // Helper function to flatten nested objects
  const flatten = (obj: any, prefix = ''): void => {
    for (const [key, value] of Object.entries(obj)) {
      const variableName = prefix ? `${prefix}-${key}` : key
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flatten(value, variableName)
      } else {
        cssVariables.push(`  --${variableName}: ${value};`)
      }
    }
  }
  
  flatten(tokens)
  
  return `:root {\n${cssVariables.join('\n')}\n}`
}

// TypeScript utilities for type-safe design token access
export type ColorToken = keyof typeof designTokens.colors
export type SpacingToken = keyof typeof designTokens.spacing
export type FontSizeToken = keyof typeof designTokens.typography.fontSize
export type BreakpointToken = keyof typeof designTokens.breakpoints

// Helper functions for common operations
export const token = {
  color: (path: string) => {
    const keys = path.split('.')
    let value: any = designTokens.colors
    for (const key of keys) {
      value = value[key]
    }
    return value as string
  },
  
  spacing: (key: SpacingToken) => designTokens.spacing[key],
  
  fontSize: (key: FontSizeToken) => designTokens.typography.fontSize[key],
  
  breakpoint: (key: BreakpointToken) => designTokens.breakpoints[key],
  
  // Media query helper
  mediaQuery: (breakpoint: BreakpointToken) => `@media (min-width: ${designTokens.breakpoints[breakpoint]})`
}

// Export for use in styled-components or other CSS-in-JS solutions
export default designTokens
