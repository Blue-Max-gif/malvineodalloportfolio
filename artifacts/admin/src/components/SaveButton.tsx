import { Button } from "@/components/ui/button";
import { Check, Loader2, Save } from "lucide-react";

interface SaveButtonProps {
  onClick: () => void;
  isPending?: boolean;
  isSaved?: boolean;
  label?: string;
  className?: string;
}

export function SaveButton({
  onClick,
  isPending = false,
  isSaved = false,
  label = "Save Changes",
  className,
}: SaveButtonProps) {
  if (isPending) {
    return (
      <Button disabled className={className}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Saving...
      </Button>
    );
  }

  if (isSaved) {
    return (
      <Button variant="outline" className={`text-green-600 border-green-300 bg-green-50 hover:bg-green-50 hover:text-green-600 ${className ?? ""}`} onClick={onClick}>
        <Check className="mr-2 h-4 w-4" />
        Saved
      </Button>
    );
  }

  return (
    <Button onClick={onClick} className={className}>
      <Save className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
