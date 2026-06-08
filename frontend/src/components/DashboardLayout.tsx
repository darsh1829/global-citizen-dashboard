import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Newspaper,
  Bitcoin,
  CircleDollarSign,
  PanelLeft,
  Settings,
  
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

function DashboardLayout() {
  // Sidebar starts collapsed by default for the hover effect
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the user's token
    navigate('/login'); // Redirect to the login page
  };

  // Helper component for navigation links to avoid repetition
  const NavLinkItem = ({ to, icon: Icon, children }: any) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                isActive ? "bg-accent text-accent-foreground" : "text-foreground"
              } ${!isCollapsed ? "w-full justify-start gap-3 px-3" : ""}`
            }
          >
            <Icon className="h-5 w-5" />
            <span className={isCollapsed ? "sr-only" : ""}>{children}</span>
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
        <nav className="flex flex-col items-start gap-4 px-2 sm:py-5">
          <Link to="/" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base self-center">
            {/* TODO: Add Logo SVG here */}
            <span className="sr-only">Global Citizen</span>
          </Link>
          <NavLinkItem to="/" icon={Home}>Home</NavLinkItem>
          <NavLinkItem to="/news" icon={Newspaper}>News</NavLinkItem>
          <NavLinkItem to="/crypto" icon={Bitcoin}>Crypto</NavLinkItem>
          <NavLinkItem to="/currency" icon={CircleDollarSign}>Currency</NavLinkItem>
        </nav>
        <nav className="mt-auto flex flex-col items-start gap-4 px-2 sm:py-5">
          {/* --- NEW SETTINGS DROPDOWN --- */}
          <DropdownMenu>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    {/* FIX: Replaced the <div> with a <Button> for better consistency and alignment */}
                    <Button
                      variant="ghost"
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${!isCollapsed ? "w-full justify-start gap-3 px-3" : ""}`}
                    >
                      <Settings className="h-5 w-5" />
                      <span className={isCollapsed ? "sr-only" : ""}>Settings</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent side="right" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Logout button now works */}
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
                <Link to="/" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                  {/* TODO: Add Logo SVG here */}
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
          <Outlet /> {/* This is where your pages will be rendered */}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
