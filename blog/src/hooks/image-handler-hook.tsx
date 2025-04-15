"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_AppLift_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

interface UploadImageResponse {
  imageId: string;
  name: string;
}

export const useImageHandler = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, token: string): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": API_KEY,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${await res.text()}`);
      }

      const result = (await res.json()) as UploadImageResponse[];

      if (!result?.[0]?.imageId) {
        throw new Error("Image ID missing in response");
      }

      return result[0].imageId;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw new Error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const useSecureImage = (imageId: string | null) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
      if (!imageId) return;

      const controller = new AbortController();

      const fetchImage = async () => {
        try {
          const res = await fetch(`${API_URL}/images/${imageId}`, {
            method: "GET",
            headers: { "x-api-key": API_KEY },
            signal: controller.signal,
          });

          if (!res.ok) throw new Error("Failed to fetch image");

          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        } catch (err) {
          if (!(err instanceof DOMException && err.name === "AbortError")) {
            console.error("Image load failed:", err);
          }
        }
      };

      void fetchImage();

      return () => {
        controller.abort();
        if (imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
      };
    }, [imageId]);

    return imageUrl;
  };

  return { uploadImage, useSecureImage, isUploading, error };
};
