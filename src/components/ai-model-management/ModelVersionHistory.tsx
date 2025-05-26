import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDownToLine, GitCompare, RotateCcw } from "lucide-react";

interface Version {
  id: string;
  version: string;
  date: string;
  accuracy: number;
  status: "active" | "archived" | "failed";
  size: string;
  commitMessage: string;
}

interface ModelVersionHistoryProps {
  versions: Version[];
  onCompare: (versions: string[]) => void;
  onRevert: (versionId: string) => void;
  onDownload: (versionId: string) => void;
}

const ModelVersionHistory: React.FC<ModelVersionHistoryProps> = ({
  versions,
  onCompare,
  onRevert,
  onDownload,
}) => {
  const [selectedVersions, setSelectedVersions] = React.useState<string[]>([]);

  const toggleVersion = (versionId: string) => {
    setSelectedVersions((prev) =>
      prev.includes(versionId)
        ? prev.filter((id) => id !== versionId)
        : [...prev, versionId],
    );
  };

  const getStatusBadge = (status: "active" | "archived" | "failed") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Version History</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={selectedVersions.length !== 2}
            onClick={() => onCompare(selectedVersions)}
          >
            <GitCompare className="mr-1 h-3.5 w-3.5" />
            Compare
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {versions.map((version) => (
            <div
              key={version.id}
              className="flex items-center justify-between rounded-md border px-3 py-2 hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedVersions.includes(version.id)}
                  onCheckedChange={() => toggleVersion(version.id)}
                  disabled={
                    selectedVersions.length >= 2 &&
                    !selectedVersions.includes(version.id)
                  }
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{version.version}</h4>
                    {getStatusBadge(version.status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{version.date}</span>
                    <span>•</span>
                    <span>{version.accuracy}% accuracy</span>
                    <span>•</span>
                    <span>{version.size}</span>
                  </div>
                  <p className="mt-1 text-xs">{version.commitMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onDownload(version.id)}
                >
                  <ArrowDownToLine className="h-3.5 w-3.5" />
                </Button>
                {version.status !== "active" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onRevert(version.id)}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelVersionHistory;
