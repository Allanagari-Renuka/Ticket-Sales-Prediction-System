import { useParams, Link } from "wouter";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Download, Mail, Home } from "lucide-react";

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();

  // Mock booking data - will be replaced with API data
  const booking = {
    bookingReference: "CM-2025-0001",
    movieTitle: "Sample Movie",
    screenName: "Screen 1",
    theater: "CinemaMax Downtown",
    startTime: new Date(),
    seats: [
      { row: "D", number: 5, type: "regular" },
      { row: "D", number: 6, type: "regular" },
    ],
    totalAmount: 500,
    paymentMethod: "UPI",
    paymentStatus: "paid",
    createdAt: new Date(),
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="font-display font-bold text-4xl mb-2" data-testid="text-success-title">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground" data-testid="text-success-message">
            Your tickets have been sent to your email
          </p>
        </div>

        {/* E-Ticket Card */}
        <Card className="overflow-hidden">
          <div className="bg-primary/5 border-b p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Booking Reference</div>
                <div className="font-mono font-bold text-xl" data-testid="text-booking-ref">
                  {booking.bookingReference}
                </div>
              </div>
              <Badge
                className={booking.paymentStatus === "paid" ? "bg-green-500" : ""}
                data-testid="badge-payment-status"
              >
                {booking.paymentStatus.toUpperCase()}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Movie Details */}
            <div>
              <h2 className="font-display font-semibold text-2xl mb-2" data-testid="text-movie-title">
                {booking.movieTitle}
              </h2>
              <p className="text-muted-foreground" data-testid="text-theater">
                {booking.theater}
              </p>
              <p className="text-muted-foreground" data-testid="text-screen">
                {booking.screenName}
              </p>
            </div>

            <Separator />

            {/* Show Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Date</div>
                <div className="font-semibold" data-testid="text-date">
                  {booking.startTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Time</div>
                <div className="font-semibold" data-testid="text-time">
                  {booking.startTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>

            <Separator />

            {/* Seats */}
            <div>
              <div className="text-sm text-muted-foreground mb-3">Seats</div>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map((seat, i) => (
                  <Badge key={i} variant="outline" className="text-base px-3 py-1" data-testid={`badge-seat-${i}`}>
                    {seat.row}{seat.number}
                    {seat.type === "vip" && " (VIP)"}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Payment Details */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Number of Tickets</span>
                <span data-testid="text-ticket-count">{booking.seats.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span data-testid="text-payment-method">{booking.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-lg">Total Amount Paid</span>
                <span className="font-display font-bold text-2xl text-primary" data-testid="text-total">
                  ₹{booking.totalAmount}
                </span>
              </div>
            </div>

            <Separator />

            {/* QR Code Placeholder */}
            <div className="flex justify-center py-6">
              <div className="bg-muted rounded-md p-6 text-center">
                <div className="w-48 h-48 bg-white flex items-center justify-center rounded-md mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                    className="w-40 h-40"
                  >
                    <rect width="200" height="200" fill="white" />
                    <g fill="black">
                      {/* Simple QR code pattern */}
                      <rect x="20" y="20" width="40" height="40" />
                      <rect x="140" y="20" width="40" height="40" />
                      <rect x="20" y="140" width="40" height="40" />
                      <rect x="80" y="80" width="40" height="40" />
                      <rect x="70" y="30" width="10" height="10" />
                      <rect x="90" y="50" width="10" height="10" />
                      <rect x="110" y="30" width="10" height="10" />
                      <rect x="130" y="70" width="10" height="10" />
                    </g>
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground">
                  Scan this QR code at the theater
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" data-testid="button-download">
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </Button>
              <Button variant="outline" data-testid="button-email">
                <Mail className="h-4 w-4 mr-2" />
                Email Ticket
              </Button>
            </div>

            <Link href="/">
              <Button className="w-full" size="lg" data-testid="button-home">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mt-6 bg-muted/30">
          <CardHeader>
            <h3 className="font-semibold">Important Notes</h3>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Please arrive at least 15 minutes before show time</p>
            <p>• Carry a valid ID for verification</p>
            <p>• Present this e-ticket (digital or printed) at the entrance</p>
            <p>• Food and beverages from outside are not permitted</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
