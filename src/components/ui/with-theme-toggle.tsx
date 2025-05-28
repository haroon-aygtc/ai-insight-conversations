import React from 'react'
import { ThemeToggle } from './theme-toggle'

interface WithThemeToggleProps {
  showThemeToggle?: boolean
  themeTogglePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

/**
 * Higher-order component that adds theme toggle functionality to any component
 * @param WrappedComponent The component to wrap with theme toggle functionality
 * @returns A new component with theme toggle functionality
 */
export function withThemeToggle<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithThemeToggleComponent({
    showThemeToggle = true,
    themeTogglePosition = 'top-right',
    ...props
  }: P & WithThemeToggleProps) {
    // Position classes based on the themeTogglePosition prop
    const positionClasses = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
    }

    return (
      <div className="relative">
        <WrappedComponent {...(props as P)} />
        
        {showThemeToggle && (
          <div className={`absolute z-50 ${positionClasses[themeTogglePosition]}`}>
            <ThemeToggle />
          </div>
        )}
      </div>
    )
  }
}

/**
 * Component that adds a floating theme toggle button to any content
 */
export const FloatingThemeToggle: React.FC<{
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}> = ({ position = 'bottom-right' }) => {
  // Position classes based on the position prop
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      <div className="bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-border/50">
        <ThemeToggle />
      </div>
    </div>
  )
}
