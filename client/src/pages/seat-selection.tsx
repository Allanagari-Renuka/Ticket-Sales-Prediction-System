import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { PublicHeader } from "@/components/public-header";
import { SeatButton } from "@/components/seat-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock } from "lucide-react";

interface Seat {
  row: string;
  number: number;
  type: "regular" | "vip";
  status: "available" | "selected" | "booked";
}

export default function SeatSelectionPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds

  // Mock data - will be replaced with API data
  const showtime = {
    movieTitle: "Loading...",
    startTime: new Date(),
    screenName: "Screen 1",
    currentPrice: 250,
  };

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;

  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        // Mock some booked seats
        const isBooked = Math.random() > 0.85;
        seats.push({
          row,
          number: i,
          type: row <= "B" ? "vip" : "regular",
          status: isBooked ? "booked" : "available",
        });
      }
    });
    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats());

  const toggleSeat = (row: string, number: number) => {
    const seat = seats.find((s) => s.row === row && s.number === number);
    if (!seat || seat.status === "booked") return;

    const isSelected = selectedSeats.some((s) => s.row === row && s.number === number);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => !(s.row === row && s.number === number)));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatStatus = (row: string, number: number): "available" | "selected" | "booked" => {
    const seat = seats.find((s) => s.row === row && s.number === number);
    if (!seat) return "available";
    if (seat.status === "booked") return "booked";
    return selectedSeats.some((s) => s.row === row && s.number === number) ? "selected" : "available";
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => {
    return sum + (seat.type === "vip" ? showtime.currentPrice * 1.5 : showtime.currentPrice);
  }, 0);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Movie
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2" data-testid="text-movie-title">
            {showtime.movieTitle}
          </h1>
          <p className="text-muted-foreground" data-testid="text-showtime-info">
            {showtime.screenName} • {showtime.startTime.toLocaleDateString()} {showtime.startTime.toLocaleTimeString()}
          </p>
        </div>

        {/* Timer */}
        <Card className="mb-8 border-primary bg-primary/5">
          <CardContent className="flex items-center justify-center gap-2 py-4">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-semibold" data-testid="text-timer">
              Time remaining: {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Screen */}
              <div className="mb-12">
                <div className="relative w-full max-w-2xl mx-auto">
                  <div
                    className="h-3 bg-gradient-to-b from-muted to-muted/50 rounded-t-full"
                    style={{ clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)" }}
                  />
                  <div className="text-center mt-2 text-xs text-muted-foreground font-medium">
                    SCREEN
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md border-2 border-muted-foreground/30" />
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary border-2 border-primary" />
                  <span className="text-sm">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-muted border-2 border-muted opacity-40" />
                  <span className="text-sm">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md border-2 border-yellow-500/50" />
                  <span className="text-sm">VIP</span>
                </div>
              </div>

              {/* Seats Grid */}
              <div className="space-y-3 max-w-2xl mx-auto">
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-2 justify-center">
                    <div className="w-8 text-center font-medium text-muted-foreground text-sm">
                      {row}
                    </div>
                    <div className="flex gap-1 md:gap-2">
                      {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((number) => {
                        const seat = seats.find((s) => s.row === row && s.number === number);
                        return (
                          <SeatButton
                            key={`${row}${number}`}
                            row={row}
                            number={number}
                            status={getSeatStatus(row, number)}
                            type={seat?.type}
                            onClick={() => toggleSeat(row, number)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedSeats.length === 0 ? (
                  <p className="text-muted-foreground text-sm" data-testid="text-no-seats">
                    Select seats to continue
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Selected Seats</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((seat) => (
                          <Badge key={`${seat.row}${seat.number}`} data-testid={`badge-seat-${seat.row}${seat.number}`}>
                            {seat.row}{seat.number}
                            {seat.type === "vip" && " (VIP)"}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Regular Seats ({selectedSeats.filter(s => s.type === 'regular').length})</span>
                        <span data-testid="text-regular-price">
                          ₹{selectedSeats.filter(s => s.type === 'regular').length * showtime.currentPrice}
                        </span>
                      </div>
                      {selectedSeats.some(s => s.type === 'vip') && (
                        <div className="flex justify-between">
                          <span>VIP Seats ({selectedSeats.filter(s => s.type === 'vip').length})</span>
                          <span data-testid="text-vip-price">
                            ₹{selectedSeats.filter(s => s.type === 'vip').length * showtime.currentPrice * 1.5}
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-display font-bold text-2xl" data-testid="text-total">
                        ₹{totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setLocation(`/showtime/${id}/checkout`)}
                      data-testid="button-proceed"
                    >
                      Proceed to Payment
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
