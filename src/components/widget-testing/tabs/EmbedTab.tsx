import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    RefreshCw,
    Copy,
    Check,
    ExternalLink,
    Code,
    Monitor,
    Layers,
    Smartphone,
    Package,
    Info
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
    generateScriptEmbed,
    generateIframeEmbed,
    generateWebComponentEmbed,
    generateOneLineEmbed,
    generateNpmInstallCommand,
} from "@/utils/embedCodeGenerator"

interface EmbedTabProps {
    widget: any
    refreshKey: number
    setRefreshKey: (key: number) => void
}

export function EmbedTab({ widget, refreshKey, setRefreshKey }: EmbedTabProps) {
    const { toast } = useToast()
    const [embedType, setEmbedType] = useState("script")
    const [environment, setEnvironment] = useState("development")
    const [copied, setCopied] = useState(false)

    // Handle environment change
    const handleEnvironmentChange = (value: string) => {
        setEnvironment(value)
    }

    // Generate embed code based on selected type
    const getEmbedCode = () => {
        if (!widget) return ""

        const widgetId = String(widget.id)
        const config = {
            appearance: widget.appearance_config || {},
            behavior: widget.behavior_config || {},
            content: widget.content_config || {},
            embedding: widget.embedding_config || {},
            // Include any additional configuration sections
            allowedDomains: widget.embedding_config?.allowedDomains || "*",
            isActive: widget.is_active !== false,
            isPublished: widget.is_published === true,
            widgetName: widget.name || "AI Chat Widget",
            lastUpdated: widget.updated_at || new Date().toISOString(),
        }

        switch (embedType) {
            case "script":
                return generateScriptEmbed(widgetId, config, environment)
            case "iframe":
                return generateIframeEmbed(widgetId, config, environment)
            case "webcomponent":
                return generateWebComponentEmbed(widgetId, config, environment)
            case "oneline":
                return generateOneLineEmbed(widgetId, environment, config)
            case "npm":
                return generateNpmInstallCommand(widgetId, config)
            default:
                return generateScriptEmbed(widgetId, config, environment)
        }
    }

    // Copy embed code to clipboard
    const handleCopyCode = () => {
        navigator.clipboard.writeText(getEmbedCode())
        setCopied(true)
        toast({
            title: "Copied!",
            description: "Embed code copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
    }

    // Refresh the preview
    const handleRefresh = () => {
        setRefreshKey(Date.now())
    }

    // Get environment badge color
    const getEnvironmentBadgeColor = () => {
        switch (environment) {
            case "production":
                return "bg-red-500 hover:bg-red-600"
            case "staging":
                return "bg-amber-500 hover:bg-amber-600"
            default:
                return "bg-blue-500 hover:bg-blue-600"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-6 space-y-6 bg-gradient-to-b from-white to-blue-50 rounded-b-lg"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium text-blue-800">
                        Embed Code Generator
                    </h3>
                    <p className="text-sm text-slate-500">
                        Choose the embed type and environment to generate the code
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={environment} onValueChange={handleEnvironmentChange}>
                        <SelectTrigger className="w-[140px] border-blue-200">
                            <SelectValue placeholder="Environment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="staging">Staging</SelectItem>
                            <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                    </Select>
                    <Badge className={getEnvironmentBadgeColor()}>
                        {environment.charAt(0).toUpperCase() + environment.slice(1)}
                    </Badge>
                </div>
            </div>

            <TooltipProvider>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                    <Button
                        variant={embedType === "script" ? "default" : "outline"}
                        onClick={() => setEmbedType("script")}
                        className="justify-start"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="flex items-center">
                                    <Code className="h-4 w-4 mr-2" />
                                    JavaScript
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Standard JavaScript embed code with full configuration</p>
                            </TooltipContent>
                        </Tooltip>
                    </Button>
                    <Button
                        variant={embedType === "iframe" ? "default" : "outline"}
                        onClick={() => setEmbedType("iframe")}
                        className="justify-start"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="flex items-center">
                                    <Monitor className="h-4 w-4 mr-2" />
                                    iFrame
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Embed as an iframe for isolated environments</p>
                            </TooltipContent>
                        </Tooltip>
                    </Button>
                    <Button
                        variant={embedType === "webcomponent" ? "default" : "outline"}
                        onClick={() => setEmbedType("webcomponent")}
                        className="justify-start"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="flex items-center">
                                    <Layers className="h-4 w-4 mr-2" />
                                    Web Component
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Modern web component implementation</p>
                            </TooltipContent>
                        </Tooltip>
                    </Button>
                    <Button
                        variant={embedType === "oneline" ? "default" : "outline"}
                        onClick={() => setEmbedType("oneline")}
                        className="justify-start"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="flex items-center">
                                    <Smartphone className="h-4 w-4 mr-2" />
                                    One-Line
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Simplified one-line embed for non-technical users</p>
                            </TooltipContent>
                        </Tooltip>
                    </Button>
                    <Button
                        variant={embedType === "npm" ? "default" : "outline"}
                        onClick={() => setEmbedType("npm")}
                        className="justify-start"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="flex items-center">
                                    <Package className="h-4 w-4 mr-2" />
                                    NPM/Yarn
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>NPM/Yarn package installation and usage</p>
                            </TooltipContent>
                        </Tooltip>
                    </Button>
                </div>
            </TooltipProvider>

            <div className="relative group">
                <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white p-3 rounded-t-md flex justify-between items-center">
                    <div className="flex items-center">
                        <Info className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="text-sm">
                            {embedType === "script" && "JavaScript Embed Code"}
                            {embedType === "iframe" && "iFrame Embed Code"}
                            {embedType === "webcomponent" && "Web Component Embed Code"}
                            {embedType === "oneline" && "One-Line Embed Code"}
                            {embedType === "npm" && "NPM/Yarn Installation"}
                        </span>
                    </div>
                    <div className="text-xs text-slate-400">
                        Environment: {environment.charAt(0).toUpperCase() + environment.slice(1)}
                    </div>
                </div>
                <pre className="bg-slate-900 text-white p-6 rounded-b-md overflow-x-auto text-sm font-mono whitespace-pre-wrap max-h-[400px] overflow-y-auto border-t border-slate-700 shadow-lg">
                    <code>{getEmbedCode()}</code>
                </pre>
                <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                        onClick={handleCopyCode}
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 mr-1" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 mr-1" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
                    onClick={() => {
                        const testPageUrl = `${window.location.origin}/widget-test-page.html?widgetId=${widget.id}&env=${environment}`
                        window.open(testPageUrl, "_blank")
                    }}
                >
                    <ExternalLink className="h-4 w-4" />
                    Open Test Page
                </Button>
            </div>
        </motion.div>
    )
} 