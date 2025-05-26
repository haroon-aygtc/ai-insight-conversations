
import React from "react";
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardDescription, EnhancedCardContent } from "@/components/ui/enhanced-card";

const Widgets = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Widgets</h1>
        <p className="text-muted-foreground">
          Manage and configure your chat widgets
        </p>
      </div>

      <EnhancedCard>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Widget Management</EnhancedCardTitle>
          <EnhancedCardDescription>
            Create, edit, and deploy chat widgets across your applications
          </EnhancedCardDescription>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <p className="text-sm text-muted-foreground">
            Widget management interface coming soon...
          </p>
        </EnhancedCardContent>
      </EnhancedCard>
    </div>
  );
};

export default Widgets;
