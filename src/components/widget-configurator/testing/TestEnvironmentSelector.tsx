
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, Shield, Zap } from 'lucide-react';

interface TestEnvironmentSelectorProps {
  environment: string;
  onEnvironmentChange: (environment: string) => void;
}

export const TestEnvironmentSelector: React.FC<TestEnvironmentSelectorProps> = ({
  environment,
  onEnvironmentChange
}) => {
  const environments = [
    {
      id: 'development',
      name: 'Development',
      description: 'Local testing with debug mode',
      icon: Zap,
      color: 'bg-yellow-500'
    },
    {
      id: 'staging',
      name: 'Staging',
      description: 'Pre-production testing environment',
      icon: Shield,
      color: 'bg-blue-500'
    },
    {
      id: 'production',
      name: 'Production',
      description: 'Live production environment',
      icon: Globe,
      color: 'bg-green-500'
    }
  ];

  const selectedEnv = environments.find(env => env.id === environment);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium mb-2 block">Test Environment</Label>
            <div className="flex items-center gap-3">
              <Select value={environment} onValueChange={onEnvironmentChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {environments.map((env) => (
                    <SelectItem key={env.id} value={env.id}>
                      <div className="flex items-center gap-2">
                        <env.icon size={16} />
                        {env.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedEnv && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${selectedEnv.color}`} />
                  {selectedEnv.name}
                </Badge>
              )}
            </div>
          </div>
          {selectedEnv && (
            <div className="text-right">
              <p className="text-sm text-slate-600">{selectedEnv.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
