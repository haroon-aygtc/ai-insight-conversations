import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CornerRightDown,
  CornerLeftDown,
  CornerLeftUp,
  CornerRightUp,
} from "lucide-react";

type Position = "bottom-right" | "bottom-left" | "top-left" | "top-right";

interface WidgetPositionSelectorProps {
  selectedPosition: Position;
  onPositionChange: (position: Position) => void;
}

const WidgetPositionSelector: React.FC<WidgetPositionSelectorProps> = ({
  selectedPosition,
  onPositionChange,
}) => {
  const positions: { value: Position; icon: React.ReactNode; label: string }[] =
    [
      {
        value: "bottom-right",
        icon: <CornerRightDown className="h-4 w-4" />,
        label: "Bottom Right",
      },
      {
        value: "bottom-left",
        icon: <CornerLeftDown className="h-4 w-4" />,
        label: "Bottom Left",
      },
      {
        value: "top-left",
        icon: <CornerLeftUp className="h-4 w-4" />,
        label: "Top Left",
      },
      {
        value: "top-right",
        icon: <CornerRightUp className="h-4 w-4" />,
        label: "Top Right",
      },
    ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Widget Position</h3>
      <div className="grid grid-cols-2 gap-2">
        {positions.map((position) => (
          <Button
            key={position.value}
            variant={
              selectedPosition === position.value ? "default" : "outline"
            }
            className={cn(
              "flex items-center justify-center gap-2 h-10",
              selectedPosition === position.value ? "" : "border-dashed",
            )}
            onClick={() => onPositionChange(position.value)}
          >
            {position.icon}
            <span className="text-xs">{position.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WidgetPositionSelector;
