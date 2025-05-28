import React from "react"
import { motion } from "framer-motion"
import { WidgetTestingContainer } from "@/components/widget-configurator/testing/WidgetTestingContainer"

interface TestingTabProps {
    widget: any
}

export function TestingTab({ widget }: TestingTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-0 bg-gradient-to-b from-white to-blue-50 rounded-b-lg"
        >
            <WidgetTestingContainer
                widgetId={String(widget.id)}
                config={widget}
                initialTab="preview"
            />
        </motion.div>
    )
} 