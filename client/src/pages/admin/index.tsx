import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Switch, Route, useLocation } from "wouter";
import AdminDashboard from "./dashboard";
import AdminMoviesPage from "./movies";
import AdminPredictionsPage from "./predictions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link } from "wouter";

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/movies" component={AdminMoviesPage} />
      <Route path="/admin/showtimes" component={() => <div className="p-8">Showtimes Management (Coming Soon)</div>} />
      <Route path="/admin/predictions" component={AdminPredictionsPage} />
      <Route path="/admin/analytics" component={() => <div className="p-8">Analytics (Coming Soon)</div>} />
      <Route path="/admin/settings" component={() => <div className="p-8">Settings (Coming Soon)</div>} />
      <Route component={() => <div className="p-8">404 - Page not found</div>} />
    </Switch>
  );
}

export default function AdminLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-6 py-3 border-b bg-background">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h2 className="font-semibold text-lg">Admin Panel</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  View Site
                </Button>
              </Link>
              <Button variant="ghost" size="sm" data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-muted/30">
            <AdminRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
