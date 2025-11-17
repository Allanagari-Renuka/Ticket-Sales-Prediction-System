import { cn } from "@/lib/utils";

interface SeatButtonProps {
  row: string;
  number: number;
  status: "available" | "selected" | "booked";
  type?: "regular" | "vip";
  onClick?: () => void;
}

export function SeatButton({ row, number, status, type = "regular", onClick }: SeatButtonProps) {
  const isDisabled = status === "booked";

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      aria-label={`Row ${row} Seat ${number}`}
      data-testid={`button-seat-${row}${number}`}
      className={cn(
        "w-8 h-8 md:w-10 md:h-10 rounded-md text-xs font-medium transition-all duration-150",
        "border-2 flex items-center justify-center",
        status === "available" && "border-muted-foreground/30 hover-elevate active-elevate-2 text-foreground",
        status === "selected" && "bg-primary border-primary text-primary-foreground",
        status === "booked" && "bg-muted border-muted text-muted-foreground opacity-40 cursor-not-allowed",
        type === "vip" && status === "available" && "border-yellow-500/50"
      )}
    >
      {number}
    </button>
  );
}
