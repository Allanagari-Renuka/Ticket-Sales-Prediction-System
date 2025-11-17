import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";
import { PricingDisplay } from "@/components/pricing-display";

export default function AdminPredictionsPage() {
  const predictions = [];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-4xl mb-2" data-testid="text-page-title">
          ML Predictions
        </h1>
        <p className="text-muted-foreground">
          AI-powered sales forecasts and dynamic pricing recommendations
        </p>
      </div>

      {/* Model Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-accuracy">87%</div>
            <p className="text-xs text-muted-foreground">R² Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Prediction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-avg-prediction">156</div>
            <p className="text-xs text-muted-foreground">Tickets per show</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Adjustments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-adjustments">12</div>
            <p className="text-xs text-muted-foreground">Active this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Version</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-version">v2.1</div>
            <p className="text-xs text-muted-foreground">Polynomial Reg</p>
          </CardContent>
        </Card>
      </div>

      {/* Predictions List */}
      <Card>
        <CardHeader>
          <CardTitle>Show Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          {predictions.length === 0 ? (
            <div className="text-center py-12" data-testid="text-no-predictions">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No predictions available</p>
              <p className="text-sm text-muted-foreground">
                Add showtimes to generate ML predictions
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {predictions.map((pred: any) => (
                <Card key={pred.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-display font-semibold text-xl mb-1">
                            {pred.movieTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{pred.showtime}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground mb-1">Predicted Sales</div>
                            <div className="font-semibold text-lg">{pred.predictedTickets}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Confidence</div>
                            <div className="font-semibold text-lg">{pred.confidence}%</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Occupancy</div>
                            <div className="font-semibold text-lg">{pred.occupancy}%</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Current Sold</div>
                            <div className="font-semibold text-lg">{pred.currentSold}</div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Pricing</div>
                          <PricingDisplay
                            basePrice={pred.basePrice}
                            currentPrice={pred.mlRecommendedPrice}
                            source="ml"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          Override Price
                        </Button>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
