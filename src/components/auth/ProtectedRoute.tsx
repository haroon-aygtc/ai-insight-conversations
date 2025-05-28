import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requireAll?: boolean; // If true, user must have ALL roles/permissions. If false, ANY will suffice.
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requireAll = false,
  fallbackPath = '/login',
}) => {
  const { isAuthenticated, isLoading, hasAnyRole, hasAnyPermissionSync, user } = useAuth();
  const location = useLocation();
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRoles = requireAll
      ? requiredRoles.every(role => user?.roles.includes(role))
      : hasAnyRole(requiredRoles);

    if (!hasRequiredRoles) {
      return (
        <Navigate 
          to="/unauthorized" 
          state={{
            requiredRole: requireAll ? requiredRoles.join(', ') : `One of: ${requiredRoles.join(', ')}`,
            message: `You need ${requireAll ? 'all of' : 'at least one of'} the required roles to access this page.`
          }} 
          replace 
        />
      );
    }
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    // Use the synchronous version for immediate UI rendering decisions
    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every(permission => user?.permissions.includes(permission))
      : hasAnyPermissionSync(requiredPermissions);

    if (!hasRequiredPermissions) {
      return (
        <Navigate 
          to="/unauthorized" 
          state={{
            requiredPermission: requireAll ? requiredPermissions.join(', ') : `One of: ${requiredPermissions.join(', ')}`,
            message: `You need ${requireAll ? 'all of' : 'at least one of'} the required permissions to access this page.`
          }} 
          replace 
        />
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
