"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { PRIVATE_ROUTES } from "~/routes/routes";
import { ArticleForm } from "~/components/articles/articles-form";
import { useImageHandler } from "~/hooks/image-handler-hook";
import { useAuthGuard } from "~/hooks/auth-guard";

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const articleId = typeof params.id === "string" ? params.id : null;

  const { isAuthenticated, isLoading: isAuthLoading } = useAuthGuard();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { useSecureImage } = useImageHandler();
  const utils = api.useUtils();

  const { data: article, isLoading: isArticleLoading } =
    api.article.getArticleDetail.useQuery(
      { articleId: articleId ?? "" },
      {
        enabled: !!articleId && isAuthenticated,
        refetchOnMount: true,
        staleTime: 0,
      },
    );

  const secureImage = useSecureImage(
    isAuthenticated && article ? article.imageId : null,
  );

  useEffect(() => {
    if (secureImage) {
      setImageUrl(secureImage);
    }
  }, [secureImage]);

  const updateArticle = api.article.updateArticle.useMutation({
    onSuccess: async () => {
      await utils.article.getArticleDetail.invalidate({
        articleId: articleId!,
      });
      toast.success("Article updated successfully");
      router.push(PRIVATE_ROUTES.MY_ARTICLES);
    },
    onError: (error) => {
      toast.error("Failed to update article: " + error.message);
    },
  });

  const handleSubmit = async (data: {
    title: string;
    content: string;
    perex: string;
    imageId: string | null;
  }) => {
    if (!articleId) return;

    await updateArticle.mutateAsync({
      articleId,
      title: data.title,
      content: data.content,
      perex: data.perex,
      imageId: data.imageId ?? null,
    });
  };

  if (isAuthLoading) {
    return (
      <div className="text-muted-foreground flex min-h-[50vh] items-center justify-center">
        <p className="animate-pulse text-sm">Checking authentication...</p>
      </div>
    );
  }

  if (!articleId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-red-600">
        <p className="text-sm font-medium">Invalid article ID.</p>
      </div>
    );
  }

  if (isArticleLoading) {
    return (
      <div className="text-muted-foreground flex min-h-[50vh] items-center justify-center">
        <p className="animate-pulse text-sm">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-red-600">
        <p className="text-sm font-medium">Article not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="mt-4 flex items-center justify-center text-2xl font-bold">
        Edit article
      </h1>

      <ArticleForm
        initialData={article}
        imageUrl={imageUrl}
        onSubmit={handleSubmit}
        submitLabel="Update article"
      />
    </div>
  );
}
