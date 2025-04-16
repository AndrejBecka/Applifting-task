"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuthGuard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/token", {
          method: "GET",
          credentials: "include",
        });

        const data = (await res.json()) as { isLoggedIn: boolean };
        if (data.isLoggedIn) {
          setIsAuthenticated(true);
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    void checkLogin();
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
  };
};
