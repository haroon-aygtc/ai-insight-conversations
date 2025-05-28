import React from 'react'
import { ThemeProvider } from './theme-provider'
import { FloatingThemeToggle } from './with-theme-toggle'

interface GlobalThemeProviderProps {
  children: React.ReactNode
  showFloatingToggle?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

/**
 * A global theme provider that ensures theme functionality is available throughout the application
 * and optionally adds a floating theme toggle button
 */
export function GlobalThemeProvider({
  children,
  showFloatingToggle = false,
  position = 'bottom-right'
}: GlobalThemeProviderProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ai-insight-theme-preference">
      {children}
      {showFloatingToggle && <FloatingThemeToggle position={position} />}
    </ThemeProvider>
  )
}
