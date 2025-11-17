import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";

// Pages
import HomePage from "@/pages/home";
import MovieDetailPage from "@/pages/movie-detail";
import SeatSelectionPage from "@/pages/seat-selection";
import CheckoutPage from "@/pages/checkout";
import BookingConfirmationPage from "@/pages/booking-confirmation";
import BookingsPage from "@/pages/bookings";
import AuthPage from "@/pages/auth";
import AdminLayout from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/movie/:id" component={MovieDetailPage} />
      <Route path="/showtime/:id/seats" component={SeatSelectionPage} />
      <Route path="/showtime/:id/checkout" component={CheckoutPage} />
      <Route path="/booking/confirmation/:id" component={BookingConfirmationPage} />
      <Route path="/bookings" component={BookingsPage} />
      <Route path="/login" component={AuthPage} />
      
      {/* Admin Routes */}
      <Route path="/admin/:rest*" component={AdminLayout} />
      
      {/* 404 Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
