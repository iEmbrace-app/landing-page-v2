import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function WaterShaderBackground() {
  const meshRef = useRef<THREE.Mesh>(null!)
    // Enhanced water shader with breathing synchronization
  const waterShader = useMemo(() => ({
    uniforms: {
      tex: { value: null },
      time: { value: 0.0 },
      factor: { value: 2.0 }, // Increased factor for stronger effects
      breathPhase: { value: 0.0 }, // New breathing uniform
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    
    vertexShader: `
      varying vec2 vUv;
      void main(){  
        vUv = uv; 
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
      }
    `,
      fragmentShader: `
      uniform float time;
      uniform float factor;
      uniform float breathPhase;
      uniform vec2 resolution;
      uniform sampler2D tex;
      
      varying vec2 vUv;
      
      void main() {  
        vec2 uv1 = vUv;
        vec2 uv = gl_FragCoord.xy/resolution.xy;        float frequency = 8.0; // Increased frequency for more waves
        float amplitude = 0.025 * factor; // Increased amplitude for stronger distortion
        float x = uv1.y * frequency + time * .7; 
        float y = uv1.x * frequency + time * .3;        uv1.x += cos(x+y) * amplitude * cos(y);
        uv1.y += sin(x-y) * amplitude * cos(y);          // Apple-inspired ultra-light color palette with 95% white space
        vec3 color1 = vec3(0.99, 0.99, 0.99); // Almost pure white
        vec3 color2 = vec3(0.98, 0.97, 0.99); // Barely perceptible lavender
        vec3 color3 = vec3(0.96, 0.95, 0.98); // Ultra-light purple tint
        vec3 color4 = vec3(0.94, 0.93, 0.97); // Subtle purple accent          // Create subtle gradient with minimal depth
        vec3 color = mix(color1, color2, uv1.y);
        color = mix(color, color3, uv1.y * uv1.y * 0.3); // Reduced effect
        color = mix(color, color4, smoothstep(0.8, 1.0, uv1.y)); // Minimal edge accent        // Minimal shimmer effects for Apple-inspired subtlety
        float shimmer1 = sin(uv1.x * 60.0 + time * 2.5) * sin(uv1.y * 60.0 + time * 1.8) * 0.03;
        float shimmer2 = sin(uv1.x * 40.0 + time * 1.5) * sin(uv1.y * 40.0 + time * 1.0) * 0.02;
        float shimmer3 = sin(uv1.x * 80.0 + time * 3.0) * sin(uv1.y * 80.0 + time * 2.2) * 0.015;
        
        // Ultra-subtle shimmer layers
        color += shimmer1 * vec3(0.99, 0.98, 0.99) * 0.02; // Barely visible white shimmer
        color += shimmer2 * vec3(0.98, 0.97, 0.99) * 0.015; // Subtle white shimmer
        color += shimmer3 * vec3(0.97, 0.96, 0.98) * 0.01; // Minimal purple hint
          // Subtle wave highlights with minimal intensity
        float wave1 = sin(uv1.x * 25.0 + time * 1.2) * 0.008;
        float wave2 = cos(uv1.y * 30.0 + time * 0.8) * 0.006;
        float wave3 = sin((uv1.x + uv1.y) * 20.0 + time * 1.5) * 0.007;
        
        color += wave1 * vec3(0.995, 0.99, 0.995); // Barely visible white highlight
        color += wave2 * vec3(0.99, 0.985, 0.99); // Subtle white wave
        color += wave3 * vec3(0.985, 0.98, 0.985); // Minimal accent
          gl_FragColor = vec4(color, 1.0);
      }
    `
  }), [])
  
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: waterShader.uniforms,
    vertexShader: waterShader.vertexShader,
    fragmentShader: waterShader.fragmentShader,
    transparent: false,
    side: THREE.DoubleSide // Ensure it's visible from both sides
  }), [waterShader])
  // Enhanced animation loop with breathing synchronization
  useFrame(() => {
    if (meshRef.current && material.uniforms) {
      const time = material.uniforms.time.value + 0.08
      material.uniforms.time.value = time
      
      // 4-7-8 breathing pattern synchronization
      const breathCycle = 19 // Total cycle duration
      const breathPhase = (time % breathCycle) / breathCycle
      material.uniforms.breathPhase.value = breathPhase
      
      // Update resolution
      material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight)
      
      // Subtle background movement for depth with breathing influence
      const breathInfluence = Math.sin(breathPhase * Math.PI * 2) * 0.1
      meshRef.current.position.x = Math.sin(time * 0.1) * 0.5 + breathInfluence * 0.2
      meshRef.current.position.y = Math.cos(time * 0.1) * 0.3 + breathInfluence * 0.15
    }
  })
  
  return (
    <mesh 
      ref={meshRef} 
      position={[0, 0, -5]} // Closer to camera for better visibility
      scale={[60, 60, 1]} // Larger scale to ensure full coverage
      material={material}
      renderOrder={-1} // Render behind other objects
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}