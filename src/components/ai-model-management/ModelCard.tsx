import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Cpu, BarChart2, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

type ModelStatus = "active" | "training" | "error" | "draft";

interface ModelCardProps {
  id: string;
  name: string;
  description: string;
  status: ModelStatus;
  type: string;
  version: string;
  lastUpdated: string;
  accuracy?: number;
  trainingProgress?: number;
  onSelect: (id: string) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({
  id,
  name,
  description,
  status,
  type,
  version,
  lastUpdated,
  accuracy,
  trainingProgress,
  onSelect,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "training":
        return <Badge className="bg-blue-500">Training</Badge>;
      case "error":
        return <Badge className="bg-red-500">Error</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "training":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "draft":
        return <Cpu className="h-5 w-5 text-slate-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <h3 className="font-medium">{name}</h3>
          </div>
          {getStatusBadge()}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Type:</span>
            <p className="font-medium">{type}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Version:</span>
            <p className="font-medium">{version}</p>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Last Updated:</span>
            <p className="font-medium">{lastUpdated}</p>
          </div>
        </div>

        {status === "training" && trainingProgress !== undefined && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Training Progress</span>
              <span className="font-medium">{trainingProgress}%</span>
            </div>
            <Progress value={trainingProgress} className="h-1.5" />
          </div>
        )}

        {status === "active" && accuracy !== undefined && (
          <div className="mt-3 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">Accuracy:</span>
              <span className="font-medium">{accuracy}%</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onSelect(id)}
        >
          Manage Model
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModelCard;
