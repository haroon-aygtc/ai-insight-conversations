
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Palette, Sparkles, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'creative' | 'minimal' | 'premium';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headerTextColor: string;
  borderRadius: number;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  gradientEnabled: boolean;
  shadowIntensity: number;
  icon: React.ReactNode;
  preview: string;
}

interface ModernThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (themeId: string, config: any) => void;
  currentConfig: any;
}

const themeTemplates: ThemeTemplate[] = [
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    description: "Professional and trustworthy",
    category: "business",
    primaryColor: "#2563eb",
    secondaryColor: "#ffffff",
    accentColor: "#3b82f6",
    backgroundColor: "#f8fafc",
    textColor: "#1e293b",
    headerTextColor: "#ffffff",
    borderRadius: 8,
    fontFamily: "inter",
    fontSize: "medium",
    fontWeight: "normal",
    gradientEnabled: false,
    shadowIntensity: 2,
    icon: <Crown className="h-4 w-4" />,
    preview: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)"
  },
  {
    id: "creative-purple",
    name: "Creative Purple",
    description: "Modern and innovative",
    category: "creative",
    primaryColor: "#8b5cf6",
    secondaryColor: "#ffffff",
    accentColor: "#a78bfa",
    backgroundColor: "#faf5ff",
    textColor: "#1e293b",
    headerTextColor: "#ffffff",
    borderRadius: 12,
    fontFamily: "poppins",
    fontSize: "medium",
    fontWeight: "medium",
    gradientEnabled: true,
    shadowIntensity: 3,
    icon: <Sparkles className="h-4 w-4" />,
    preview: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
  },
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    description: "Clean and sophisticated",
    category: "minimal",
    primaryColor: "#1f2937",
    secondaryColor: "#111827",
    accentColor: "#6b7280",
    backgroundColor: "#030712",
    textColor: "#f9fafb",
    headerTextColor: "#ffffff",
    borderRadius: 6,
    fontFamily: "inter",
    fontSize: "small",
    fontWeight: "light",
    gradientEnabled: false,
    shadowIntensity: 4,
    icon: <Zap className="h-4 w-4" />,
    preview: "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
  },
  {
    id: "vibrant-green",
    name: "Vibrant Green",
    description: "Fresh and energetic",
    category: "creative",
    primaryColor: "#10b981",
    secondaryColor: "#ffffff",
    accentColor: "#34d399",
    backgroundColor: "#ecfdf5",
    textColor: "#1e293b",
    headerTextColor: "#ffffff",
    borderRadius: 16,
    fontFamily: "poppins",
    fontSize: "medium",
    fontWeight: "semibold",
    gradientEnabled: true,
    shadowIntensity: 2,
    icon: <Sparkles className="h-4 w-4" />,
    preview: "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
  },
  {
    id: "premium-gold",
    name: "Premium Gold",
    description: "Luxury and elegance",
    category: "premium",
    primaryColor: "#f59e0b",
    secondaryColor: "#fffbeb",
    accentColor: "#fbbf24",
    backgroundColor: "#fffbeb",
    textColor: "#1e293b",
    headerTextColor: "#ffffff",
    borderRadius: 8,
    fontFamily: "playfair",
    fontSize: "large",
    fontWeight: "bold",
    gradientEnabled: true,
    shadowIntensity: 5,
    icon: <Crown className="h-4 w-4" />,
    preview: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
  },
  {
    id: "tech-cyan",
    name: "Tech Cyan",
    description: "Modern and digital",
    category: "business",
    primaryColor: "#06b6d4",
    secondaryColor: "#ffffff",
    accentColor: "#22d3ee",
    backgroundColor: "#ecfeff",
    textColor: "#1e293b",
    headerTextColor: "#ffffff",
    borderRadius: 10,
    fontFamily: "inter",
    fontSize: "medium",
    fontWeight: "medium",
    gradientEnabled: true,
    shadowIntensity: 3,
    icon: <Zap className="h-4 w-4" />,
    preview: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)"
  }
];

const ModernThemeSelector: React.FC<ModernThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange,
  currentConfig,
}) => {
  const categories = {
    business: { label: "Business", color: "bg-blue-100 text-blue-800" },
    creative: { label: "Creative", color: "bg-purple-100 text-purple-800" },
    minimal: { label: "Minimal", color: "bg-gray-100 text-gray-800" },
    premium: { label: "Premium", color: "bg-yellow-100 text-yellow-800" }
  };

  const handleThemeSelect = (theme: ThemeTemplate) => {
    const config = {
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      accentColor: theme.accentColor,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      headerTextColor: theme.headerTextColor,
      borderRadius: theme.borderRadius,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize,
      fontWeight: theme.fontWeight,
      gradientEnabled: theme.gradientEnabled,
      shadowIntensity: theme.shadowIntensity,
      theme: 'light', // Keep existing theme mode
      iconStyle: currentConfig.iconStyle || 'circle',
      customCSS: currentConfig.customCSS || ''
    };
    
    onThemeChange(theme.id, config);
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Templates
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose from professionally designed themes or customize your own
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themeTemplates.map((theme) => (
            <Card
              key={theme.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedTheme === theme.id
                  ? "ring-2 ring-primary shadow-md"
                  : "hover:border-primary/50"
              )}
              onClick={() => handleThemeSelect(theme)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {theme.icon}
                    <h4 className="font-medium text-sm">{theme.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={categories[theme.category].color} variant="secondary">
                      {categories[theme.category].label}
                    </Badge>
                    {selectedTheme === theme.id && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3">
                  {theme.description}
                </p>
                
                {/* Theme Preview */}
                <div className="space-y-2">
                  <div
                    className="h-8 rounded-md flex items-center px-3"
                    style={{
                      background: theme.preview,
                      color: theme.headerTextColor
                    }}
                  >
                    <div className="text-xs font-medium">Header Preview</div>
                  </div>
                  <div 
                    className="h-6 rounded"
                    style={{ backgroundColor: theme.backgroundColor }}
                  >
                    <div className="flex gap-1 p-1">
                      <div
                        className="h-4 flex-1 rounded-sm"
                        style={{ backgroundColor: theme.secondaryColor }}
                      />
                      <div
                        className="h-4 w-8 rounded-sm"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Color Palette */}
                <div className="flex gap-2 mt-3">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.primaryColor }}
                    title="Primary"
                  />
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.accentColor }}
                    title="Accent"
                  />
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.backgroundColor }}
                    title="Background"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            <Palette className="h-4 w-4 mr-2" />
            Create Custom Theme
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernThemeSelector;
