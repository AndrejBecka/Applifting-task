"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { useImageUpload } from "~/hooks/uploadImage-hook";
import { useRouter } from "next/navigation";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { uploadImage, isUploading, error: uploadError } = useImageUpload();
  const router = useRouter();

  const createArticle = api.article.createArticle.useMutation({
    onSuccess: () => {
      toast.success("Article created successfully");
      setTitle("");
      setContent("");
      setImageFile(null);
    },
    onError: (error) => {
      toast.error("Failed to create article: " + error.message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to create an article");
      return;
    }

    try {
      let uploadedImageId: string | null = null;

      if (imageFile) {
        uploadedImageId = await uploadImage(imageFile, token);
      }

      await createArticle.mutateAsync({
        title,
        content,
        perex: content.substring(0, 100) + "...",
        imageId: uploadedImageId ?? "",
        token, // only used by tRPC to set the auth header
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create new article</h1>
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
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit" form="article-form" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Publish article"}
        </Button>
      </div>
      {uploadError && (
        <p className="mt-2 text-sm text-red-500">{uploadError}</p>
      )}
    </div>
  );
}
