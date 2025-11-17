import { PublicHeader } from "@/components/public-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Link } from "wouter";
import emptyStateImage from "@assets/generated_images/Empty_bookings_illustration_9eeabcec.png";

export default function BookingsPage() {
  const isLoading = false;
  const bookings = [];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl mb-2" data-testid="text-page-title">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            View and manage your movie ticket bookings
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-24 h-32 rounded-md" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <img
                src={emptyStateImage}
                alt="No bookings"
                className="w-64 h-64 mx-auto mb-6 opacity-50"
              />
              <h2 className="font-display font-semibold text-2xl mb-3" data-testid="text-no-bookings">
                No Bookings Yet
              </h2>
              <p className="text-muted-foreground mb-6">
                You haven't booked any movie tickets yet. Start exploring our collection!
              </p>
              <Link href="/">
                <Button size="lg" data-testid="button-browse">
                  Browse Movies
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <Card key={booking.id} className="overflow-hidden hover-elevate transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Movie Poster */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-32 bg-muted rounded-md overflow-hidden">
                        {booking.posterUrl ? (
                          <img
                            src={booking.posterUrl}
                            alt={booking.movieTitle}
                            className="w-full h-full object-cover"
                            data-testid={`img-poster-${booking.id}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Ticket className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-display font-semibold text-xl" data-testid={`text-title-${booking.id}`}>
                            {booking.movieTitle}
                          </h3>
                          <Badge
                            variant={booking.paymentStatus === "paid" ? "default" : "secondary"}
                            data-testid={`badge-status-${booking.id}`}
                          >
                            {booking.paymentStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono" data-testid={`text-ref-${booking.id}`}>
                          Booking Ref: {booking.bookingReference}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span data-testid={`text-date-${booking.id}`}>
                            {new Date(booking.startTime).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span data-testid={`text-location-${booking.id}`}>
                            {booking.theater} - {booking.screenName}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-muted-foreground">Seats:</span>
                        {booking.seats.map((seat: any, i: number) => (
                          <Badge key={i} variant="outline" data-testid={`badge-seat-${booking.id}-${i}`}>
                            {seat.row}{seat.number}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-sm text-muted-foreground mr-2">Total:</span>
                          <span className="font-display font-bold text-xl" data-testid={`text-total-${booking.id}`}>
                            ₹{booking.totalAmount}
                          </span>
                        </div>
                        <Link href={`/booking/confirmation/${booking.id}`}>
                          <Button variant="outline" size="sm" data-testid={`button-view-${booking.id}`}>
                            View Ticket
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
