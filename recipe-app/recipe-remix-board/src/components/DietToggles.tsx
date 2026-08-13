import { Checkbox } from "@/components/ui/checkbox";
import { DIET_ORDER, DIET_LABELS, Restrictions } from "@/types";

interface Props {
  restrictions: Restrictions;
  onChange: (next: Restrictions) => void;
}

export function DietToggles({ restrictions, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      {DIET_ORDER.map((diet) => (
        <label
          key={diet}
          htmlFor={diet}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <Checkbox
            id={diet}
            checked={restrictions[diet]}
            onCheckedChange={(checked) =>
              onChange({ ...restrictions, [diet]: checked })
            }
          />
          <span className="text-sm font-medium">{DIET_LABELS[diet]}</span>
        </label>
      ))}
    </div>
  );
}
