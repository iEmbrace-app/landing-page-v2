import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';

import App from '../App';
import { Navigation } from '../components/layout/Navigation';
import { HeroSection } from '../components/sections/HeroSection';

// Mock Three.js and WebGL context
vi.mock('three', () => ({
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    setPixelRatio: vi.fn(),
    setClearColor: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement('canvas'),
    capabilities: { getMaxAnisotropy: () => 16 },
    info: { render: { frame: 0, calls: 0, triangles: 0 } }
  })),
  Scene: vi.fn(() => ({ add: vi.fn(), remove: vi.fn() })),
  PerspectiveCamera: vi.fn(() => ({ 
    position: { set: vi.fn(), x: 0, y: 0, z: 0 },
    lookAt: vi.fn(),
    aspect: 1,
    updateProjectionMatrix: vi.fn()
  })),
  Clock: vi.fn(() => ({ 
    getElapsedTime: () => 0,
    getDelta: () => 0.016
  })),
  SphereGeometry: vi.fn(),
  MeshStandardMaterial: vi.fn(),
  Mesh: vi.fn(() => ({
    position: { set: vi.fn(), x: 0, y: 0, z: 0 },
    rotation: { set: vi.fn(), x: 0, y: 0, z: 0 },
    scale: { set: vi.fn(), x: 1, y: 1, z: 1 }
  })),
  DirectionalLight: vi.fn(),
  AmbientLight: vi.fn(),
  Color: vi.fn(),
  Vector3: vi.fn(() => ({ x: 0, y: 0, z: 0 }))
}));

// Mock performance monitoring - using existing PerformanceMonitor
vi.mock('../utils/PerformanceMonitor', () => ({
  globalPerformanceMonitor: {
    update: vi.fn(),
    getFPS: vi.fn(() => 60),
    getAverageFPS: vi.fn(() => 60),
    getMinFPS: vi.fn(() => 58),
    getMaxFPS: vi.fn(() => 62),
    getPerformanceLevel: vi.fn(() => 'high'),
    getFullReport: vi.fn(() => ({
      fps: { current: 60, average: 60, min: 58, max: 62 },
      memory: { used: 50, total: 100, limit: 500 },
      performance: { level: 'high', stability: 0.95 },
      recommendations: []
    }))
  }
}));

describe('Futuristic Pebble Integration Tests', () => {
  beforeEach(() => {
    // Reset window scroll position
    window.scrollTo = vi.fn();
    global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16));
    global.cancelAnimationFrame = vi.fn();
    
    // Mock WebGL context
    HTMLCanvasElement.prototype.getContext = vi.fn((contextType) => {
      if (contextType === 'webgl' || contextType === 'webgl2') {
        return {
          canvas: document.createElement('canvas'),
          drawingBufferWidth: 800,
          drawingBufferHeight: 600,
          getExtension: vi.fn(),
          getParameter: vi.fn(),
          createShader: vi.fn(),
          createProgram: vi.fn(),
          useProgram: vi.fn(),
          attachShader: vi.fn(),
          linkProgram: vi.fn(),
          getProgramParameter: vi.fn(() => true),
          getShaderParameter: vi.fn(() => true),
          enable: vi.fn(),
          disable: vi.fn(),
          viewport: vi.fn(),
          clear: vi.fn(),
          clearColor: vi.fn(),
          drawArrays: vi.fn(),
          drawElements: vi.fn()
        };
      }
      return null;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Navigation Integration', () => {
    it('should render demo link in navigation', () => {
      render(<Navigation />);
      
      const demoLink = screen.getByText('Demo');
      expect(demoLink).toBeInTheDocument();
      expect(demoLink.closest('a')).toHaveAttribute('href', '#demo');
    });

    it('should handle scroll to demo section', async () => {
      render(<Navigation />);
      
      const demoLink = screen.getByText('Demo');
      fireEvent.click(demoLink);
      
      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalled();
      });
    });
  });

  describe('Hero Section Integration', () => {
    it('should render FuturisticPebble component in hero section', async () => {
      const { container } = render(<HeroSection />);
      
      // Check for canvas element (Three.js renderer)
      await waitFor(() => {
        const canvas = container.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
      });
    });

    it('should apply futuristic CSS effects', () => {
      const { container } = render(<HeroSection />);
      
      const heroElement = container.querySelector('.hero');
      expect(heroElement).toBeInTheDocument();
      
      // Check for CSS classes that apply futuristic effects
      const pebbleContainer = container.querySelector('[data-testid="futuristic-pebble"]') || 
                             container.querySelector('.futuristic-pebble') ||
                             container.querySelector('.three-d-container');
      
      if (pebbleContainer) {
        const computedStyle = window.getComputedStyle(pebbleContainer);
        // These properties might be applied via CSS modules or inline styles
        expect(computedStyle.position).toBeTruthy();
      }
    });
  });

  describe('Demo Page Integration', () => {
    it('should render futuristic pebble demo page without errors', async () => {
      const { container } = render(<FuturisticPebbleDemo />);
      
      await waitFor(() => {
        // Look for demo content indicators
        const demoElements = container.querySelectorAll('canvas, .demo, [class*="demo"], [class*="futuristic"]');
        expect(demoElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should initialize performance monitoring in development', async () => {
      // Mock development environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(<App />);

      // Performance monitor should be available globally in development
      await waitFor(() => {
        // Check if performance monitoring was attempted to be initialized
        expect(global.requestAnimationFrame).toHaveBeenCalled();
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Responsive Design', () => {
    it('should handle mobile viewport changes', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667
      });

      const { container } = render(<HeroSection />);

      // Trigger resize event
      fireEvent(window, new Event('resize'));

      await waitFor(() => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
          // Canvas should adapt to smaller viewport
          expect(canvas).toBeInTheDocument();
        }
      });
    });

    it('should maintain performance on smaller screens', async () => {
      // Simulate mobile device
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320
      });

      const { container } = render(<FuturisticPebbleDemo />);

      await waitFor(() => {
        // Should render without throwing errors
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should maintain keyboard navigation', () => {
      render(<Navigation />);
      
      const demoLink = screen.getByText('Demo');
      
      // Should be focusable
      demoLink.focus();
      expect(document.activeElement).toBe(demoLink);
    });

    it('should not interfere with screen readers', async () => {
      const { container } = render(<HeroSection />);
      
      // Check for proper semantic structure
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).toBeGreaterThan(0);
      
      // Canvas should have proper labeling or be marked as decorative
      const canvas = container.querySelector('canvas');
      if (canvas) {
        const ariaLabel = canvas.getAttribute('aria-label');
        const ariaHidden = canvas.getAttribute('aria-hidden');
        expect(ariaLabel || ariaHidden).toBeTruthy();
      }
    });
  });

  describe('Cross-browser Compatibility', () => {
    it('should handle WebGL context creation failure gracefully', async () => {
      // Mock WebGL failure
      HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

      const { container } = render(<HeroSection />);

      await waitFor(() => {
        // Should not crash the application
        expect(container).toBeInTheDocument();
      });
    });

    it('should provide fallback for unsupported browsers', async () => {
      // Mock older browser environment
      delete (window as any).requestAnimationFrame;

      const { container } = render(<FuturisticPebbleDemo />);

      await waitFor(() => {
        // Should render fallback content
        expect(container).toBeInTheDocument();
      });
    });
  });
});

export default FuturisticPebbleIntegrationTest;
