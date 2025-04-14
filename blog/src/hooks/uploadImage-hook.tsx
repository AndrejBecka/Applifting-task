import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_AppLift_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

interface UploadImageResponse {
  imageId: string;
  name: string;
}

interface UseImageUploadReturn {
  uploadImage: (file: File, token: string) => Promise<string>;
  isUploading: boolean;
  error: string | null;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, token: string): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": API_KEY,
          // Do not manually set Content-Type with FormData!
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error("Image upload failed: " + text);
      }

      const data = (await response.json()) as UploadImageResponse[];

      if (!data[0]?.imageId) {
        throw new Error("Invalid response format: imageId missing");
      }

      return data[0].imageId;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown upload error";
      setError(message);
      throw new Error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
};
