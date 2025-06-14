import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { FrustumCuller } from '../../utils/FrustumCuller'
import { SpatialHashGrid } from '../../utils/SpatialHashGrid'
import { globalAnimationScheduler } from '../../utils/AnimationScheduler'
import { globalPerformanceMonitor } from '../../utils/PerformanceMonitor'

/**
 * Scene Manager component that handles global 3D scene optimizations
 * - Frustum culling for performance
 * - Spatial partitioning for proximity queries
 * - Performance monitoring and adaptation
 */
export function SceneManager() {
  const { scene, camera } = useThree()
  const frustumCullerRef = useRef<FrustumCuller>()
  const spatialGridRef = useRef<SpatialHashGrid>()
  // Initialize spatial systems
  useEffect(() => {
    // Initialize frustum culler (no camera needed in constructor)
    frustumCullerRef.current = new FrustumCuller()
    
    // Initialize spatial hash grid with reasonable cell size for the scene
    spatialGridRef.current = new SpatialHashGrid(50) // 50 unit cells
    
    console.log('🎯 Scene Manager: Spatial systems initialized')
    
    return () => {
      frustumCullerRef.current = undefined
      spatialGridRef.current = undefined
    }
  }, [camera])

  // Register performance monitoring and culling with animation scheduler
  useEffect(() => {
    const taskId = 'scene-manager-optimization'
      globalAnimationScheduler.addTask({
      id: taskId,
      priority: 8, // High priority for scene management
      updateInterval: 100, // Run every ~6 frames for efficiency
      callback: () => {
        if (!frustumCullerRef.current || !spatialGridRef.current) return

        // Update global performance monitor
        globalPerformanceMonitor.update()
        const perfLevel = globalPerformanceMonitor.getPerformanceLevel()
        
        // Adaptive quality based on performance
        const isLowPerformance = perfLevel === 'low'
        const isHighPerformance = perfLevel === 'high'

        // Update frustum culling
        frustumCullerRef.current.updateCamera(camera)
        const cullingResults = frustumCullerRef.current.cullObjects()
        
        // Update spatial grid with visible objects
        spatialGridRef.current.clear()
        cullingResults.visible.forEach((item: { id: string; object: any }) => {
          if (item.object.position) {
            spatialGridRef.current!.insert(item.id, item.object.position)
          }
        })

        // Adaptive LOD management based on performance
        scene.traverse((object) => {
          if (object.userData.isOptimizable) {
            const distance = camera.position.distanceTo(object.position)
            
            // Adaptive quality settings
            let targetQuality: 'low' | 'medium' | 'high'
            if (isLowPerformance) {
              targetQuality = distance > 20 ? 'low' : 'medium'
            } else if (isHighPerformance) {
              targetQuality = distance > 30 ? 'medium' : 'high'
            } else {
              targetQuality = distance > 25 ? 'low' : distance > 15 ? 'medium' : 'high'
            }

            // Update object quality if it has the capability
            if (object.userData.updateQuality && object.userData.currentQuality !== targetQuality) {
              object.userData.updateQuality(targetQuality)
              object.userData.currentQuality = targetQuality
            }
          }
        })
      }
    })

    return () => {
      globalAnimationScheduler.removeTask(taskId)
    }
  }, [scene, camera])  // Performance monitoring for development
  useEffect(() => {
    const interval = setInterval(() => {
      const performanceLevel = globalPerformanceMonitor.getPerformanceLevel()
      const schedulerStats = globalAnimationScheduler.getFrameStats()
      
      console.log('🔧 Performance Metrics:', {
        'Performance Level': performanceLevel,
        'Animation Efficiency': Math.round(schedulerStats.efficiency * 100) + '%',
        'Scheduler Tasks': globalAnimationScheduler.getTaskCount(),
        'Spatial Objects': spatialGridRef.current?.getStats().totalObjects || 0
      })
    }, 5000) // Log every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Expose utilities to global window for debugging
  useEffect(() => {
    (window as any).sceneDebug = {
      frustumCuller: frustumCullerRef.current,
      spatialGrid: spatialGridRef.current,
      getPerformanceLevel: () => globalPerformanceMonitor.getPerformanceLevel(),
      getSchedulerStats: () => globalAnimationScheduler.getFrameStats()
    }
  }, [])

  // This component doesn't render anything visible
  return null
}
