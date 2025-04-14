"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_AppLift_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export function useSecureImage(imageId: string | null, token: string | null) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageId || !token) return;

    const controller = new AbortController();

    void (async () => {
      try {
        const res = await fetch(`${API_URL}/images/${imageId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": API_KEY,
          },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch image: " + res.status);

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);

        console.log("✅ Image loaded:", { objectUrl, imageId });

        setImageUrl(objectUrl);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return; // Expected on cleanup, no need to log
        }
        console.error("Failed to load image", err);
      }
    })();

    return () => {
      controller.abort();
      if (imageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageId, token]);

  return imageUrl;
}
