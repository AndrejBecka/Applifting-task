"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useImageHandler } from "~/hooks/image-handler-hook";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface ArticleFormProps {
  initialData?: {
    title: string;
    perex: string;
    content: string;
  };
  imageUrl?: string | null;
  onSubmit: (data: {
    title: string;
    perex: string;
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
  const [perex, setPerex] = useState(initialData?.perex ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl ?? null);

  const { uploadImage, isUploading, error: uploadError } = useImageHandler();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageFile(file);
      setPreviewUrl(objectUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let uploadedImageId: string | null = null;

      if (imageFile) {
        uploadedImageId = await uploadImage(imageFile);
      }

      await onSubmit({
        title,
        perex,
        content,
        imageId: uploadedImageId,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to process your request";
      toast.error(message);
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
          <label htmlFor="picture" className="text-sm font-medium">
            Featured Image
          </label>
          {(previewUrl ?? imageUrl) && (
            <img
              src={previewUrl ?? imageUrl ?? ""}
              id="picture"
              alt="Uploaded preview"
              width={160}
              height={160}
              className="mb-2 max-h-40 rounded border shadow"
            />
          )}
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="perex" className="text-sm font-medium">
            Perex
          </label>
          <Textarea
            id="perex"
            value={perex}
            onChange={(e) => setPerex(e.target.value)}
            placeholder="Short summary (markdown supported)"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <MDEditor
            id="content"
            value={content}
            onChange={(val) => setContent(val ?? "")}
            preview="edit"
            height={300}
            data-color-mode="light"
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
