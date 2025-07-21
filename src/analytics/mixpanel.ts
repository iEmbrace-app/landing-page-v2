
import mixpanel from 'mixpanel-browser';
import { useRef, useEffect } from 'react';


const MIXPANEL_TOKEN = '1518bbc3e843c67a9f936ff057046e94';
let isMixpanelInitialized = false;
export function initMixpanel() {
  if (!isMixpanelInitialized) {
    mixpanel.init(MIXPANEL_TOKEN);
    isMixpanelInitialized = true;
  }
}

export const analytics = {
  trackHeroCTA: (label: string) => {
    mixpanel.track('Hero CTA Clicked', { label });
  },
  trackAppStoreClick: (store: 'apple' | 'google') => {
    mixpanel.track('App Store Click', { store });
  },
  trackVideoInteraction: (action: string, title: string, index: number) => {
    mixpanel.track('Video Interaction', { action, title, index });
  },
  trackAudioToggle: (muted: boolean) => {
    mixpanel.track('Audio Toggled', { muted });
  },
  trackTabInteraction: (tabKey: string, previousTab: string) => {
    mixpanel.track('Tab Changed', { tabKey, previousTab });
  },
  trackFeatureExpand: (feature: string, tab: string) => {
    mixpanel.track('Feature Expanded', { feature, tab });
  },
  trackTestimonialInteraction: (action: string, index: number) => {
    mixpanel.track('Testimonial Interaction', { action, index });
  },
  trackNFCInteraction: (action: string, title: string) => {
    mixpanel.track('NFC Interaction', { action, title });
  },
  trackNavClick: (navItem: string, section: string) => {
    mixpanel.track('Nav Click', { navItem, section });
  },
};

export function useAnalytics() {
  // Example: Track scroll or engagement events here if needed
}

export function useSectionTracking(sectionName: string) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          mixpanel.track('Section Viewed', { section: sectionName });
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [sectionName]);
  return ref;
}
