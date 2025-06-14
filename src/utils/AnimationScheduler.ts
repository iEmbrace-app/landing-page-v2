/**
 * Animation task interface for priority-based scheduling
 */
export interface AnimationTask {
  id: string
  priority: number
  callback: (deltaTime: number) => void
  lastUpdate: number
  updateInterval: number
  enabled: boolean
}

/**
 * Priority-based animation scheduler
 * Optimizes performance by prioritizing important animations and managing frame budget
 */
export class AnimationScheduler {
  private tasks: AnimationTask[] = []
  private frameTime = 16.67 // Target 60fps
  private maxFrameBudget = 0.8 // Use 80% of frame budget
  private isRunning = false
  private lastFrameTime = 0

  addTask(task: Omit<AnimationTask, 'lastUpdate' | 'enabled'>): void {
    const newTask: AnimationTask = { 
      ...task, 
      lastUpdate: performance.now(),
      enabled: true 
    }
    this.tasks.push(newTask)
    this.sortByPriority()
  }

  removeTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id)
  }

  enableTask(id: string): void {
    const task = this.tasks.find(t => t.id === id)
    if (task) task.enabled = true
  }

  disableTask(id: string): void {
    const task = this.tasks.find(t => t.id === id)
    if (task) task.enabled = false
  }

  update(deltaTime: number): void {
    if (!this.isRunning) return

    const now = performance.now()
    const budget = this.frameTime * this.maxFrameBudget
    const startTime = now

    // Process tasks in priority order within frame budget
    for (const task of this.tasks) {
      if (now - startTime > budget) break // Prevent frame drops
      if (!task.enabled) continue
      
      if (now - task.lastUpdate >= task.updateInterval) {
        try {
          task.callback(deltaTime)
          task.lastUpdate = now
        } catch (error) {
          console.warn(`Animation task ${task.id} failed:`, error)
        }
      }
    }

    this.lastFrameTime = now
  }

  updatePriority(id: string, newPriority: number): void {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      task.priority = newPriority
      this.sortByPriority()
    }
  }

  updateInterval(id: string, newInterval: number): void {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      task.updateInterval = newInterval
    }
  }

  start(): void {
    this.isRunning = true
  }

  stop(): void {
    this.isRunning = false
  }

  clear(): void {
    this.tasks = []
  }

  getTaskCount(): number {
    return this.tasks.filter(t => t.enabled).length
  }

  getFrameStats(): { budget: number; usage: number; efficiency: number } {
    const now = performance.now()
    const frameUsage = now - this.lastFrameTime
    const budgetUsed = this.frameTime * this.maxFrameBudget
    return {
      budget: budgetUsed,
      usage: frameUsage,
      efficiency: budgetUsed > 0 ? (budgetUsed - frameUsage) / budgetUsed : 1
    }
  }

  private sortByPriority(): void {
    this.tasks.sort((a, b) => b.priority - a.priority) // Higher priority first
  }
}

// Global animation scheduler instance
export const globalAnimationScheduler = new AnimationScheduler()
globalAnimationScheduler.start()
