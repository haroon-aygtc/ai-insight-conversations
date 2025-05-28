import React from "react"
import { useLocation } from "react-router-dom"
import Unauthorized from "@/components/auth/Unauthorized"

const UnauthorizedPage: React.FC = () => {
  const location = useLocation()
  const state = location.state as { 
    requiredPermission?: string
    requiredRole?: string
    message?: string
  } | null

  return (
    <Unauthorized
      title="Access Denied"
      message={state?.message || "You don't have permission to access this resource."}
      requiredPermission={state?.requiredPermission}
      requiredRole={state?.requiredRole}
      showBackButton={true}
      showHomeButton={true}
    />
  )
}

export default UnauthorizedPage
