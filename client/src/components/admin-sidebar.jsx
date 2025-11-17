import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Film,
  Calendar,
  BarChart3,
  Sparkles,
  Settings,
  Home,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/admin",
  },
  {
    title: "Movies",
    icon: Film,
    url: "/admin/movies",
  },
  {
    title: "Showtimes",
    icon: Calendar,
    url: "/admin/showtimes",
  },
  {
    title: "ML Predictions",
    icon: Sparkles,
    url: "/admin/predictions",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    url: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/admin/settings",
  },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <Link href="/admin">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <div>
              <div className="font-display font-bold text-lg">CinemaMax</div>
              <div className="text-xs text-muted-foreground">Admin Panel</div>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
