import { Link, useLocation } from "wouter";
import { Film, Search, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export function PublicHeader() {
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <a className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2 -ml-3">
              <Film className="h-6 w-6 text-primary" />
              <span className="font-display font-bold text-xl">CinemaMax</span>
            </a>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movies..."
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/" data-testid="link-movies">
              <a className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate ${
                location === "/" ? "bg-accent" : ""
              }`}>
                Movies
              </a>
            </Link>
            <Link href="/bookings" data-testid="link-bookings">
              <a className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate ${
                location === "/bookings" ? "bg-accent" : ""
              }`}>
                My Bookings
              </a>
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">Hi, {user?.username}</span>
                {user?.role === 'admin' && (
                  <Link href="/admin" data-testid="link-admin">
                    <Button size="sm" variant="outline">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout} data-testid="button-logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" data-testid="link-login">
                <Button size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-menu-toggle"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            <div className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search movies..."
                  className="pl-10"
                  data-testid="input-search-mobile"
                />
              </div>
            </div>
            <Link href="/" data-testid="link-movies-mobile">
              <a className="block px-3 py-2 rounded-md text-sm font-medium hover-elevate">
                Movies
              </a>
            </Link>
            <Link href="/bookings" data-testid="link-bookings-mobile">
              <a className="block px-3 py-2 rounded-md text-sm font-medium hover-elevate">
                My Bookings
              </a>
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <div className="text-sm text-muted-foreground px-3">Hi, {user?.username}</div>
                  {user?.role === 'admin' && (
                    <Link href="/admin" data-testid="link-admin-mobile">
                      <Button className="w-full" size="sm" variant="outline">
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full" size="sm" onClick={logout} data-testid="button-logout-mobile">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login" data-testid="link-login-mobile">
                  <Button className="w-full" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
