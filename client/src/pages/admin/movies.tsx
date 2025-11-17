import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Movie } from "@shared/schema";

export default function AdminMoviesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: movies = [] } = useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-4xl mb-2" data-testid="text-page-title">
            Movies
          </h1>
          <p className="text-muted-foreground">
            Manage your movie catalog
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-movie">
              <Plus className="h-4 w-4 mr-2" />
              Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
              <DialogDescription>
                Enter the details of the movie you want to add
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" required data-testid="input-title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language *</Label>
                  <Input id="language" required data-testid="input-language" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="synopsis">Synopsis *</Label>
                <Textarea
                  id="synopsis"
                  rows={4}
                  required
                  data-testid="input-synopsis"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre *</Label>
                  <Input id="genre" placeholder="Action, Drama" required data-testid="input-genre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min) *</Label>
                  <Input id="duration" type="number" required data-testid="input-duration" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input id="rating" type="number" step="0.1" max="5" data-testid="input-rating" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cast">Cast (comma-separated)</Label>
                <Input id="cast" placeholder="Actor 1, Actor 2" data-testid="input-cast" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="poster">Poster URL</Label>
                  <Input id="poster" type="url" data-testid="input-poster" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backdrop">Backdrop URL</Label>
                  <Input id="backdrop" type="url" data-testid="input-backdrop" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-save-movie">
                  Add Movie
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </CardContent>
      </Card>

      {/* Movies Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Movies ({movies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {movies.length === 0 ? (
            <div className="text-center py-12" data-testid="text-no-movies">
              <p className="text-muted-foreground mb-4">No movies added yet</p>
              <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Movie
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movies.map((movie: any) => (
                  <TableRow key={movie.id}>
                    <TableCell className="font-medium">{movie.title}</TableCell>
                    <TableCell>{movie.language}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {JSON.parse(movie.genre).slice(0, 2).map((g: string) => (
                          <Badge key={g} variant="secondary">{g}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{movie.duration} min</TableCell>
                    <TableCell>{movie.rating || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
