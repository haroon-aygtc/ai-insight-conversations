import React from "react"
import { motion } from "framer-motion"
import { WidgetPreview } from "@/components/widget-configurator/WidgetPreview"

interface PreviewTabProps {
    widget: any
}

export function PreviewTab({ widget }: PreviewTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-0 bg-gradient-to-b from-white to-blue-50 rounded-b-lg"
        >
            <div className="p-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-100">
                    <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="text-xs text-slate-500">{widget.name} - Preview</div>
                        <div></div>
                    </div>
                    <WidgetPreview config={widget} />
                </div>
            </div>
        </motion.div>
    )
} 