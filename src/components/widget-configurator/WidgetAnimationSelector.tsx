import React from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type AnimationType = "fade" | "slide" | "bounce" | "scale" | "none";

interface WidgetAnimationSelectorProps {
  selectedAnimation: AnimationType;
  onAnimationChange: (animation: AnimationType) => void;
}

const animations: {
  type: AnimationType;
  label: string;
  description: string;
}[] = [
  {
    type: "fade",
    label: "Fade In",
    description: "Smoothly transitions from transparent to visible",
  },
  {
    type: "slide",
    label: "Slide Up",
    description: "Slides into view from below",
  },
  {
    type: "bounce",
    label: "Bounce",
    description: "Bounces into place with a playful effect",
  },
  {
    type: "scale",
    label: "Scale",
    description: "Grows from small to full size",
  },
  {
    type: "none",
    label: "None",
    description: "Appears instantly without animation",
  },
];

const WidgetAnimationSelector: React.FC<WidgetAnimationSelectorProps> = ({
  selectedAnimation,
  onAnimationChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Entrance Animation</h3>
      </div>

      <div className="space-y-2">
        {animations.map((animation) => (
          <div
            key={animation.type}
            className={cn(
              "flex items-center justify-between rounded-md border p-3 cursor-pointer transition-all hover:border-primary",
              selectedAnimation === animation.type
                ? "border-primary bg-primary/5"
                : "border-border",
            )}
            onClick={() => onAnimationChange(animation.type)}
          >
            <div className="space-y-1">
              <div className="font-medium text-sm">{animation.label}</div>
              <div className="text-xs text-muted-foreground">
                {animation.description}
              </div>
            </div>
            {selectedAnimation === animation.type && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WidgetAnimationSelector;
