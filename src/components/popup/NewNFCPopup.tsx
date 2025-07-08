import { useState, useEffect } from 'react'
import { SimpleModal } from '../modal/SimpleModal'
import { TbNfc } from 'react-icons/tb'

export function NewNFCPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  // Auto-show modal on first visit
  useEffect(() => {
    const hasShown = localStorage.getItem('nfc-modal-shown')
    if (!hasShown) {
      // Show modal after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
        localStorage.setItem('nfc-modal-shown', 'true')
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      // If already shown before, just show the floating button
      setShowFloatingButton(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setShowFloatingButton(true)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  // Reset function for testing
  const resetModal = () => {
    localStorage.removeItem('nfc-modal-shown')
    setIsOpen(false)
    setShowFloatingButton(false)
    window.location.reload()
  }

  // Keyboard shortcut to reset (Ctrl+Shift+R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault()
        resetModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Floating Button */}
      {showFloatingButton && !isOpen && (
        <>
          <style>{`
            @keyframes pulseFloat {
              0% {
                transform: scale(1);
                box-shadow: 0 4px 12px rgba(104, 101, 191, 0.4);
              }
              50% {
                transform: scale(1.05);
                box-shadow: 0 8px 20px rgba(104, 101, 191, 0.6);
              }
              100% {
                transform: scale(1);
                box-shadow: 0 4px 12px rgba(104, 101, 191, 0.4);
              }
            }
            
            @keyframes floatBounce {
              0% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-5px);
              }
              100% {
                transform: translateY(0);
              }
            }
          `}</style>
          <button
            onClick={handleOpen}
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6865BF 0%, #A496D9 100%)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(104, 101, 191, 0.4)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              animation: 'pulseFloat 3s ease-in-out infinite, floatBounce 2s ease-in-out infinite'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(104, 101, 191, 0.6)'
              e.currentTarget.style.animation = 'none'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(104, 101, 191, 0.4)'
              e.currentTarget.style.animation = 'pulseFloat 3s ease-in-out infinite, floatBounce 2s ease-in-out infinite'
            }}
            aria-label="Open NFC Soundscapes"
            title="Experience NFC Soundscapes"
          >
            <TbNfc />
          </button>
        </>
      )}

      {/* Modal */}
      <SimpleModal isOpen={isOpen} onClose={handleClose} />
    </>
  )
}
