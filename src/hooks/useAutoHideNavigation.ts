import { useState, useEffect, useRef } from 'react';

interface UseAutoHideNavigation {
  isVisible: boolean;
}

export function useAutoHideNavigation(): UseAutoHideNavigation {
  const [isVisible, setIsVisible] = useState(true);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      
      // Simple logic: hide when scrolling down, show when scrolling up
      if (currentScrollY > prevScrollY.current && currentScrollY > 50) {
        // Scrolling down and past 50px
        setIsVisible(false);
      } else if (currentScrollY < prevScrollY.current) {
        // Scrolling up
        setIsVisible(true);
      }
      
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { isVisible };
}
