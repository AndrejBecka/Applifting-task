"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { PRIVATE_ROUTES } from "~/routes/routes";
import { ArticleForm } from "~/components/articles/articles-form";

export default function CreateArticle() {
  const router = useRouter();
  const createArticle = api.article.createArticle.useMutation({
    onSuccess: () => {
      toast.success("Article created successfully");
      router.push(PRIVATE_ROUTES.MY_ARTICLES);
    },
    onError: (error) => {
      toast.error("Failed to create article: " + error.message);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    perex: string;
    imageId: string | null;
  }) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await createArticle.mutateAsync({
      title: data.title,
      content: data.content,
      perex: data.perex,
      imageId: data.imageId ?? "",
      token,
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="mt-4 flex items-center justify-center text-2xl font-bold">
        Create new article
      </h1>
      <ArticleForm onSubmit={handleSubmit} />
    </div>
  );
}
