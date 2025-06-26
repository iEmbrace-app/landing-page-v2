import { motion, useSpring, useScroll } from "framer-motion"

interface ScrollProgressIndicatorProps {
  color?: string
  height?: number
  position?: 'top' | 'bottom'
}

export function ScrollProgressIndicator({ 
  color = "#6865BF", 
  height = 4,
  position = 'top'
}: ScrollProgressIndicatorProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      id="scroll-progress-indicator"
      style={{
        scaleX,
        position: "fixed",
        [position]: 0,
        left: 0,
        right: 0,
        height: height,
        transformOrigin: "0%",
        backgroundColor: color,
        zIndex: 1000,
        pointerEvents: "none",
        borderRadius: position === 'bottom' ? "2px 2px 0 0" : "0 0 2px 2px",
      }}
      initial={{ scaleX: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
      }}
    />
  )
}
