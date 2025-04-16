"use client";

import { toast } from "sonner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { PRIVATE_ROUTES } from "~/routes/routes";
import { ArticleForm } from "~/components/articles/articles-form";
import { useAuthGuard } from "~/hooks/auth-guard";

export default function CreateArticle() {
  const { isAuthenticated, isLoading } = useAuthGuard();

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

  const handleSubmit = async (data: {
    title: string;
    content: string;
    perex: string;
    imageId: string | null;
  }) => {
    await createArticle.mutateAsync({
      title: data.title,
      content: data.content,
      perex: data.perex,
      imageId: data.imageId ?? "",
    });
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex min-h-[50vh] items-center justify-center">
        <p className="animate-pulse text-sm">Checking authentication...</p>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="mt-4 flex items-center justify-center text-2xl font-bold">
        Create new article
      </h1>
      <ArticleForm onSubmit={handleSubmit} />
    </div>
  );
}
