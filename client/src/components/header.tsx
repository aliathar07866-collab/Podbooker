import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Calendar, Home, Search } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/">
          <a className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1" data-testid="link-home">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-lg font-bold">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">PodBook</span>
          </a>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <a>
              <Button
                variant={location === "/" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
                data-testid="link-nav-home"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </a>
          </Link>
          <Link href="/browse">
            <a>
              <Button
                variant={location === "/browse" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
                data-testid="link-nav-browse"
              >
                <Search className="h-4 w-4" />
                Browse Hosts
              </Button>
            </a>
          </Link>
          <Link href="/appointments">
            <a>
              <Button
                variant={location === "/appointments" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
                data-testid="link-nav-appointments"
              >
                <Calendar className="h-4 w-4" />
                My Appointments
              </Button>
            </a>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
