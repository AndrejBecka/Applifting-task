"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useImageUpload } from "~/hooks/uploadImage-hook";

interface ArticleFormProps {
  initialData?: {
    title: string;
    content: string;
  };
  imageUrl?: string | null;
  onSubmit: (data: {
    title: string;
    content: string;
    imageId: string | null;
  }) => Promise<void>;
  submitLabel?: string;
}

export function ArticleForm({
  initialData,
  imageUrl,
  onSubmit,
  submitLabel = "Publish article",
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl ?? null);

  const { uploadImage, isUploading, error: uploadError } = useImageUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageFile(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Cleanup blob when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    try {
      let uploadedImageId: string | null = null;

      if (imageFile) {
        uploadedImageId = await uploadImage(imageFile, token);
      }

      await onSubmit({
        title,
        content,
        imageId: uploadedImageId,
      });
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error(
        (error instanceof Error
          ? error.message
          : "Failed to process your request") || "Unknown error",
      );
    }
  };

  return (
    <div className="rounded-md border bg-white p-6">
      <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Article Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My First Article"
            className="max-w-md"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Featured Image</label>

          {(imageFile ? previewUrl : imageUrl) && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageFile ? (previewUrl ?? "") : (imageUrl ?? "")}
                alt="Uploaded"
                width={160}
                height={160}
                className="mb-2 max-h-40 rounded border shadow"
              />
            </>
          )}

          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Supports markdown. Yay!"
            className="min-h-[300px]"
          />
        </div>
      </form>

      <div className="mt-4 flex items-center justify-center">
        <Button type="submit" form="article-form" disabled={isUploading}>
          {isUploading ? "Uploading..." : submitLabel}
        </Button>
      </div>

      {uploadError && (
        <p className="mt-2 text-sm text-red-500">{uploadError}</p>
      )}
    </div>
  );
}
