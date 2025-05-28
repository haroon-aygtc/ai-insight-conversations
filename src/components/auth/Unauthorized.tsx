import React from "react"
import { motion } from "framer-motion"
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

interface UnauthorizedProps {
  title?: string
  message?: string
  showBackButton?: boolean
  showHomeButton?: boolean
  requiredPermission?: string
  requiredRole?: string
}

const Unauthorized: React.FC<UnauthorizedProps> = ({
  title = "Access Denied",
  message = "You don't have permission to access this resource.",
  showBackButton = true,
  showHomeButton = true,
  requiredPermission,
  requiredRole,
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold text-red-600">{title}</CardTitle>
            <CardDescription className="text-center text-gray-600 mt-2">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-2">
            {(requiredPermission || requiredRole) && (
              <div className="bg-gray-50 p-4 rounded-md mb-4 text-left">
                {requiredPermission && (
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Required permission: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs">{requiredPermission}</span>
                    </span>
                  </div>
                )}
                {requiredRole && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Required role: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs">{requiredRole}</span>
                    </span>
                  </div>
                )}
              </div>
            )}
            <p className="text-sm text-gray-500">
              If you believe you should have access to this page, please contact your administrator.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 pt-2">
            {showBackButton && (
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            )}
            {showHomeButton && (
              <Button 
                onClick={() => navigate("/")}
                className="bg-red-600 hover:bg-red-700"
              >
                Return to Dashboard
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default Unauthorized
