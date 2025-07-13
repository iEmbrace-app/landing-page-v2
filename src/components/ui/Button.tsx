import { motion } from 'framer-motion'
import styles from './Button.module.css'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'cta'
  size?: 'small' | 'medium' | 'large'
  isMobile?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  iconOnly?: boolean
  enableTextAnimation?: boolean
  enableRipple?: boolean
  
  // Motion props
  enableMotion?: boolean
  initial?: any
  animate?: any
  transition?: any
  whileHover?: any
  whileTap?: any
  
  // Common HTML button attributes
  'aria-label'?: string
  'aria-expanded'?: boolean
  'aria-selected'?: boolean
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  'aria-controls'?: string
  'aria-describedby'?: string
  role?: string
  id?: string
  name?: string
  value?: string
  form?: string
  formAction?: string
  formEncType?: string
  formMethod?: string
  formNoValidate?: boolean
  formTarget?: string
  tabIndex?: number
  title?: string
  autoFocus?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  isMobile = false,
  className = '',
  style,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  iconOnly = false,
  enableTextAnimation = true,
  enableRipple = true,
  enableMotion = false,
  initial,
  animate,
  transition,
  whileHover,
  whileTap,
  ...rest
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    isMobile && styles.mobile,
    loading && styles.loading,
    iconOnly && styles.iconOnly,
    className
  ].filter(Boolean).join(' ')

  const isDisabled = disabled || loading

  // Ripple effect handler
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!enableRipple || isDisabled) return

    const button = e.currentTarget
    const ripple = document.createElement('span')
    
    ripple.style.position = 'absolute'
    ripple.style.borderRadius = '50%'
    ripple.style.background = 'rgba(255, 255, 255, 0.5)'
    ripple.style.width = '0'
    ripple.style.height = '0'
    ripple.style.transform = 'translate(-50%, -50%)'
    ripple.style.pointerEvents = 'none'
    ripple.style.zIndex = '1000'
    
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const left = e.clientX - rect.left
    const top = e.clientY - rect.top
    
    ripple.style.left = left + 'px'
    ripple.style.top = top + 'px'
    
    button.appendChild(ripple)
    
    // Animate ripple
    requestAnimationFrame(() => {
      ripple.style.transition = 'all 0.6s ease-out'
      ripple.style.width = size + 'px'
      ripple.style.height = size + 'px'
      ripple.style.opacity = '0'
    })
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleRipple(e)
    if (onClick && !isDisabled) {
      onClick(e)
    }
  }

  const renderChildren = () => {
    if (typeof children === 'string' && enableTextAnimation && !iconOnly) {
      return (
        <span className={styles.textWrapper}>
          <span className={styles.text}>{children}</span>
          <span className={styles.textHover}>{children}</span>
        </span>
      )
    }
    return children
  }

  const buttonProps = {
    type,
    className: buttonClasses,
    style: {
      '--button-height': size === 'small' ? '32px' : size === 'medium' ? '36px' : '44px',
      ...style
    } as React.CSSProperties,
    onClick: handleClick,
    disabled: isDisabled,
    'aria-label': rest['aria-label'],
    'aria-expanded': rest['aria-expanded'],
    'aria-selected': rest['aria-selected'],
    'aria-haspopup': rest['aria-haspopup'],
    'aria-controls': rest['aria-controls'],
    'aria-describedby': rest['aria-describedby'],
    role: rest.role,
    id: rest.id,
    name: rest.name,
    value: rest.value,
    form: rest.form,
    formAction: rest.formAction,
    formEncType: rest.formEncType,
    formMethod: rest.formMethod,
    formNoValidate: rest.formNoValidate,
    formTarget: rest.formTarget,
    tabIndex: rest.tabIndex,
    title: rest.title,
    autoFocus: rest.autoFocus
  }

  if (enableMotion) {
    return (
      <motion.button
        {...buttonProps}
        initial={initial}
        animate={animate}
        transition={transition || { type: "spring", stiffness: 400, damping: 25 }}
        whileHover={whileHover}
        whileTap={whileTap || { scale: 0.98 }}
      >
        {renderChildren()}
      </motion.button>
    )
  }

  return (
    <button {...buttonProps}>
      {renderChildren()}
    </button>
  )
}
