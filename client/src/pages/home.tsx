import { PublicHeader } from "@/components/public-header";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TrendingUp } from "lucide-react";
import heroImage from "@assets/generated_images/Cinema_theater_hero_background_85d63350.png";
import { useQuery } from "@tanstack/react-query";
import type { Movie } from "@shared/schema";

export default function HomePage() {
  const { data: featuredMovies = [], isLoading } = useQuery<Movie[]>({
    queryKey: ["/api/movies/featured"],
  });

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Cinema"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
          <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 text-foreground" data-testid="text-hero-title">
            Experience Cinema
            <br />
            <span className="text-primary">Like Never Before</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 mb-8 max-w-2xl">
            Book your tickets with AI-powered dynamic pricing for the best deals
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <Input
                type="search"
                placeholder="Search for movies, theaters..."
                className="pl-12 h-14 text-lg bg-background/95 backdrop-blur-sm border-2"
                data-testid="input-hero-search"
              />
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2"
                data-testid="button-search"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display font-semibold text-3xl md:text-4xl" data-testid="text-now-showing">
              Now Showing
            </h2>
            <Button variant="ghost" data-testid="button-view-all">
              View All
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-md" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredMovies.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4" data-testid="text-no-movies">
                No movies available at the moment
              </p>
              <p className="text-sm text-muted-foreground">
                Check back soon for new releases!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ML Predictions Highlight */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Insights</span>
            </div>
            <h2 className="font-display font-semibold text-3xl md:text-4xl mb-4" data-testid="text-trending">
              Trending Shows
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our ML predictions identify the hottest shows and optimize pricing for the best value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <>
                <Skeleton className="h-48 rounded-md" />
                <Skeleton className="h-48 rounded-md" />
              </>
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground" data-testid="text-no-predictions">
                  Predictions will appear here once shows are added
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">CinemaMax</h3>
              <p className="text-sm text-muted-foreground">
                Experience the future of movie booking with AI-powered dynamic pricing
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/" className="hover:text-foreground transition-colors">Movies</a></li>
                <li><a href="/bookings" className="hover:text-foreground transition-colors">My Bookings</a></li>
                <li><a href="/admin" className="hover:text-foreground transition-colors">Admin</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@cinemamax.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CinemaMax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
