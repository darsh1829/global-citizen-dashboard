import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Newspaper,
  Bitcoin,
  CircleDollarSign,
  PanelLeft,
  Settings,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getUserProfile } from "@/services/api";

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/news", icon: Newspaper, label: "News" },
  { to: "/crypto", icon: Bitcoin, label: "Crypto" },
  { to: "/currency", icon: CircleDollarSign, label: "Currency" },
];

function DashboardLayout() {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserProfile()
      .then((profile) => setUserName(profile.name))
      .catch(() => setUserName(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const initials = getInitials(userName);

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* --- DESKTOP SIDEBAR (fixed width, always expanded) --- */}
      <aside className="hidden sm:flex sm:w-56 sm:flex-col fixed inset-y-0 left-0 z-10 border-r bg-background">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 border-b">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Globe className="h-5 w-5" />
          </div>
          <span className="font-semibold text-sm">Global Citizen</span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Account section, pinned to bottom */}
        <div className="border-t px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-2 h-auto py-2"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initials}
                </span>
                <span className="truncate text-sm font-normal">
                  {userName || "My Account"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-52">
              <DropdownMenuLabel>{userName || "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex flex-col flex-1 sm:ml-56">
        {/* --- HEADER (mobile only) --- */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0">
              <div className="flex items-center gap-2 px-4 h-14 border-b">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="font-semibold text-sm">Global Citizen</span>
              </div>
              <nav className="flex flex-col gap-1 px-3 py-4">
                {navItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </NavLink>
                ))}
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <span>Settings</span>
                </NavLink>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Globe className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm">Global Citizen</span>
          </div>
        </header>

        {/* --- PAGE CONTENT --- */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;