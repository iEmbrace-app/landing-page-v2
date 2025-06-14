import React from 'react'
import { TabKey } from '../../types'

interface TabButtonProps {
  tabKey: TabKey
  label: string
  isActive: boolean
  isMobile: boolean
  onClick: (tabKey: TabKey) => void
}

export function TabButton({ tabKey, label, isActive, isMobile, onClick }: TabButtonProps) {  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(tabKey);
  };
  return (
    <button 
      onClick={handleClick}
      className={`${isActive ? 'glassmorphism' : 'focus-ring'}`}
      style={{
        height: isMobile ? 36 : 40, 
        paddingLeft: isMobile ? 20 : 32, 
        paddingRight: isMobile ? 20 : 32, 
        paddingTop: 8, 
        paddingBottom: 8, 
        background: isActive ? 'var(--colors-background-glass)' : 'transparent',
        borderRadius: 24, 
        border: isActive ? '1px solid var(--colors-border-medium)' : '1px solid var(--colors-border-light)',
        backdropFilter: isActive ? 'blur(20px) saturate(180%)' : 'none',
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 10, 
        display: 'flex',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minWidth: 'fit-content',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        pointerEvents: 'auto',
        zIndex: 10
      }}
    >      <div style={{
        justifyContent: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        color: isActive ? 'var(--colors-text-primary)' : 'var(--colors-text-tertiary)', 
        fontSize: isMobile ? 11 : 12, 
        fontFamily: '"Source Sans Pro", sans-serif', 
        fontWeight: isActive ? '700' : '400', 
        textTransform: 'uppercase', 
        letterSpacing: 0.96, 
        wordWrap: 'break-word'
      }}>
        {label}
      </div>
    </button>
  )
}
