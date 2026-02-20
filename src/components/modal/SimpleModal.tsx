import { useState } from 'react'
import { MdClose, MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md'
import { TbNfc } from 'react-icons/tb'

interface SimpleModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SimpleModal({ isOpen, onClose }: SimpleModalProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(false)

  const nfcCards = [
    {
      id: 1,
      image: "https://embrace-website-images-dst.s3.us-east-2.amazonaws.com/nfc-card-one.png",
      title: "Gentle Rain & Thunder",
      artist: "Peaceful Nature Collection",
      description: "Immerse yourself in the calming sounds of gentle rainfall and distant thunder"
    },
    {
      id: 2,
      image: "https://embrace-website-images-dst.s3.us-east-2.amazonaws.com/nfc-card-two.png",
      title: "Forest Meditation",
      artist: "Woodland Serenity Series",
      description: "Deep forest ambience with birds chirping and rustling leaves"
    },
    {
      id: 3,
      image: "https://embrace-website-images-dst.s3.us-east-2.amazonaws.com/nfc-card-three.png",
      title: "Ocean Waves",
      artist: "Coastal Mindfulness",
      description: "Rhythmic ocean waves meeting the shore for ultimate relaxation"
    }
  ]

  const nextCard = () => {
    setImageLoading(true)
    setCurrentCardIndex(prev => (prev + 1) % nfcCards.length)
  }

  const prevCard = () => {
    setImageLoading(true)
    setCurrentCardIndex(prev => (prev - 1 + nfcCards.length) % nfcCards.length)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        backdropFilter: 'blur(8px)',
        animation: 'modalBackdropFadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes modalBackdropFadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
        }
        
        @keyframes modalBounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-100px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes modalSlideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes modalSlideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes nfcPulse {
          0% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
          }
          100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
        }
        
        @media (max-width: 768px) {
          .modal-container {
            grid-template-columns: 1fr !important;
            max-width: 95% !important;
          }
          
          .modal-image-side {
            width: 100% !important;
            min-height: 300px !important;
          }
          
          .modal-content-side {
            padding: 32px 24px !important;
          }
        }
      `}</style>
      <div
        className="modal-container"
        style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          maxWidth: '900px',
          width: '90%',
          position: 'relative',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          minHeight: '500px',
          animation: 'modalBounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#666',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <MdClose />
        </button>

        {/* Left Side - NFC Card Image */}
        <div 
          className="modal-image-side"
          style={{
            width: '320px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '40px 30px',
            animation: 'modalSlideInLeft 0.5s ease-out 0.2s both'
          }}
        >
          <div style={{ position: 'relative', textAlign: 'center' }}>
            {imageLoading && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '14px'
              }}>
                Loading...
              </div>
            )}
            
            <img 
              src={nfcCards[currentCardIndex].image}
              alt={`NFC Soundscape Card - ${nfcCards[currentCardIndex].title}`}
              style={{
                width: '100%',
                maxWidth: '260px',
                height: 'auto',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: imageLoading ? 0.7 : 1,
                transform: imageLoading ? 'scale(0.98)' : 'scale(1)'
              }}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
            
            {/* NFC Badge */}
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '8px',
              borderRadius: '50%',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
              animation: 'nfcPulse 2s ease-in-out infinite'
            }}>
              <TbNfc />
            </div>
            
            {/* Navigation Arrows */}
            {nfcCards.length > 1 && (
              <>
                <button 
                  onClick={prevCard}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#333',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                >
                  <MdArrowBackIos />
                </button>
                
                <button 
                  onClick={nextCard}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#333',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                >
                  <MdArrowForwardIos />
                </button>
              </>
            )}
            
            {/* Card Indicators */}
            {nfcCards.length > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '20px'
              }}>
                {nfcCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setImageLoading(true)
                      setCurrentCardIndex(index)
                    }}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: 'none',
                      background: index === currentCardIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Content */}
        <div 
          className="modal-content-side"
          style={{ 
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            animation: 'modalSlideInRight 0.5s ease-out 0.3s both'
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              marginBottom: '8px',
              margin: '0 0 8px 0',
              lineHeight: '1.2'
            }}>
              Experience Tranquil Soundscapes
            </h2>
            
            <p style={{
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.5',
              margin: '0',
              marginBottom: '24px'
            }}>
              {nfcCards[currentCardIndex].description}
            </p>

            <div style={{
              fontSize: '14px',
              color: '#888',
              fontWeight: '500'
            }}>
              {nfcCards[currentCardIndex].artist}
            </div>
          </div>

          {/* Features List */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              padding: '12px 16px',
              background: '#f8f9ff',
              borderRadius: '12px',
              border: '1px solid #e8ebff'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#6865BF',
                color: 'white',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TbNfc />
              </div>
              <span style={{
                fontSize: '15px',
                color: '#6865BF',
                fontWeight: '600'
              }}>
                Instant NFC Access
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              padding: '12px 16px',
              background: '#f0f9ff',
              borderRadius: '12px',
              border: '1px solid #e0f2fe'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#0ea5e9',
                color: 'white',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                ♪
              </div>
              <span style={{
                fontSize: '15px',
                color: '#0ea5e9',
                fontWeight: '600'
              }}>
                High-Quality Audio
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #dcfce7'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#22c55e',
                color: 'white',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                ♡
              </div>
              <span style={{
                fontSize: '15px',
                color: '#22c55e',
                fontWeight: '600'
              }}>
                Stress Relief & Relaxation
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <button style={{
              background: 'linear-gradient(135deg, #6865BF 0%, #A496D9 100%)',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(104, 101, 191, 0.3)',
              transition: 'all 0.3s ease',
              flex: '1',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(104, 101, 191, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(104, 101, 191, 0.3)'
            }}
            >
              Order Your Card
            </button>
            
            <button style={{
              background: 'white',
              color: '#6865BF',
              border: '2px solid #6865BF',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: '1',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6865BF'
              e.currentTarget.style.color = 'white'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.color = '#6865BF'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            >
              Listen to Sample
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
