import React from 'react'
import { ThemeToggle } from './theme-toggle'
import { Button } from './button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AdminPageHeaderProps {
  title: string
  description?: string
  backUrl?: string
  backLabel?: string
  showThemeToggle?: boolean
  children?: React.ReactNode
}

/**
 * A consistent header component for admin pages that includes a theme toggle
 * This ensures all admin pages have consistent styling and theme toggle functionality
 */
export function AdminPageHeader({
  title,
  description,
  backUrl,
  backLabel = 'Back',
  showThemeToggle = true,
  children
}: AdminPageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col space-y-2 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {children}
          {showThemeToggle && <ThemeToggle />}
        </div>
      </div>
      
      {backUrl && (
        <Button
          variant="ghost"
          className="w-fit -ml-2 mt-2"
          onClick={() => navigate(backUrl)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
      )}
    </div>
  )
}
