import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Type, Layout, Sparkles } from "lucide-react";
import AvatarUpload from "./AvatarUpload";
import ModernThemeSelector from "./ModernThemeSelector";

interface WidgetAppearanceTabProps {
  config: any;
  onChange: (key: string, value: any) => void;
}

export const WidgetAppearanceTab: React.FC<WidgetAppearanceTabProps> = ({
  config,
  onChange,
}) => {
  const handleThemeChange = (themeId: string, themeConfig: any) => {
    // Apply all theme configuration at once
    Object.keys(themeConfig).forEach((key) => {
      onChange(key, themeConfig[key]);
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-50 p-1 rounded-lg">
          <TabsTrigger
            value="themes"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Themes</span>
          </TabsTrigger>
          <TabsTrigger
            value="colors"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Colors</span>
          </TabsTrigger>
          <TabsTrigger
            value="typography"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Typography</span>
          </TabsTrigger>
          <TabsTrigger
            value="layout"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Layout</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6">
          <ModernThemeSelector
            selectedTheme={config.selectedTheme || ""}
            onThemeChange={handleThemeChange}
            currentConfig={config}
          />
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Color Scheme
              </CardTitle>
              <CardDescription>
                Customize the colors of your widget to match your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => onChange("primaryColor", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => onChange("primaryColor", e.target.value)}
                      placeholder="#6366f1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) =>
                        onChange("secondaryColor", e.target.value)
                      }
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.secondaryColor}
                      onChange={(e) =>
                        onChange("secondaryColor", e.target.value)
                      }
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={config.textColor}
                      onChange={(e) => onChange("textColor", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.textColor}
                      onChange={(e) => onChange("textColor", e.target.value)}
                      placeholder="#333333"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headerTextColor">Header Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="headerTextColor"
                      type="color"
                      value={config.headerTextColor}
                      onChange={(e) =>
                        onChange("headerTextColor", e.target.value)
                      }
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.headerTextColor}
                      onChange={(e) =>
                        onChange("headerTextColor", e.target.value)
                      }
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="gradientEnabled">
                    Enable Gradient Effects
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Add gradient backgrounds to headers and buttons
                  </p>
                </div>
                <Switch
                  id="gradientEnabled"
                  checked={config.gradientEnabled}
                  onCheckedChange={(checked) =>
                    onChange("gradientEnabled", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Typography</CardTitle>
              <CardDescription>
                Configure fonts and text styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select
                    value={config.fontFamily}
                    onValueChange={(value) => onChange("fontFamily", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="playfair">Playfair Display</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select
                    value={config.fontSize}
                    onValueChange={(value) => onChange("fontSize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontWeight">Font Weight</Label>
                  <Select
                    value={config.fontWeight}
                    onValueChange={(value) => onChange("fontWeight", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weight" />
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
            </CardContent>
          </Card>

          <AvatarUpload
            value={config.avatarUrl || ""}
            onChange={(url) => onChange("avatarUrl", url)}
            label="Bot Avatar/Logo"
          />
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Layout & Effects</CardTitle>
              <CardDescription>
                Customize the visual layout and effects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="borderRadius">
                  Border Radius: {config.borderRadius}px
                </Label>
                <Slider
                  id="borderRadius"
                  min={0}
                  max={24}
                  step={1}
                  value={[config.borderRadius]}
                  onValueChange={(value) => onChange("borderRadius", value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="chatIconSize">
                  Chat Icon Size: {config.chatIconSize}px
                </Label>
                <Slider
                  id="chatIconSize"
                  min={32}
                  max={80}
                  step={4}
                  value={[config.chatIconSize]}
                  onValueChange={(value) => onChange("chatIconSize", value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="shadowIntensity">
                  Shadow Intensity: {config.shadowIntensity || 2}
                </Label>
                <Slider
                  id="shadowIntensity"
                  min={0}
                  max={5}
                  step={1}
                  value={[config.shadowIntensity || 2]}
                  onValueChange={(value) =>
                    onChange("shadowIntensity", value[0])
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme Mode</Label>
                <Select
                  value={config.theme}
                  onValueChange={(value) => onChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="iconStyle">Icon Style</Label>
                <Select
                  value={config.iconStyle}
                  onValueChange={(value) => onChange("iconStyle", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="rounded">Rounded Square</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom CSS</CardTitle>
              <CardDescription>
                Add custom CSS for advanced styling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="/* Enter custom CSS here */
.widget-header {
  /* Custom styles */
}"
                value={config.customCSS}
                onChange={(e) => onChange("customCSS", e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
