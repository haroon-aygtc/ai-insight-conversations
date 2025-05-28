import React from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WidgetInfoCardProps {
    widget: any
}

export function WidgetInfoCard({ widget }: WidgetInfoCardProps) {
    return (
        <Card>
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                    Widget Information
                </CardTitle>
                <CardDescription>
                    Details about the selected widget
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
                <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100">
                    <h4 className="text-sm font-medium mb-1 text-blue-800">Name</h4>
                    <p className="text-sm font-medium">{widget.name}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                    <h4 className="text-sm font-medium mb-1 text-slate-700">Description</h4>
                    <p className="text-sm text-slate-600">
                        {widget.description || "No description provided"}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                    <div>
                        <h4 className="text-sm font-medium mb-1">Status</h4>
                        <Badge
                            variant={widget.is_active ? "default" : "secondary"}
                            className={widget.is_active ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}
                        >
                            {widget.is_active ? "Active" : "Inactive"}
                        </Badge>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-1">Published</h4>
                        <Badge
                            variant={widget.is_published ? "default" : "outline"}
                            className={widget.is_published ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "border-slate-300 text-slate-800"}
                        >
                            {widget.is_published ? "Published" : "Draft"}
                        </Badge>
                    </div>
                </div>

                <div className="flex gap-4 bg-slate-50/80 p-3 rounded-md border border-slate-100">
                    <div className="flex-1">
                        <h4 className="text-sm font-medium mb-1 text-slate-700">Created</h4>
                        <p className="text-sm text-slate-600">
                            {new Date(widget.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex-1">
                        <h4 className="text-sm font-medium mb-1 text-slate-700">Last Updated</h4>
                        <p className="text-sm text-slate-600">
                            {new Date(widget.updated_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 