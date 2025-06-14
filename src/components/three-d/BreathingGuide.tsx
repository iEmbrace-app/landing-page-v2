import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BreathingGuideProps {
  intensity?: number
}

export function BreathingGuide({ intensity = 1 }: BreathingGuideProps) {
  const breathingRingRef = useRef<THREE.Points>(null!)
  const ripplesRef = useRef<THREE.Group>(null!)
  const [breathPhase, setBreathPhase] = useState('inhale')
  
  // Store initial positions for animation
  const particleData = useMemo(() => {
    const count = 4000 // More particles for smoother effect
    const data = {
      initialPositions: new Float32Array(count * 3),
      randomFactors: new Float32Array(count * 3), // For organic movement
      phases: new Float32Array(count) // Phase offset for each particle
    }
      // Create particles in radial waves
    for (let i = 0; i < count; i++) {
      // Create multiple waves/layers
      const waveIndex = i % 16 // 8 waves
      const indexInWave = Math.floor(i / 8)
      
      // Spiral distribution
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // Golden angle
      const angle = indexInWave * goldenAngle + (waveIndex * Math.PI / 4)
      
      // Varying radius for each wave
      const baseRadius = 0.2 + (waveIndex * 0.16)
      const radiusVariation = Math.random() * 0.3
      const radius = baseRadius + radiusVariation
      
      // Store initial positions
      data.initialPositions[i * 3] = Math.cos(angle) * radius
      data.initialPositions[i * 3 + 1] = Math.sin(angle) * radius
      data.initialPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.1
      
      // Random factors for organic movement
      data.randomFactors[i * 3] = Math.random() * 2 - 1
      data.randomFactors[i * 3 + 1] = Math.random() * 2 - 1
      data.randomFactors[i * 3 + 2] = Math.random() * 2 - 1
      
      // Phase offset for wave-like animation
      data.phases[i] = (waveIndex / 8) * Math.PI * 2 + Math.random() * 0.5
    }
    
    return data
  }, [])
  
  // Create radial burst particle geometry
  const ringGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const particleCount = 4000
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    // Initialize with stored positions
    positions.set(particleData.initialPositions)
    
    // Set sizes based on distance from center
    for (let i = 0; i < particleCount; i++) {
      const distance = Math.sqrt(
        particleData.initialPositions[i * 3] ** 2 + 
        particleData.initialPositions[i * 3 + 1] ** 2
      )
      
      // Size based on distance - smaller particles further out
      sizes[i] = 0.08 * (1 - distance / 3)
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    
    return geometry
  }, [particleData])
  
  // Create particle material with proper blending
  const ringMaterial = useMemo(() => {
    // Create purple-tinted glow texture
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const context = canvas.getContext('2d')!
    
    // Create purple gradient instead of white
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(147, 51, 234, 1)')    // Bright purple center
    gradient.addColorStop(0.3, 'rgba(124, 58, 237, 0.8)') // Mid purple
    gradient.addColorStop(0.6, 'rgba(91, 33, 182, 0.4)')  // Darker purple
    gradient.addColorStop(1, 'rgba(76, 29, 149, 0)')      // Fade to transparent
    
    context.fillStyle = gradient
    context.fillRect(0, 0, 16, 16)
    
    const texture = new THREE.CanvasTexture(canvas)
    
    return new THREE.PointsMaterial({
      size: 0.08,
      color: new THREE.Color(0x8b5cf6), // Light purple base color
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.NormalBlending, // Changed from additive to normal
      depthWrite: false,
      map: texture
    })
  }, [])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // 4-7-8 breathing pattern
    const cycleTime = 19
    const currentTime = time % cycleTime
    
    let scale = 1
    let opacity = 0.4 * intensity
    let currentPhase = 'inhale'
    let breathProgress = 0
    
    // BREATHING PHASES
    if (currentTime < 4) { 
      // Inhale phase
      breathProgress = currentTime / 4
      scale = 0.24 + (breathProgress * 1.16)  // was: 0.7 + (breathProgress * 0.7)
      opacity = (0.15 + breathProgress * 0.65) * intensity  // was: (0.3 + breathProgress * 0.5)
      currentPhase = 'inhale'
    } else if (currentTime < 11) { 
      // Hold phase
      breathProgress = 1
      scale = 1.4
      opacity = 0.8 * intensity
      currentPhase = 'hold'
      
      const holdTime = (currentTime - 4) / 7
      scale += Math.sin(holdTime * Math.PI * 6) * 0.02  // reduce to 0.02 from 0.03
    } else { 
      // Exhale phase
      breathProgress = 1 - ((currentTime - 11) / 8)
      scale = 0.24 + (breathProgress * 1.16)  // was: 0.7 + (breathProgress * 0.7)
      opacity = (0.15 + breathProgress * 0.65) * intensity  // was: (0.3 + breathProgress * 0.5)
      currentPhase = 'exhale'
    }
    
    if (breathPhase !== currentPhase) {
      setBreathPhase(currentPhase)
    }
    
    // Update breathing ring particles with ASMR-like animation
    if (breathingRingRef.current) {
      const positions = breathingRingRef.current.geometry.attributes.position
      const sizes = breathingRingRef.current.geometry.attributes.size
      
      // Animate each particle
      for (let i = 0; i < positions.count; i++) {
        const i3 = i * 3
        
        // Get initial position
        const initX = particleData.initialPositions[i3]
        const initY = particleData.initialPositions[i3 + 1]
        const initZ = particleData.initialPositions[i3 + 2]
        
        // Calculate radial distance
        const distance = Math.sqrt(initX * initX + initY * initY)
        
        // Radial pulsation with wave delay based on distance
        const waveDelay = distance * 1.5  // was: distance * 2
        const waveTime = time * 1.5 - waveDelay + particleData.phases[i]  // was: time * 2
        const radialPulse = Math.sin(waveTime) * 0.06 * (1 - distance / 2.5)  // was: 0.1 * (1 - distance / 2)
        
        // Organic movement
        const organicX = Math.sin(time * 0.5 + particleData.phases[i]) * 0.015 * particleData.randomFactors[i3]  // was: time * 0.7, amplitude 0.02
        const organicY = Math.cos(time * 0.5 + particleData.phases[i]) * 0.015 * particleData.randomFactors[i3 + 1]  // was: time * 0.7, amplitude 0.02
        const organicZ = Math.sin(time * 0.4 + particleData.phases[i]) * 0.03 * particleData.randomFactors[i3 + 2]  // was: time * 0.5, amplitude 0.05
        
        // Breathing expansion
        const breathScale = scale + radialPulse
        
        // Update position
        positions.array[i3] = initX * breathScale + organicX
        positions.array[i3 + 1] = initY * breathScale + organicY
        positions.array[i3 + 2] = initZ + organicZ
        
        // Animate size based on breathing phase and distance
        const baseSize = 0.08 * (1 - distance / 3)
        const sizePulse = Math.sin(waveTime * 0.3) * 0.015  // was: 0.5 * 0.02
        sizes.array[i] = baseSize * (0.6 + breathProgress * 0.6) + sizePulse  // was: (0.8 + breathProgress * 0.4)
      }
      
      positions.needsUpdate = true
      sizes.needsUpdate = true
      
      // Update material
      const material = breathingRingRef.current.material as THREE.PointsMaterial
      material.opacity = opacity
      
      // Gentle rotation
      breathingRingRef.current.rotation.z += 0.0005  // was: 0.001
    }
      // Animate ripples
    ripplesRef.current.children.forEach((child) => {
      const ripple = child as THREE.Points
      const age = (time * 2) % 12
      const scale = 1 + age * 0.3
      const opacity = Math.max(0, 0.6 - age * 0.05)
      
      ripple.scale.setScalar(scale)
      ripple.rotation.z += 0.01
      
      if (ripple.material instanceof THREE.PointsMaterial) {
        ripple.material.opacity = opacity
      }
      
      if (opacity <= 0) {
        ripplesRef.current.remove(ripple)
        ripple.geometry.dispose()
        if (ripple.material instanceof THREE.Material) {
          ripple.material.dispose()
        }
      }
    })
  })
  return (
    <group position={[0, 0.8, -3]}>
      {/* Main breathing particles */}
      <points ref={breathingRingRef} geometry={ringGeometry} material={ringMaterial} />
      
      {/* Relaxation ripples */}
      <group ref={ripplesRef} />
    </group>
  )
}