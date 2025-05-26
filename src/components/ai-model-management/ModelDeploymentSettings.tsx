import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Shield, Cpu, Gauge, Cloud } from "lucide-react";

interface ModelDeploymentSettingsProps {
  modelId: string;
  onSave: (settings: any) => void;
  onDeploy: () => void;
}

const ModelDeploymentSettings: React.FC<ModelDeploymentSettingsProps> = ({
  modelId,
  onSave,
  onDeploy,
}) => {
  const [settings, setSettings] = React.useState({
    environment: "staging",
    instanceType: "standard",
    autoscaling: true,
    minInstances: 1,
    maxInstances: 5,
    timeout: 30,
    memoryLimit: 2048,
    enableLogging: true,
    enableMonitoring: true,
    apiRateLimit: 100,
    apiAuthentication: "api_key",
  });

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Deployment Settings</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            Save Settings
          </Button>
          <Button size="sm" onClick={onDeploy}>
            <Rocket className="mr-1 h-3.5 w-3.5" />
            Deploy Model
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="infrastructure">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="infrastructure" className="text-xs">
              <Cloud className="mr-1 h-3.5 w-3.5" />
              Infrastructure
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs">
              <Gauge className="mr-1 h-3.5 w-3.5" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs">
              <Shield className="mr-1 h-3.5 w-3.5" />
              Security
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="infrastructure" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select
                    value={settings.environment}
                    onValueChange={(value) =>
                      handleChange("environment", value)
                    }
                  >
                    <SelectTrigger id="environment">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instanceType">Instance Type</Label>
                  <Select
                    value={settings.instanceType}
                    onValueChange={(value) =>
                      handleChange("instanceType", value)
                    }
                  >
                    <SelectTrigger id="instanceType">
                      <SelectValue placeholder="Select instance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">
                        Small (1 vCPU, 2GB RAM)
                      </SelectItem>
                      <SelectItem value="standard">
                        Standard (2 vCPU, 4GB RAM)
                      </SelectItem>
                      <SelectItem value="large">
                        Large (4 vCPU, 8GB RAM)
                      </SelectItem>
                      <SelectItem value="xlarge">
                        XLarge (8 vCPU, 16GB RAM)
                      </SelectItem>
                      <SelectItem value="gpu">GPU Optimized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoscaling" className="cursor-pointer">
                    Enable Autoscaling
                  </Label>
                  <Switch
                    id="autoscaling"
                    checked={settings.autoscaling}
                    onCheckedChange={(checked) =>
                      handleChange("autoscaling", checked)
                    }
                  />
                </div>
              </div>

              {settings.autoscaling && (
                <div className="grid grid-cols-2 gap-4 rounded-md bg-slate-50 p-3">
                  <div className="space-y-2">
                    <Label htmlFor="minInstances" className="text-xs">
                      Minimum Instances: {settings.minInstances}
                    </Label>
                    <Slider
                      id="minInstances"
                      min={1}
                      max={10}
                      step={1}
                      value={[settings.minInstances]}
                      onValueChange={(value) =>
                        handleChange("minInstances", value[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxInstances" className="text-xs">
                      Maximum Instances: {settings.maxInstances}
                    </Label>
                    <Slider
                      id="maxInstances"
                      min={1}
                      max={20}
                      step={1}
                      value={[settings.maxInstances]}
                      onValueChange={(value) =>
                        handleChange("maxInstances", value[0])
                      }
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={settings.timeout}
                    onChange={(e) =>
                      handleChange("timeout", parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memoryLimit">Memory Limit (MB)</Label>
                  <Select
                    value={settings.memoryLimit.toString()}
                    onValueChange={(value) =>
                      handleChange("memoryLimit", parseInt(value))
                    }
                  >
                    <SelectTrigger id="memoryLimit">
                      <SelectValue placeholder="Select memory limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024">1024 MB</SelectItem>
                      <SelectItem value="2048">2048 MB</SelectItem>
                      <SelectItem value="4096">4096 MB</SelectItem>
                      <SelectItem value="8192">8192 MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableLogging" className="cursor-pointer">
                      Enable Logging
                    </Label>
                    <Switch
                      id="enableLogging"
                      checked={settings.enableLogging}
                      onCheckedChange={(checked) =>
                        handleChange("enableLogging", checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="enableMonitoring"
                      className="cursor-pointer"
                    >
                      Enable Monitoring
                    </Label>
                    <Switch
                      id="enableMonitoring"
                      checked={settings.enableMonitoring}
                      onCheckedChange={(checked) =>
                        handleChange("enableMonitoring", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-slate-50 p-3">
                <div className="mb-2">
                  <h4 className="text-xs font-medium">Resource Allocation</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium">CPU Allocation</p>
                      <p className="text-xs text-muted-foreground">
                        {settings.instanceType === "small"
                          ? "1 vCPU"
                          : settings.instanceType === "standard"
                            ? "2 vCPU"
                            : settings.instanceType === "large"
                              ? "4 vCPU"
                              : "8 vCPU"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <path d="M6 19v-3"></path>
                      <path d="M10 19v-3"></path>
                      <path d="M14 19v-3"></path>
                      <path d="M18 19v-3"></path>
                      <path d="M8 11V9"></path>
                      <path d="M16 11V9"></path>
                      <path d="M12 11V9"></path>
                      <path d="M2 15h20"></path>
                      <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z"></path>
                    </svg>
                    <div>
                      <p className="text-xs font-medium">Memory Allocation</p>
                      <p className="text-xs text-muted-foreground">
                        {(settings.memoryLimit / 1024).toFixed(1)} GB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">API Rate Limit (req/min)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) =>
                      handleChange("apiRateLimit", parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiAuthentication">API Authentication</Label>
                  <Select
                    value={settings.apiAuthentication}
                    onValueChange={(value) =>
                      handleChange("apiAuthentication", value)
                    }
                  >
                    <SelectTrigger id="apiAuthentication">
                      <SelectValue placeholder="Select authentication method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="jwt">JWT</SelectItem>
                      <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md bg-slate-50 p-3">
                <div className="mb-2">
                  <h4 className="text-xs font-medium">
                    Security Recommendations
                  </h4>
                </div>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <Shield className="mt-0.5 h-3 w-3 text-green-500" />
                    <span>
                      <span className="font-medium">
                        Enable API authentication
                      </span>{" "}
                      - Protect your model API endpoints from unauthorized
                      access.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="mt-0.5 h-3 w-3 text-green-500" />
                    <span>
                      <span className="font-medium">
                        Set appropriate rate limits
                      </span>{" "}
                      - Prevent abuse and ensure fair usage of your model.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="mt-0.5 h-3 w-3 text-amber-500" />
                    <span>
                      <span className="font-medium">
                        Enable request logging
                      </span>{" "}
                      - Track usage patterns and detect potential security
                      issues.
                    </span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ModelDeploymentSettings;
