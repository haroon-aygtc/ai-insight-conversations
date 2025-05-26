
import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass" | "gradient" | "bordered";
  hover?: boolean;
  interactive?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = "default", hover = false, interactive = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-card text-card-foreground border shadow-sm",
      elevated: "bg-card text-card-foreground border-0 shadow-xl shadow-black/5",
      glass: "bg-card/50 text-card-foreground border border-white/10 backdrop-blur-xl shadow-xl",
      gradient: "bg-gradient-to-br from-card via-card to-card/95 text-card-foreground border-0 shadow-xl",
      bordered: "bg-card text-card-foreground border-2 border-primary/10 shadow-md",
    };

    const hoverEffects = hover ? "hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" : "";
    const interactiveEffects = interactive ? "cursor-pointer hover:border-primary/20" : "";

    const CardComponent = interactive ? motion.div : "div";

    const motionProps = interactive ? {
      whileHover: { y: -4, scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: "spring", stiffness: 300, damping: 20 }
    } : {};

    return (
      <CardComponent
        ref={ref}
        className={cn(
          "rounded-2xl p-6 transition-all duration-300",
          variants[variant],
          hoverEffects,
          interactiveEffects,
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </CardComponent>
    );
  }
);

const EnhancedCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 pb-6", className)}
      {...props}
    />
  )
);

const EnhancedCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text",
        className
      )}
      {...props}
    />
  )
);

const EnhancedCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
);

const EnhancedCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-0", className)} {...props} />
  )
);

const EnhancedCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-6 border-t border-border/50", className)}
      {...props}
    />
  )
);

EnhancedCard.displayName = "EnhancedCard";
EnhancedCardHeader.displayName = "EnhancedCardHeader";
EnhancedCardFooter.displayName = "EnhancedCardFooter";
EnhancedCardTitle.displayName = "EnhancedCardTitle";
EnhancedCardDescription.displayName = "EnhancedCardDescription";
EnhancedCardContent.displayName = "EnhancedCardContent";

export { 
  EnhancedCard, 
  EnhancedCardHeader, 
  EnhancedCardFooter, 
  EnhancedCardTitle, 
  EnhancedCardDescription, 
  EnhancedCardContent 
};
