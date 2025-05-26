import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Type,
  Layout,
  Sparkles,
  Eye,
  Copy,
  RotateCcw,
  Wand2,
  Brush,
  Layers,
  Sun,
  Moon,
  Monitor,
  Check,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WidgetAppearanceTabProps {
  config: {
    primaryColor: string;
    secondaryColor: string;
    borderRadius: number;
    chatIconSize: number;
    fontFamily: string;
    fontSize?: string;
    fontWeight?: string;
    textColor?: string;
    headerTextColor?: string;
    gradientEnabled?: boolean;
    shadowIntensity?: number;
    backgroundOpacity?: number;
    headerStyle?: string;
    buttonStyle?: string;
    animationStyle?: string;
    theme?: string;
  };
  onChange: (key: string, value: any) => void;
}

export const WidgetAppearanceTab: React.FC<WidgetAppearanceTabProps> = ({ config, onChange }) => {
  const [activeSection, setActiveSection] = useState("themes");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Font family options
  const fontFamilies = [
    {
      name: "Inter",
      value: "inter",
      class: "font-['Inter']",
      preview: "Modern, clean sans-serif font"
    },
    {
      name: "Roboto",
      value: "roboto",
      class: "font-['Roboto']",
      preview: "Classic, balanced sans-serif font"
    },
    {
      name: "Poppins",
      value: "poppins",
      class: "font-['Poppins']",
      preview: "Geometric sans-serif with a friendly feel"
    },
    {
      name: "Montserrat",
      value: "montserrat",
      class: "font-['Montserrat']",
      preview: "Elegant sans-serif with great readability"
    },
    {
      name: "Lato",
      value: "lato",
      class: "font-['Lato']",
      preview: "Balanced sans-serif with warm feel"
    },
    {
      name: "System UI",
      value: "system-ui",
      class: "font-['system-ui']",
      preview: "Default system font for native appearance"
    }
  ];

  // Header style options
  const headerStyles = [
    {
      name: "Solid",
      value: "solid",
      preview: "Simple solid background color"
    },
    {
      name: "Gradient",
      value: "gradient",
      preview: "Subtle gradient background effect"
    },
    {
      name: "Glass",
      value: "glass",
      preview: "Modern glass morphism effect"
    },
    {
      name: "Flat",
      value: "flat",
      preview: "Minimalist flat design style"
    }
  ];

  // Button style options
  const buttonStyles = [
    {
      name: "Rounded",
      value: "rounded",
      preview: "Buttons with rounded corners"
    },
    {
      name: "Pill",
      value: "pill",
      preview: "Fully rounded pill-shaped buttons"
    },
    {
      name: "Square",
      value: "square",
      preview: "Buttons with square corners"
    },
    {
      name: "Minimal",
      value: "minimal",
      preview: "Clean buttons with subtle styling"
    }
  ];

  // Complete theme templates
  const themeTemplates = {
    business: [
      {
        id: "corporate-blue",
        name: "Corporate Blue",
        description: "Professional blue theme for business",
        preview: { primary: "#1e40af", secondary: "#f8fafc", accent: "#dbeafe" },
        config: {
          primaryColor: "#1e40af",
          secondaryColor: "#f8fafc",
          borderRadius: 8,
          chatIconSize: 40,
          fontFamily: "inter",
          gradientEnabled: false,
          shadowIntensity: 2,
          backgroundOpacity: 100,
          headerStyle: "solid",
          buttonStyle: "rounded",
        },
        tags: ["Professional", "Corporate", "Clean"]
      },
      {
        id: "executive-gray",
        name: "Executive Gray",
        description: "Sophisticated gray for executive environments",
        preview: { primary: "#374151", secondary: "#ffffff", accent: "#f9fafb" },
        config: {
          primaryColor: "#374151",
          secondaryColor: "#ffffff",
          borderRadius: 6,
          chatIconSize: 38,
          fontFamily: "roboto",
          gradientEnabled: false,
          shadowIntensity: 1,
          backgroundOpacity: 100,
          headerStyle: "flat",
          buttonStyle: "square",
        },
        tags: ["Executive", "Minimal", "Professional"]
      },
      {
        id: "modern-navy",
        name: "Modern Navy",
        description: "Contemporary navy with subtle gradients",
        preview: { primary: "#1e3a8a", secondary: "#f1f5f9", accent: "#e2e8f0" },
        config: {
          primaryColor: "#1e3a8a",
          secondaryColor: "#f1f5f9",
          borderRadius: 12,
          chatIconSize: 44,
          fontFamily: "inter",
          gradientEnabled: true,
          shadowIntensity: 3,
          backgroundOpacity: 95,
          headerStyle: "gradient",
          buttonStyle: "rounded",
        },
        tags: ["Modern", "Navy", "Gradient"]
      }
    ],
    creative: [
      {
        id: "vibrant-purple",
        name: "Vibrant Purple",
        description: "Creative purple with modern styling",
        preview: { primary: "#8b5cf6", secondary: "#faf5ff", accent: "#f3e8ff" },
        config: {
          primaryColor: "#8b5cf6",
          secondaryColor: "#faf5ff",
          borderRadius: 16,
          chatIconSize: 48,
          fontFamily: "poppins",
          gradientEnabled: true,
          shadowIntensity: 4,
          backgroundOpacity: 100,
          headerStyle: "gradient",
          buttonStyle: "pill",
        },
        tags: ["Creative", "Purple", "Modern"]
      },
      {
        id: "sunset-orange",
        name: "Sunset Orange",
        description: "Warm and energetic orange theme",
        preview: { primary: "#f97316", secondary: "#fffbeb", accent: "#fed7aa" },
        config: {
          primaryColor: "#f97316",
          secondaryColor: "#fffbeb",
          borderRadius: 20,
          chatIconSize: 52,
          fontFamily: "montserrat",
          gradientEnabled: true,
          shadowIntensity: 4,
          backgroundOpacity: 100,
          headerStyle: "gradient",
          buttonStyle: "pill",
        },
        tags: ["Creative", "Orange", "Energetic"]
      },
      {
        id: "ocean-teal",
        name: "Ocean Teal",
        description: "Calming teal with glass effects",
        preview: { primary: "#14b8a6", secondary: "#f0fdfa", accent: "#ccfbf1" },
        config: {
          primaryColor: "#14b8a6",
          secondaryColor: "#f0fdfa",
          borderRadius: 18,
          chatIconSize: 46,
          fontFamily: "lato",
          gradientEnabled: true,
          shadowIntensity: 3,
          backgroundOpacity: 90,
          headerStyle: "glass",
          buttonStyle: "rounded",
        },
        tags: ["Creative", "Teal", "Glass"]
      }
    ],
    minimal: [
      {
        id: "pure-minimal",
        name: "Pure Minimal",
        description: "Clean and minimal design",
        preview: { primary: "#64748b", secondary: "#ffffff", accent: "#f8fafc" },
        config: {
          primaryColor: "#64748b",
          secondaryColor: "#ffffff",
          borderRadius: 4,
          chatIconSize: 36,
          fontFamily: "system-ui",
          gradientEnabled: false,
          shadowIntensity: 1,
          backgroundOpacity: 100,
          headerStyle: "flat",
          buttonStyle: "minimal",
        },
        tags: ["Minimal", "Clean", "Simple"]
      },
      {
        id: "monochrome",
        name: "Monochrome",
        description: "Black and white simplicity",
        preview: { primary: "#000000", secondary: "#ffffff", accent: "#f5f5f5" },
        config: {
          primaryColor: "#000000",
          secondaryColor: "#ffffff",
          borderRadius: 0,
          chatIconSize: 32,
          fontFamily: "system-ui",
          gradientEnabled: false,
          shadowIntensity: 0,
          backgroundOpacity: 100,
          headerStyle: "flat",
          buttonStyle: "square",
        },
        tags: ["Monochrome", "Minimal", "Classic"]
      },
      {
        id: "soft-gray",
        name: "Soft Gray",
        description: "Gentle gray with subtle shadows",
        preview: { primary: "#6b7280", secondary: "#f9fafb", accent: "#e5e7eb" },
        config: {
          primaryColor: "#6b7280",
          secondaryColor: "#f9fafb",
          borderRadius: 8,
          chatIconSize: 40,
          fontFamily: "inter",
          gradientEnabled: false,
          shadowIntensity: 2,
          backgroundOpacity: 100,
          headerStyle: "solid",
          buttonStyle: "rounded",
        },
        tags: ["Minimal", "Gray", "Subtle"]
      }
    ],
    modern: [
      {
        id: "electric-blue",
        name: "Electric Blue",
        description: "Modern electric blue with gradients",
        preview: { primary: "#3b82f6", secondary: "#eff6ff", accent: "#dbeafe" },
        config: {
          primaryColor: "#3b82f6",
          secondaryColor: "#eff6ff",
          borderRadius: 14,
          chatIconSize: 44,
          fontFamily: "inter",
          gradientEnabled: true,
          shadowIntensity: 3,
          backgroundOpacity: 100,
          headerStyle: "gradient",
          buttonStyle: "rounded",
        },
        tags: ["Modern", "Blue", "Electric"]
      },
      {
        id: "neon-green",
        name: "Neon Green",
        description: "Fresh modern green with effects",
        preview: { primary: "#10b981", secondary: "#ecfdf5", accent: "#d1fae5" },
        config: {
          primaryColor: "#10b981",
          secondaryColor: "#ecfdf5",
          borderRadius: 16,
          chatIconSize: 48,
          fontFamily: "poppins",
          gradientEnabled: true,
          shadowIntensity: 4,
          backgroundOpacity: 100,
          headerStyle: "gradient",
          buttonStyle: "pill",
        },
        tags: ["Modern", "Green", "Fresh"]
      },
      {
        id: "cyber-pink",
        name: "Cyber Pink",
        description: "Futuristic pink with glass effects",
        preview: { primary: "#ec4899", secondary: "#fdf2f8", accent: "#fce7f3" },
        config: {
          primaryColor: "#ec4899",
          secondaryColor: "#fdf2f8",
          borderRadius: 20,
          chatIconSize: 50,
          fontFamily: "montserrat",
          gradientEnabled: true,
          shadowIntensity: 5,
          backgroundOpacity: 95,
          headerStyle: "glass",
          buttonStyle: "pill",
        },
        tags: ["Modern", "Pink", "Futuristic"]
      }
    ]
  };

  // Utility functions
  const applyTheme = (theme: any) => {
    Object.entries(theme.config).forEach(([key, value]) => {
      onChange(key, value);
    });
  };

  const copyThemeConfig = (theme: any) => {
    const configString = JSON.stringify(theme.config, null, 2);
    navigator.clipboard.writeText(configString);
    setCopiedColor(theme.id);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const generateRandomTheme = () => {
    const allThemes = Object.values(themeTemplates).flat();
    const randomTheme = allThemes[Math.floor(Math.random() * allThemes.length)];
    applyTheme(randomTheme);
  };

  const resetToDefaults = () => {
    const defaultTheme = themeTemplates.business[0]; // Corporate Blue
    applyTheme(defaultTheme);
  };

  const getCurrentTheme = () => {
    const allThemes = Object.values(themeTemplates).flat();
    return allThemes.find(theme =>
      theme.config.primaryColor === config.primaryColor &&
      theme.config.secondaryColor === config.secondaryColor &&
      theme.config.fontFamily === config.fontFamily
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Theme Templates
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose from professionally designed themes or customize individual settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={generateRandomTheme}>
            <Wand2 className="h-4 w-4 mr-1" />
            Random Theme
          </Button>
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Current Theme Indicator */}
      {getCurrentTheme() && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getCurrentTheme()?.preview.primary }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getCurrentTheme()?.preview.secondary }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getCurrentTheme()?.preview.accent }}
              />
            </div>
            <div>
              <div className="font-medium text-sm">
                Current Theme: {getCurrentTheme()?.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {getCurrentTheme()?.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Themes
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Effects
          </TabsTrigger>
        </TabsList>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-6 mt-6">
          {/* Custom Colors Section - Moved to Top */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brush className="h-4 w-4" />
                Custom Colors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create your own color combination or fine-tune a selected theme
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary Color */}
                  <div>
                    <Label className="mb-2 block">Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => onChange('primaryColor', e.target.value)}
                        className="w-12 h-12 p-1 border-2 rounded-lg cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => onChange('primaryColor', e.target.value)}
                        placeholder="#6366f1"
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(config.primaryColor);
                          setCopiedColor('primary');
                          setTimeout(() => setCopiedColor(null), 2000);
                        }}
                      >
                        {copiedColor === 'primary' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <Label className="mb-2 block">Secondary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => onChange('secondaryColor', e.target.value)}
                        className="w-12 h-12 p-1 border-2 rounded-lg cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={config.secondaryColor}
                        onChange={(e) => onChange('secondaryColor', e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(config.secondaryColor);
                          setCopiedColor('secondary');
                          setTimeout(() => setCopiedColor(null), 2000);
                        }}
                      >
                        {copiedColor === 'secondary' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Templates */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Choose from professionally designed themes as starting points
              </p>

              {/* Theme Categories */}
              {Object.entries(themeTemplates).map(([category, themes]) => (
                <div key={category} className="mb-6">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium capitalize flex items-center gap-2">
                      {category === 'business' && <Brush className="h-4 w-4" />}
                      {category === 'creative' && <Sparkles className="h-4 w-4" />}
                      {category === 'minimal' && <Eye className="h-4 w-4" />}
                      {category === 'modern' && <Layers className="h-4 w-4" />}
                      {category} Themes
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themes.map((theme) => {
                      const isCurrentTheme = getCurrentTheme()?.id === theme.id;
                      return (
                        <div
                          key={theme.id}
                          className={cn(
                            "group relative p-4 border rounded-lg cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                            isCurrentTheme && "border-primary bg-primary/5 shadow-md"
                          )}
                          onClick={() => applyTheme(theme)}
                        >
                          {/* Theme Preview */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-6 h-6 rounded-lg shadow-sm"
                                style={{ backgroundColor: theme.preview.primary }}
                              />
                              <div
                                className="w-6 h-6 rounded-lg shadow-sm border"
                                style={{ backgroundColor: theme.preview.secondary }}
                              />
                              <div
                                className="w-6 h-6 rounded-lg shadow-sm"
                                style={{ backgroundColor: theme.preview.accent }}
                              />
                              {isCurrentTheme && (
                                <Check className="h-4 w-4 text-primary ml-auto" />
                              )}
                            </div>
                            <h4 className="font-medium text-sm">{theme.name}</h4>
                            <p className="text-xs text-muted-foreground">{theme.description}</p>
                          </div>

                          {/* Theme Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {theme.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Theme Actions */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                applyTheme(theme);
                              }}
                              className="flex-1"
                            >
                              Apply
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyThemeConfig(theme);
                              }}
                            >
                              {copiedColor === theme.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>

                          {/* Current Theme Indicator */}
                          {isCurrentTheme && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="default" className="text-xs">
                                Active
                              </Badge>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Type className="h-4 w-4" />
                Typography Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Font & Size Settings - Combined in a grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">Font Family</Label>
                    <Select
                      value={config.fontFamily}
                      onValueChange={(value) => onChange('fontFamily', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select font family" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map(font => (
                          <SelectItem key={font.value} value={font.value} className={font.class}>
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Font Size</Label>
                      <Select
                        value={config.fontSize || "medium"}
                        onValueChange={(value) => onChange('fontSize', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-2 block">Font Weight</Label>
                      <Select
                        value={config.fontWeight || "normal"}
                        onValueChange={(value) => onChange('fontWeight', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="semibold">Semibold</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Text Color Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">Message Text Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={config.textColor || "#333333"}
                        onChange={(e) => onChange('textColor', e.target.value)}
                        className="w-10 h-10 p-1 border-2 rounded-lg cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={config.textColor || "#333333"}
                        onChange={(e) => onChange('textColor', e.target.value)}
                        placeholder="#333333"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Header Text Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={config.headerTextColor || "#ffffff"}
                        onChange={(e) => onChange('headerTextColor', e.target.value)}
                        className="w-10 h-10 p-1 border-2 rounded-lg cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={config.headerTextColor || "#ffffff"}
                        onChange={(e) => onChange('headerTextColor', e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography Preview */}
                <div className="mt-4">
                  <Label className="mb-2 block">Preview</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <div
                      className="p-3 mb-0"
                      style={{
                        backgroundColor: config.primaryColor,
                        fontFamily: config.fontFamily || 'system-ui'
                      }}
                    >
                      <p
                        className={cn(
                          "font-medium",
                          config.fontSize === "small" ? "text-sm" :
                            config.fontSize === "large" ? "text-lg" : "text-base",
                          config.fontWeight === "light" ? "font-light" :
                            config.fontWeight === "medium" ? "font-medium" :
                              config.fontWeight === "semibold" ? "font-semibold" :
                                config.fontWeight === "bold" ? "font-bold" : "font-normal"
                        )}
                        style={{
                          color: config.headerTextColor || "#ffffff"
                        }}
                      >
                        Header Text Example
                      </p>
                    </div>
                    <div
                      className="p-3 bg-white"
                      style={{
                        fontFamily: config.fontFamily || 'system-ui'
                      }}
                    >
                      <p
                        className={cn(
                          config.fontSize === "small" ? "text-sm" :
                            config.fontSize === "large" ? "text-lg" : "text-base",
                          config.fontWeight === "light" ? "font-light" :
                            config.fontWeight === "medium" ? "font-medium" :
                              config.fontWeight === "semibold" ? "font-semibold" :
                                config.fontWeight === "bold" ? "font-bold" : "font-normal"
                        )}
                        style={{
                          color: config.textColor || "#333333"
                        }}
                      >
                        This is how message text will appear in the chat widget.
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    The selected font family, size, weight and colors will be applied to all text in the widget.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-6 mt-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <p className="text-sm flex items-center text-blue-700">
              <Eye className="h-4 w-4 mr-2" />
              Changes in this tab will update the live preview in real-time. The widget remains open for easier customization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Size Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Size & Spacing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">
                    Border Radius: {config.borderRadius}px
                  </Label>
                  <Slider
                    value={[config.borderRadius]}
                    max={24}
                    min={0}
                    step={1}
                    onValueChange={(value) => onChange('borderRadius', value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Sharp</span>
                    <span>Rounded</span>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">
                    Chat Icon Size: {config.chatIconSize}px
                  </Label>
                  <Slider
                    value={[config.chatIconSize]}
                    max={80}
                    min={24}
                    step={2}
                    onValueChange={(value) => onChange('chatIconSize', value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Style Presets */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Style Presets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Header Style</Label>
                  <div className="space-y-2">
                    {headerStyles.map((style) => (
                      <div
                        key={style.value}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50",
                          config.headerStyle === style.value && "border-primary bg-primary/5"
                        )}
                        onClick={() => onChange('headerStyle', style.value)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{style.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {style.preview}
                            </div>
                          </div>
                          {config.headerStyle === style.value && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Button Style</Label>
                  <div className="space-y-2">
                    {buttonStyles.map((style) => (
                      <div
                        key={style.value}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50",
                          config.buttonStyle === style.value && "border-primary bg-primary/5"
                        )}
                        onClick={() => onChange('buttonStyle', style.value)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{style.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {style.preview}
                            </div>
                          </div>
                          {config.buttonStyle === style.value && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Effects Tab */}
        <TabsContent value="effects" className="space-y-6 mt-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <p className="text-sm flex items-center text-blue-700">
              <Eye className="h-4 w-4 mr-2" />
              Visual effects are applied to the preview in real-time. The widget stays open for easier customization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visual Effects */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Visual Effects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Gradient Effects</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable smooth color gradients
                    </p>
                  </div>
                  <Switch
                    checked={config.gradientEnabled || false}
                    onCheckedChange={(checked) => onChange('gradientEnabled', checked)}
                  />
                </div>

                <div>
                  <Label className="mb-3 block">
                    Shadow Intensity: {config.shadowIntensity || 2}
                  </Label>
                  <Slider
                    value={[config.shadowIntensity || 2]}
                    max={5}
                    min={0}
                    step={1}
                    onValueChange={(value) => onChange('shadowIntensity', value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>None</span>
                    <span>Strong</span>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">
                    Background Opacity: {config.backgroundOpacity || 100}%
                  </Label>
                  <Slider
                    value={[config.backgroundOpacity || 100]}
                    max={100}
                    min={70}
                    step={5}
                    onValueChange={(value) => onChange('backgroundOpacity', value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Transparent</span>
                    <span>Solid</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Advanced Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  Advanced Settings
                  {showAdvanced ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>

                {showAdvanced && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <Label className="mb-2 block">Animation Style</Label>
                      <Select
                        value={config.animationStyle || 'smooth'}
                        onValueChange={(value) => onChange('animationStyle', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smooth">Smooth</SelectItem>
                          <SelectItem value="bouncy">Bouncy</SelectItem>
                          <SelectItem value="sharp">Sharp</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-2 block">Theme Mode</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'light', icon: Sun, label: 'Light' },
                          { value: 'dark', icon: Moon, label: 'Dark' },
                          { value: 'auto', icon: Monitor, label: 'Auto' }
                        ].map((theme) => (
                          <Button
                            key={theme.value}
                            variant={config.theme === theme.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => onChange('theme', theme.value)}
                            className="flex items-center gap-1"
                          >
                            <theme.icon className="h-3 w-3" />
                            {theme.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
