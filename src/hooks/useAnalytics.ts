import { useEffect, useRef, useCallback } from 'react';

// Declare window analytics functions
declare global {
  interface Window {
    trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
    trackSectionView: (sectionName: string) => void;
    trackEngagementTime: (sectionName: string, timeSpent: number) => void;
  }
}

interface UseAnalyticsOptions {
  sectionName: string;
  trackVisibility?: boolean;
  trackEngagement?: boolean;
}

export const useAnalytics = ({ 
  sectionName, 
  trackVisibility = true, 
  trackEngagement = true 
}: UseAnalyticsOptions) => {
  const visibilityTracked = useRef(false);
  const engagementStartTime = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Track custom events
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (window.trackEvent) {
      window.trackEvent(eventName, {
        section: sectionName,
        ...parameters
      });
    }
  }, [sectionName]);

  // Track section visibility
  useEffect(() => {
    if (!trackVisibility || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visibilityTracked.current) {
          window.trackSectionView?.(sectionName);
          visibilityTracked.current = true;
          
          if (trackEngagement) {
            engagementStartTime.current = Date.now();
          }
        } else if (!entry.isIntersecting && engagementStartTime.current) {
          const timeSpent = Math.round((Date.now() - engagementStartTime.current) / 1000);
          if (timeSpent > 0) {
            window.trackEngagementTime?.(sectionName, timeSpent);
          }
          engagementStartTime.current = null;
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      
      // Track final engagement time on unmount
      if (engagementStartTime.current) {
        const timeSpent = Math.round((Date.now() - engagementStartTime.current) / 1000);
        if (timeSpent > 0) {
          window.trackEngagementTime?.(sectionName, timeSpent);
        }
      }
    };
  }, [sectionName, trackVisibility, trackEngagement]);

  return {
    trackEvent,
    sectionRef
  };
};