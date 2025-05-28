import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Monitor, Tablet, Smartphone } from "lucide-react"

interface DevicePreviewCardProps {
    onDeviceSelect: (device: "desktop" | "tablet" | "mobile") => void
    setActiveTab: (tab: string) => void
}

export function DevicePreviewCard({ onDeviceSelect, setActiveTab }: DevicePreviewCardProps) {
    const handleDeviceSelect = (device: "desktop" | "tablet" | "mobile") => {
        setActiveTab("preview")
        onDeviceSelect(device)
    }

    return (
        <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
                    Device Preview
                </CardTitle>
                <CardDescription>Test on different devices</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-3">
                    <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center py-4"
                        onClick={() => handleDeviceSelect("desktop")}
                    >
                        <Monitor className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xs">Desktop</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center py-4"
                        onClick={() => handleDeviceSelect("tablet")}
                    >
                        <Tablet className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xs">Tablet</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center py-4"
                        onClick={() => handleDeviceSelect("mobile")}
                    >
                        <Smartphone className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xs">Mobile</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
} 