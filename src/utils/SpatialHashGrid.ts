import * as THREE from 'three'

/**
 * 3D Spatial Hash Grid for efficient proximity queries
 * Optimizes distance calculations and collision detection
 */
export class SpatialHashGrid {
  private cellSize: number
  private grid = new Map<string, Set<string>>()
  private objects = new Map<string, THREE.Vector3>()

  constructor(cellSize: number) {
    this.cellSize = cellSize
  }

  private hash(x: number, y: number, z: number): string {
    const gridX = Math.floor(x / this.cellSize)
    const gridY = Math.floor(y / this.cellSize)
    const gridZ = Math.floor(z / this.cellSize)
    return `${gridX},${gridY},${gridZ}`
  }

  insert(id: string, position: THREE.Vector3): void
  insert(id: string, x: number, y: number, z: number): void
  insert(id: string, positionOrX: THREE.Vector3 | number, y?: number, z?: number): void {
    this.remove(id) // Remove from old position
    
    let x: number, yPos: number, zPos: number
    
    if (typeof positionOrX === 'number') {
      x = positionOrX
      yPos = y!
      zPos = z!
    } else {
      x = positionOrX.x
      yPos = positionOrX.y
      zPos = positionOrX.z
    }
    
    const key = this.hash(x, yPos, zPos)
    if (!this.grid.has(key)) {
      this.grid.set(key, new Set())
    }
    this.grid.get(key)!.add(id)
    this.objects.set(id, new THREE.Vector3(x, yPos, zPos))
  }

  remove(id: string): void {
    const obj = this.objects.get(id)
    if (obj) {
      const key = this.hash(obj.x, obj.y, obj.z)
      const cell = this.grid.get(key)
      if (cell) {
        cell.delete(id)
        if (cell.size === 0) {
          this.grid.delete(key)
        }
      }
      this.objects.delete(id)
    }
  }

  getNearby(position: THREE.Vector3, radius: number): string[]
  getNearby(x: number, y: number, z: number, radius: number): string[]
  getNearby(positionOrX: THREE.Vector3 | number, radiusOrY: number, z?: number, radius?: number): string[] {
    let x: number, y: number, zPos: number, searchRadius: number
    
    if (typeof positionOrX === 'number') {
      x = positionOrX
      y = radiusOrY
      zPos = z!
      searchRadius = radius!
    } else {
      x = positionOrX.x
      y = positionOrX.y
      zPos = positionOrX.z
      searchRadius = radiusOrY
    }
    
    const nearby: string[] = []
    const cellRadius = Math.ceil(searchRadius / this.cellSize)
    
    const centerGridX = Math.floor(x / this.cellSize)
    const centerGridY = Math.floor(y / this.cellSize)
    const centerGridZ = Math.floor(zPos / this.cellSize)
    
    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        for (let dz = -cellRadius; dz <= cellRadius; dz++) {
          const gridX = centerGridX + dx
          const gridY = centerGridY + dy
          const gridZ = centerGridZ + dz
          const key = `${gridX},${gridY},${gridZ}`
          
          const cell = this.grid.get(key)
          if (cell) {
            nearby.push(...Array.from(cell))
          }
        }
      }
    }
    
    return nearby
  }

  getNearbyWithDistance(
    position: THREE.Vector3, 
    radius: number
  ): Array<{ id: string; distance: number; position: THREE.Vector3 }> {
    const nearby = this.getNearby(position, radius)
    const results: Array<{ id: string; distance: number; position: THREE.Vector3 }> = []
    
    for (const id of nearby) {
      const objPos = this.objects.get(id)
      if (objPos) {
        const distance = position.distanceTo(objPos)
        if (distance <= radius) {
          results.push({ id, distance, position: objPos.clone() })
        }
      }
    }
    
    return results.sort((a, b) => a.distance - b.distance)
  }

  update(id: string, newPosition: THREE.Vector3): void {
    this.insert(id, newPosition)
  }

  clear(): void {
    this.grid.clear()
    this.objects.clear()
  }

  getStats(): { 
    totalObjects: number
    totalCells: number
    averageObjectsPerCell: number
    maxObjectsInCell: number
  } {
    const totalObjects = this.objects.size
    const totalCells = this.grid.size
    
    let maxObjectsInCell = 0
    for (const cell of this.grid.values()) {
      maxObjectsInCell = Math.max(maxObjectsInCell, cell.size)
    }
    
    const averageObjectsPerCell = totalCells > 0 ? totalObjects / totalCells : 0
    
    return {
      totalObjects,
      totalCells,
      averageObjectsPerCell,
      maxObjectsInCell
    }
  }

  getAllObjects(): Array<{ id: string; position: THREE.Vector3 }> {
    const results: Array<{ id: string; position: THREE.Vector3 }> = []
    for (const [id, position] of this.objects.entries()) {
      results.push({ id, position: position.clone() })
    }
    return results
  }
}
