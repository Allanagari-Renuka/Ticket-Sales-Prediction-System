import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function PricingDisplay({ basePrice, currentPrice, source, showDetails = false }) {
  const hasDiscount = currentPrice < basePrice;
  const discountPercent = hasDiscount ? Math.round(((basePrice - currentPrice) / basePrice) * 100) : 0;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-baseline gap-2">
        {hasDiscount && (
          <span className="text-lg text-muted-foreground line-through" data-testid="text-base-price">
            ₹{basePrice}
          </span>
        )}
        <span className="text-2xl md:text-3xl font-display font-bold" data-testid="text-current-price">
          ₹{currentPrice}
        </span>
      </div>

      {source === "ml" && (
        <Badge variant="secondary" className="gap-1" data-testid="badge-ml-pricing">
          <Sparkles className="h-3 w-3" />
          AI-Optimized
        </Badge>
      )}

      {hasDiscount && (
        <Badge variant="default" data-testid="badge-discount">
          {discountPercent}% OFF
        </Badge>
      )}

      {source === "override" && (
        <Badge variant="outline" data-testid="badge-override">
          Special Price
        </Badge>
      )}

      {showDetails && (
        <div className="text-xs text-muted-foreground">
          {source === "ml" && "Price optimized by ML predictions"}
          {source === "override" && "Admin special pricing"}
          {source === "base" && "Standard pricing"}
        </div>
      )}
    </div>
  );
}
