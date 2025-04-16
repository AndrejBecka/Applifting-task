"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  PUBLIC_HEADER_ROUTES,
  NAVIGATION_PRIVATE_ROUTES,
} from "./header.routes";
import { cn } from "~/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/token", {
          method: "GET",
          credentials: "include",
        });

        const data = (await res.json()) as { isLoggedIn: boolean };
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      }
    };

    fetchStatus();

    window.addEventListener("authChange", fetchStatus);

    return () => {
      window.removeEventListener("authChange", fetchStatus);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.dispatchEvent(new Event("authChange"));
    setIsLoggedIn(false);
    router.push("/");
  };

  const isActive = (path: string): boolean => pathname === path;

  const headerNavigation = isLoggedIn
    ? [...PUBLIC_HEADER_ROUTES, ...NAVIGATION_PRIVATE_ROUTES]
    : PUBLIC_HEADER_ROUTES;

  return (
    <header className="border-border/40 sticky top-0 z-10 border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 19c0-3.87 3.13-7 7-7h1c-3.87 0-7-3.13-7-7 0 3.87-3.13 7-7 7h-1c3.87 0 7 3.13 7 7Z" />
            </svg>
          </Link>
          <nav className="flex items-center gap-6">
            {headerNavigation.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  isActive(route.href)
                    ? "text-primary"
                    : "text-muted-foreground",
                  "text-sm font-medium transition-colors",
                )}
              >
                {route.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Log out
              <LogOut className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login" className="flex items-center gap-1">
                Log in
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
