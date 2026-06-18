import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getUserProfile } from "@/services/api";

// Turns "Hiya Majmundar" into "HM", or falls back to "?" if no name yet
function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function DashboardLayout() {
  // Sidebar starts collapsed by default for the hover effect
  const [isCollapsed, setIsCollapsed] = useState(true);
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

  // Helper component for navigation links to avoid repetition
  const NavLinkItem = ({ to, icon: Icon, children }: any) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted hover:text-foreground md:h-8 md:w-8 ${
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              } ${!isCollapsed ? "w-full justify-start gap-3 px-3" : ""}`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className={isCollapsed ? "sr-only" : "truncate"}>{children}</span>
          </NavLink>
        </TooltipTrigger>
        <TooltipContent side="right">{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex transition-all duration-300 ${isCollapsed ? "" : "sm:w-56"}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <nav className="flex flex-col items-start gap-1 px-2 py-4">
          {/* Logo */}
          <Link
            to="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground md:h-8 md:w-8 mb-4 self-center"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">Global Citizen</span>
          </Link>

          <NavLinkItem to="/" icon={Home}>Home</NavLinkItem>
          <NavLinkItem to="/news" icon={Newspaper}>News</NavLinkItem>
          <NavLinkItem to="/crypto" icon={Bitcoin}>Crypto</NavLinkItem>
          <NavLinkItem to="/currency" icon={CircleDollarSign}>Currency</NavLinkItem>
        </nav>

        <nav className="mt-auto flex flex-col items-start gap-1 px-2 py-4 border-t">
          {/* --- User Account Dropdown with Initials Avatar --- */}
          <DropdownMenu>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex h-9 items-center justify-center rounded-lg p-0 text-foreground transition-colors hover:bg-muted md:h-8 ${!isCollapsed ? "w-full justify-start gap-3 px-2" : "w-9 md:w-8"}`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {initials}
                      </span>
                      <span className={isCollapsed ? "sr-only" : "truncate text-sm"}>
                        {userName || "My Account"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">{userName || "My Account"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent side="right" align="end">
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
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className={`flex flex-col sm:gap-4 sm:py-4 transition-all duration-300 ${isCollapsed ? "sm:pl-14" : "sm:pl-56"}`}>
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile Menu (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link to="/" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Global Citizen</span>
                </Link>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/news">News</NavLink>
                <NavLink to="/crypto">Crypto</NavLink>
                <NavLink to="/currency">Currency</NavLink>
                <NavLink to="/settings">Settings</NavLink>
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        {/* --- PAGE CONTENT --- */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;