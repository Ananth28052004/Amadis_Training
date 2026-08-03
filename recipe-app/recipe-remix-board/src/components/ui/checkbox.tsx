import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
}

// A simple, controlled checkbox. "Controlled" means the checked state
// always comes from a prop (checked) and changes are reported up via
// onCheckedChange - the parent component owns the actual state.
export function Checkbox({ checked, onCheckedChange, id, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      id={id}
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "h-5 w-5 shrink-0 rounded border border-border flex items-center justify-center transition-colors",
        checked ? "bg-primary border-primary text-white" : "bg-white",
        className
      )}
    >
      {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
    </button>
  );
}
