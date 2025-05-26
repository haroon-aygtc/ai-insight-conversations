
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

type IconName = keyof typeof Icons;

interface WidgetIconSelectorProps {
  selectedIcon: string;
  onIconChange: (icon: string) => void;
}

const popularIcons: IconName[] = [
  "MessageCircle",
  "MessageSquare",
  "MessagesSquare",
  "Speech",
  "HelpCircle",
  "Bot",
  "BrainCircuit",
  "Sparkles",
  "Zap",
  "Lightbulb",
  "Headphones",
  "LifeBuoy",
  "Heart",
  "ThumbsUp",
  "Rocket",
  "Star",
];

const WidgetIconSelector: React.FC<WidgetIconSelectorProps> = ({
  selectedIcon,
  onIconChange,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Widget Icon</h3>
      <div className="grid grid-cols-4 gap-2">
        {popularIcons.map((iconName) => {
          const IconComponent = Icons[iconName] as React.ComponentType<{ className?: string }>;
          
          if (!IconComponent) return null;
          
          return (
            <div
              key={iconName}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md border cursor-pointer transition-all hover:border-primary",
                selectedIcon === iconName
                  ? "border-primary bg-primary/5"
                  : "border-border",
              )}
              onClick={() => onIconChange(iconName)}
            >
              <div className="relative">
                <IconComponent className="h-6 w-6" />
                {selectedIcon === iconName && (
                  <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                    <Check className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>
              <span className="text-[10px] mt-1 text-center text-muted-foreground">
                {iconName.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WidgetIconSelector;
