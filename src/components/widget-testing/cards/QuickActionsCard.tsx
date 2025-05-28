import React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, ExternalLink, RefreshCw } from "lucide-react"

interface QuickActionsCardProps {
    widgetId: string
    environment: string
    onRefresh: () => void
}

export function QuickActionsCard({ widgetId, environment, onRefresh }: QuickActionsCardProps) {
    const navigate = useNavigate()

    return (
        <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
                <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-white to-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 group"
                    onClick={() => navigate(`/widgets/edit/${widgetId}`)}
                >
                    <Settings className="h-4 w-4 mr-2 group-hover:rotate-45 transition-transform duration-300" />
                    Edit Widget Configuration
                </Button>

                <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-white to-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 group"
                    onClick={() => {
                        const testPageUrl = `${window.location.origin}/widget-test-page.html?widgetId=${widgetId}&env=${environment}`
                        window.open(testPageUrl, "_blank")
                    }}
                >
                    <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Open in Test Page
                </Button>

                <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-white to-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 group"
                    onClick={onRefresh}
                >
                    <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Refresh Preview
                </Button>
            </CardContent>
        </Card>
    )
} 