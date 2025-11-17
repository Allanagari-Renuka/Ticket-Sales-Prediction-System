import { useParams, Link } from "wouter";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, Star, Users } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import type { Movie, Showtime } from "@shared/schema";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: movie, isLoading: isLoadingMovie } = useQuery<Movie>({
    queryKey: ["/api/movies", id],
    enabled: !!id,
  });

  const { data: showtimes = [], isLoading: isLoadingShowtimes } = useQuery<Showtime[]>({
    queryKey: [`/api/showtimes/movie/${id}`],
    enabled: !!id,
  });

  const isLoading = isLoadingMovie || isLoadingShowtimes;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <Skeleton className="w-full h-[60vh]" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96" />
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4" data-testid="text-not-found">Movie Not Found</h1>
          <p className="text-muted-foreground mb-8">The movie you're looking for doesn't exist.</p>
          <Link href="/">
            <Button data-testid="button-back-home">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Backdrop */}
      <div className="relative h-[60vh] overflow-hidden">
        {movie.backdropUrl ? (
          <>
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              data-testid="img-backdrop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Poster */}
          <div className="flex justify-center lg:justify-start">
            <Card className="overflow-hidden w-full max-w-sm">
              <div className="aspect-[2/3] relative">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    data-testid="img-poster"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No poster</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-4" data-testid="text-title">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {movie.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="text-xl font-semibold" data-testid="text-rating">{movie.rating}</span>
                  </div>
                )}
                <Badge variant="secondary" data-testid="badge-language">{movie.language}</Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span data-testid="text-duration">{movie.duration} min</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {JSON.parse(movie.genre || '[]').map((genre: string) => (
                  <Badge key={genre} data-testid={`badge-genre-${genre}`}>{genre}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display font-semibold text-xl mb-3">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-synopsis">
                {movie.synopsis}
              </p>
            </div>

            {movie.cast && (
              <div>
                <h2 className="font-display font-semibold text-xl mb-3">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(movie.cast).map((actor: string, i: number) => (
                    <Badge key={i} variant="outline" data-testid={`badge-cast-${i}`}>
                      <Users className="h-3 w-3 mr-1" />
                      {actor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Showtimes */}
        <div className="pb-16">
          <h2 className="font-display font-semibold text-3xl mb-6" data-testid="text-showtimes">
            Showtimes
          </h2>

          {showtimes.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4" data-testid="text-no-showtimes">
                No showtimes available for this movie yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Check back soon or browse other movies.
              </p>
            </Card>
          ) : (
            <Tabs defaultValue="today">
              <TabsList>
                <TabsTrigger value="today" data-testid="tab-today">Today</TabsTrigger>
                <TabsTrigger value="tomorrow" data-testid="tab-tomorrow">Tomorrow</TabsTrigger>
                <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming</TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="mt-6">
                <div className="grid gap-4">
                  {showtimes.map((showtime: any) => (
                    <Card key={showtime.id} className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span data-testid={`text-showtime-${showtime.id}`}>
                              {format(new Date(showtime.startTime), "PPP p")}
                            </span>
                          </div>
                          <div className="font-semibold">Screen {showtime.screenName}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-display font-bold" data-testid={`text-price-${showtime.id}`}>
                              ₹{showtime.currentPrice}
                            </div>
                            {showtime.pricingSource === 'ml' && (
                              <Badge variant="secondary" className="mt-1">AI-Optimized</Badge>
                            )}
                          </div>
                          <Link href={`/showtime/${showtime.id}/seats`}>
                            <Button data-testid={`button-select-seats-${showtime.id}`}>
                              Select Seats
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tomorrow" className="mt-6">
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No showtimes available for tomorrow.</p>
                </Card>
              </TabsContent>

              <TabsContent value="upcoming" className="mt-6">
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No upcoming showtimes scheduled.</p>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
