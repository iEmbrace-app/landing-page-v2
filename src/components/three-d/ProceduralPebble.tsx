import { useRef, useEffect, useMemo } from 'react'
import { 
  SphereGeometry,
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  Color,
  Vector2,
  CanvasTexture,
  RepeatWrapping
} from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'
import { LRUCache } from '../../utils/LRUCache'

// Cache noise instance globally to avoid recreation
const globalSimplex = new SimplexNoise()

// Replace Map with LRU Cache for better memory management
const geometryCache = new LRUCache<string, BufferGeometry>(50)

// Create optimized textures once and cache them
const createOptimizedTextures = () => {
  // Much smaller texture for better performance
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')!  
  const imageData = context.createImageData(128, 128)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = Math.random()
    const value = Math.floor(220 + noise * 10)
    imageData.data[i] = value - 1
    imageData.data[i + 1] = value
    imageData.data[i + 2] = value + 1
    imageData.data[i + 3] = 255
  }
  context.putImageData(imageData, 0, 0)
  
  const colorTexture = new CanvasTexture(canvas)
  colorTexture.wrapS = RepeatWrapping
  colorTexture.wrapT = RepeatWrapping
  colorTexture.repeat.set(1.2, 1.2)
    
  // Simplified normal map
  const normalCanvas = document.createElement('canvas')
  normalCanvas.width = 64
  normalCanvas.height = 64
  const normalContext = normalCanvas.getContext('2d')!
  const normalImageData = normalContext.createImageData(64, 64)
  for (let i = 0; i < normalImageData.data.length; i += 4) {
    normalImageData.data[i] = Math.floor(128 + (Math.random() - 0.5) * 8)
    normalImageData.data[i + 1] = Math.floor(128 + (Math.random() - 0.5) * 8)
    normalImageData.data[i + 2] = Math.floor(220 + Math.random() * 20)
    normalImageData.data[i + 3] = 255
  }
  normalContext.putImageData(normalImageData, 0, 0)
  
  const normalTexture = new CanvasTexture(normalCanvas)
  normalTexture.wrapS = RepeatWrapping
  normalTexture.wrapT = RepeatWrapping
  
  return { colorTexture, normalTexture }
}

// Cache textures globally to avoid recreation on every component mount
const cachedTextures = createOptimizedTextures()

interface ProceduralPebbleProps {
  distance?: number
  quality?: 'low' | 'medium' | 'high'
  enableTextures?: boolean
  isStatic?: boolean
}

export function ProceduralPebble({ 
  distance = 10, 
  quality = 'medium',
  enableTextures = true,
  isStatic = false
}: ProceduralPebbleProps = {}) {  const mesh = useRef<Mesh>(null!)
  
  // Dynamic geometry based on distance and quality - LOD (Level of Detail)
  const geometryArgs = useMemo((): [number, number, number] => {
    const qualityMap = {
      low: distance > 30 ? [0.8, 12, 8] : [0.8, 16, 12],
      medium: distance > 30 ? [0.8, 20, 14] : [0.8, 32, 24],
      high: distance > 30 ? [0.8, 32, 24] : [0.8, 48, 32]
    }
    return qualityMap[quality] as [number, number, number]
  }, [distance, quality])

  // Cached geometry with pre-computed modifications
  const processedGeometry = useMemo(() => {
    const cacheKey = `${geometryArgs.join('-')}-${distance}-${isStatic}`
    
    if (geometryCache.has(cacheKey)) {
      return geometryCache.get(cacheKey)!.clone()
    }

    const geo = new SphereGeometry(...geometryArgs)
    
    // Only modify geometry if not static
    if (!isStatic) {
      const pos = geo.attributes.position as BufferAttribute
      const bump = distance > 25 ? 0.008 : 0.015
      const noiseScale1 = distance > 25 ? 0.3 : 0.4
      const noiseScale2 = distance > 25 ? 0.8 : 1.2
      const flattenFactor = 0.92

      // Use single loop with optimized calculations
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const z = pos.getZ(i)

        // Simplified noise calculation - fewer layers for better performance
        let totalNoise: number
        if (distance > 25) {
          // Single noise layer for distant objects
          totalNoise = globalSimplex.noise3d(x * noiseScale1, y * noiseScale1, z * noiseScale1)
        } else {
          // Dual layer noise for close objects
          const n1 = globalSimplex.noise3d(x * noiseScale1, y * noiseScale1, z * noiseScale1) * 0.8
          const n2 = globalSimplex.noise3d(x * noiseScale2, y * noiseScale2, z * noiseScale2) * 0.2
          totalNoise = n1 + n2
        }

        pos.setXYZ(
          i,
          x + totalNoise * bump * Math.abs(x),
          y * flattenFactor + totalNoise * bump * 0.1,
          z + totalNoise * bump * Math.abs(z)
        )
      }
      
      pos.needsUpdate = true
      geo.computeVertexNormals()
    }

    // Cache the geometry
    geometryCache.set(cacheKey, geo)
    return geo.clone()
  }, [geometryArgs, distance, isStatic])
  
  // Optimized material with conditional texture loading
  const material = useMemo(() => {
    const baseProps = {
      color: new Color(0.98, 0.98, 0.98),
      roughness: 0.8,
      metalness: 0.02,
      envMapIntensity: 0.12,
    }

    // Only add textures if close enough and enabled
    if (enableTextures && distance < 25) {
      return new MeshStandardMaterial({
        ...baseProps,
        map: cachedTextures.colorTexture,
        normalMap: cachedTextures.normalTexture,
        normalScale: new Vector2(0.3, 0.3),
      })
    }

    // Simplified material for distant objects
    return new MeshStandardMaterial(baseProps)
  }, [distance, enableTextures])

  // Apply processed geometry to mesh when it mounts
  useEffect(() => {
    if (mesh.current && processedGeometry) {
      mesh.current.geometry = processedGeometry
    }
  }, [processedGeometry])
  
  // No internal animation - relying on Float component wrapper for movement
  
  return (
    <mesh ref={mesh} material={material} castShadow receiveShadow>
      <sphereGeometry args={geometryArgs} />
    </mesh>
  )
}