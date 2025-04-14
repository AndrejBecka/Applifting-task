"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { PRIVATE_ROUTES } from "~/routes/routes";
import { ArticleForm } from "~/components/articles/articles-form";
import { useSecureImage } from "~/hooks/getImages-hook";

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();

  const [isHydrated, setIsHydrated] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? (localStorage.getItem("token") ?? "") : "";

  const articleId = typeof params.id === "string" ? params.id : null;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const utils = api.useUtils();

  const { data: article, isLoading } = api.article.getArticleDetail.useQuery(
    {
      token,
      articleId: articleId ?? "",
    },
    {
      enabled: !!articleId && !!token,
      refetchOnMount: true,
      staleTime: 0,
    },
  );

  const fetchedImage = useSecureImage(
    isHydrated ? (article?.imageId ?? null) : null,
    token,
  );

  useEffect(() => {
    if (fetchedImage) setImageUrl(fetchedImage);
  }, [fetchedImage]);

  const updateArticle = api.article.updateArticle.useMutation({
    onSuccess: async () => {
      await utils.article.getArticleDetail.invalidate({
        articleId: articleId ?? "",
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
    if (!token || !articleId) return;

    await updateArticle.mutateAsync({
      articleId,
      title: data.title,
      content: data.content,
      perex: data.perex,
      imageId: data.imageId ?? null,
      token,
    });
  };

  if (!articleId) return <div>Invalid article ID</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!article) return <div>Article not found</div>;

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
