import React, { useState } from "react"
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  Loader2,
  ChevronDown,
  HelpCircle
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  onSearch?: (query: string) => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onSearch 
}) => {
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    }
    if (user?.full_name) {
      const names = user.full_name.split(' ')
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      }
      return user.full_name.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue.trim())
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // The logout function in AuthContext already handles navigation and toast notifications
      await logout();
      // No need to navigate or show toast here as it's handled in the AuthContext
    } catch (error) {
      // Error is already handled in AuthContext
      console.error('Logout error in component:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm"
    >
      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch}>
          <motion.div 
            className={`relative flex items-center transition-all duration-300 ${
              searchFocused ? 'w-80' : 'w-64'
            }`}
            whileFocus={{ scale: 1.02 }}
          >
            <Search 
              size={18} 
              className={`absolute left-3 transition-colors duration-200 ${
                searchFocused ? 'text-primary' : 'text-muted-foreground'
              }`} 
            />
            <Input
              placeholder="Search anything..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`pl-10 pr-4 h-10 rounded-xl border-2 transition-all duration-200 ${
                searchFocused 
                  ? 'border-primary/30 shadow-lg shadow-primary/10 bg-background' 
                  : 'border-border bg-background/50'
              }`}
            />
          </motion.div>
        </form>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/settings')}
        >
          <Settings size={18} />
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-2 h-10 hover:bg-accent/60"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-background shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                  {user?.avatar_url && (
                    <AvatarImage src={user.avatar_url} alt={user.full_name || `${user.first_name} ${user.last_name}`} />
                  )}
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium leading-none">
                    {user?.full_name || `${user?.first_name} ${user?.last_name}` || 'User'}
                  </span>
                  {user?.roles && user.roles.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {user.roles[0]}
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown size={16} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.full_name || `${user?.first_name} ${user?.last_name}` || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/help')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out? You will need to sign in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600"
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      'Log out'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
