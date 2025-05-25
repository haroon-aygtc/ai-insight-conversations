import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface TestEnvironmentSelectorProps {
  environment: string;
  onEnvironmentChange: (env: string) => void;
}

export const TestEnvironmentSelector = ({
  environment,
  onEnvironmentChange,
}: TestEnvironmentSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Environment</CardTitle>
        <CardDescription>Select where to test your widget</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={environment}
          onValueChange={onEnvironmentChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50">
            <RadioGroupItem value="development" id="env-dev" />
            <div className="flex-1">
              <div className="flex items-center">
                <Label htmlFor="env-dev" className="font-medium">
                  Development
                </Label>
                <Badge className="ml-2 bg-blue-500">Local</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Test on your local development server
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50">
            <RadioGroupItem value="staging" id="env-staging" />
            <div className="flex-1">
              <div className="flex items-center">
                <Label htmlFor="env-staging" className="font-medium">
                  Staging
                </Label>
                <Badge className="ml-2 bg-amber-500">Test</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Test on the staging environment
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Requires staging credentials</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50">
            <RadioGroupItem value="production" id="env-prod" />
            <div className="flex-1">
              <div className="flex items-center">
                <Label htmlFor="env-prod" className="font-medium">
                  Production
                </Label>
                <Badge className="ml-2 bg-red-500">Live</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Test on the production environment
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Use with caution - affects live users
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
