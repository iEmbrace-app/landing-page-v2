"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FloatingNav.module.css";

interface NavItem {
  name: string;
  link: string;
  icon?: JSX.Element;
}

interface FloatingNavProps {
  navItems: NavItem[];
  className?: string;
  logo?: JSX.Element | string;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  navItems,
  className,
}) => {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      
      if (currentScrollY === 0) {
        // Always show when at top
        setIsHidden(false);
      } else {
        // Hide when scrolling down, show when scrolling up
        setIsHidden(scrollDirection === 'down');
      }
      
      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [lastScrollY]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest(`.${styles['mobile-menu']}`)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div
        className={`${styles['floating-nav']} ${isHidden ? styles.hidden : styles.visible} ${className || ''}`}
      >
        {/* Logo */}
        <div className={styles['logo-container']}>
          <img
            src="https://embrace-website-images.s3.us-east-2.amazonaws.com/logo.png"
            alt="Embraceland Logo"
            className={styles['logo-icon']}
            style={{ width: 32, height: 32, marginRight: 8 }}
          />
          <span className={styles['logo-text']}>Embraceland</span>
        </div>

        {/* Desktop Navigation Items */}
        <div className={styles['nav-items']}>
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className={styles['nav-item']}
            >
              {item.icon && (
                <span className={styles['nav-item-icon']}>
                  {item.icon}
                </span>
              )}
              <span className={styles['nav-item-text']}>{item.name}</span>
            </a>
          ))}
        </div>

        {/* Desktop CTA Button */}
        <button className={styles['cta-button']}>
          <span style={{ position: 'relative', zIndex: 10 }}>Start Free Today</span>
        </button>

        {/* Mobile Hamburger Button */}
        <button
          className={`${styles['hamburger-button']} ${isMobileMenuOpen ? styles.open : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div className={styles['hamburger-line']}></div>
          <div className={styles['hamburger-line']}></div>
          <div className={styles['hamburger-line']}></div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className={`${styles['mobile-menu-overlay']} ${isMobileMenuOpen ? styles.open : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />
            
            <motion.div
              className={`${styles['mobile-menu']} ${isMobileMenuOpen ? styles.open : ''}`}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3
              }}
            >
              {/* Mobile Navigation Items */}
              <div className={styles['mobile-menu-items']}>
                {navItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    className={styles['mobile-menu-item']}
                    onClick={closeMobileMenu}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>

              {/* Mobile CTA Button */}
              <motion.button
                className={styles['mobile-cta-button']}
                onClick={closeMobileMenu}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 + 0.3 }}
              >
                Start Free Today
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};