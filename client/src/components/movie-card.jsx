import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock } from "lucide-react";
import { Link } from "wouter";

export function MovieCard({ movie }) {
  const genres = typeof movie.genre === 'string' ? JSON.parse(movie.genre) : movie.genre;
  const genreArray = Array.isArray(genres) ? genres : [genres];

  return (
    <Link href={`/movie/${movie.id}`} data-testid={`link-movie-${movie.id}`}>
      <Card className="overflow-hidden hover-elevate transition-all duration-200 cursor-pointer group h-full flex flex-col">
        <div className="aspect-[2/3] relative overflow-hidden bg-muted">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
              data-testid={`img-poster-${movie.id}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">No poster</span>
            </div>
          )}
          {movie.rating && (
            <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-semibold" data-testid={`text-rating-${movie.id}`}>
                {movie.rating}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2" data-testid={`text-title-${movie.id}`}>
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-3">
            {genreArray.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs" data-testid={`badge-genre-${movie.id}`}>
                {genre}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span data-testid={`text-duration-${movie.id}`}>{movie.duration} min</span>
            </div>
            <Badge variant="outline" className="text-xs" data-testid={`badge-language-${movie.id}`}>
              {movie.language}
            </Badge>
          </div>

          <div className="mt-auto">
            <Button className="w-full" size="sm" data-testid={`button-book-${movie.id}`}>
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
