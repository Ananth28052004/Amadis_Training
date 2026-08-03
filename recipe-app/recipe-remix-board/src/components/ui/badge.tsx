import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "warning" | "outline" | "accent";

const variantClasses: Record<Variant, string> = {
  default: "bg-primary/10 text-primary border-primary/20",
  accent: "bg-accent/10 text-accent border-accent/25",
  warning: "bg-warning/15 text-yellow-900 border-warning/30",
  outline: "bg-muted text-muted-foreground border-border",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
