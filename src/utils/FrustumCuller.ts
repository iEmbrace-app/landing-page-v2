import * as THREE from 'three'

/**
 * Frustum culling system for efficient 3D object visibility management
 * Only renders objects that are visible to the camera
 */
export class FrustumCuller {
  private frustum = new THREE.Frustum()
  private cameraMatrix = new THREE.Matrix4()
  private objects = new Map<string, { object: THREE.Object3D; bounds: THREE.Box3 }>()

  addObject(id: string, object: THREE.Object3D, customBounds?: THREE.Box3): void {
    let bounds: THREE.Box3
    
    if (customBounds) {
      bounds = customBounds.clone()
    } else {
      bounds = new THREE.Box3().setFromObject(object)
    }
    
    this.objects.set(id, { object, bounds })
  }

  removeObject(id: string): void {
    this.objects.delete(id)
  }

  updateCamera(camera: THREE.Camera): void {
    this.cameraMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this.frustum.setFromProjectionMatrix(this.cameraMatrix)
  }

  cullObjects(): { 
    visible: Array<{ id: string; object: THREE.Object3D }>
    hidden: Array<{ id: string; object: THREE.Object3D }>
  } {
    const visible: Array<{ id: string; object: THREE.Object3D }> = []
    const hidden: Array<{ id: string; object: THREE.Object3D }> = []

    for (const [id, { object, bounds }] of this.objects.entries()) {
      // Update bounds to world position
      const worldBounds = bounds.clone()
      worldBounds.applyMatrix4(object.matrixWorld)

      if (this.frustum.intersectsBox(worldBounds)) {
        visible.push({ id, object })
        object.visible = true
      } else {
        hidden.push({ id, object })
        object.visible = false
      }
    }

    return { visible, hidden }
  }

  isVisible(id: string): boolean {
    const item = this.objects.get(id)
    if (!item) return false

    const worldBounds = item.bounds.clone()
    worldBounds.applyMatrix4(item.object.matrixWorld)
    
    return this.frustum.intersectsBox(worldBounds)
  }

  getVisibleObjects(): Array<{ id: string; object: THREE.Object3D }> {
    const visible: Array<{ id: string; object: THREE.Object3D }> = []

    for (const [id, { object, bounds }] of this.objects.entries()) {
      const worldBounds = bounds.clone()
      worldBounds.applyMatrix4(object.matrixWorld)

      if (this.frustum.intersectsBox(worldBounds)) {
        visible.push({ id, object })
      }
    }

    return visible
  }

  updateObjectBounds(id: string, newBounds?: THREE.Box3): void {
    const item = this.objects.get(id)
    if (!item) return

    if (newBounds) {
      item.bounds = newBounds.clone()
    } else {
      item.bounds = new THREE.Box3().setFromObject(item.object)
    }
  }

  clear(): void {
    this.objects.clear()
  }

  getStats(): {
    totalObjects: number
    visibleCount: number
    hiddenCount: number
    cullingEfficiency: number
  } {
    const totalObjects = this.objects.size
    const { visible, hidden } = this.cullObjects()
    const visibleCount = visible.length
    const hiddenCount = hidden.length
    const cullingEfficiency = totalObjects > 0 ? hiddenCount / totalObjects : 0

    return {
      totalObjects,
      visibleCount,
      hiddenCount,
      cullingEfficiency
    }
  }
}

/**
 * Level of Detail (LOD) manager based on distance from camera
 */
export class LODManager {
  private objects = new Map<string, {
    object: THREE.Object3D
    lodLevels: Array<{ distance: number; quality: 'low' | 'medium' | 'high' }>
    currentLOD: 'low' | 'medium' | 'high'
  }>()
  
  private cameraPosition = new THREE.Vector3()

  addObject(
    id: string, 
    object: THREE.Object3D, 
    lodLevels: Array<{ distance: number; quality: 'low' | 'medium' | 'high' }>
  ): void {
    // Sort LOD levels by distance (closest first)
    const sortedLevels = lodLevels.sort((a, b) => a.distance - b.distance)
    
    this.objects.set(id, {
      object,
      lodLevels: sortedLevels,
      currentLOD: 'high' // Default to highest quality
    })
  }

  removeObject(id: string): void {
    this.objects.delete(id)
  }

  updateCamera(camera: THREE.Camera): void {
    this.cameraPosition.setFromMatrixPosition(camera.matrixWorld)
  }

  updateLOD(): Array<{ id: string; newLOD: 'low' | 'medium' | 'high'; distance: number }> {
    const updates: Array<{ id: string; newLOD: 'low' | 'medium' | 'high'; distance: number }> = []

    for (const [id, item] of this.objects.entries()) {
      const objectPosition = new THREE.Vector3()
      objectPosition.setFromMatrixPosition(item.object.matrixWorld)
      
      const distance = this.cameraPosition.distanceTo(objectPosition)
      
      // Find appropriate LOD level
      let newLOD: 'low' | 'medium' | 'high' = 'high'
      
      for (const level of item.lodLevels) {
        if (distance >= level.distance) {
          newLOD = level.quality
        }
      }

      if (newLOD !== item.currentLOD) {
        item.currentLOD = newLOD
        updates.push({ id, newLOD, distance })
      }
    }

    return updates
  }

  getLOD(id: string): 'low' | 'medium' | 'high' | null {
    const item = this.objects.get(id)
    return item ? item.currentLOD : null
  }

  getDistance(id: string): number | null {
    const item = this.objects.get(id)
    if (!item) return null

    const objectPosition = new THREE.Vector3()
    objectPosition.setFromMatrixPosition(item.object.matrixWorld)
    
    return this.cameraPosition.distanceTo(objectPosition)
  }

  clear(): void {
    this.objects.clear()
  }
}
