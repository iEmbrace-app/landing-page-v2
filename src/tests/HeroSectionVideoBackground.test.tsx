import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HeroSection } from '../components/sections/HeroSection';

// Mock the video background hook
vi.mock('../hooks/useVideoBackground', () => ({
  useVideoBackground: () => ({
    currentIndex: 0,
    loadedVideos: new Set([0]),
    isTransitioning: false,
    switchToVideo: vi.fn(),
    createVideoElement: vi.fn(() => document.createElement('video')),
    shouldPreload: vi.fn(() => false)
  })
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock requestIdleCallback
global.requestIdleCallback = vi.fn((cb) => setTimeout(cb, 1));

describe('Video Background Hero Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders hero section with video background', () => {
    render(<HeroSection isMobile={false} />);
    
    expect(screen.getByText('ROOT')).toBeInTheDocument();
    expect(screen.getByText('Companion for Emotional Embracing')).toBeInTheDocument();
    expect(screen.getByText('Buy Me :)')).toBeInTheDocument();
  });

  it('renders mobile version correctly', () => {
    render(<HeroSection isMobile={true} />);
    
    const heroWrapper = document.querySelector('.heroWrapper');
    expect(heroWrapper).toHaveClass('mobile');
  });

  it('has proper video indicators', () => {
    render(<HeroSection isMobile={false} />);
    
    const indicators = document.querySelectorAll('.indicator');
    expect(indicators).toHaveLength(3); // 3 videos
  });

  it('includes app store buttons', () => {
    render(<HeroSection isMobile={false} />);
    
    expect(screen.getByLabelText('Download on the App Store')).toBeInTheDocument();
    expect(screen.getByLabelText('Get it on Google Play')).toBeInTheDocument();
  });

  it('has scroll indicator', () => {
    render(<HeroSection isMobile={false} />);
    
    expect(screen.getByLabelText('Scroll down')).toBeInTheDocument();
  });
});

export default describe;
