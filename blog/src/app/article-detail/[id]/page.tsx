import { notFound } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";
import { ArticleDetailClient } from "~/components/articles/article-detail";

interface ArticleDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const article = await api.article.getArticleDetail({ articleId: params.id });

  if (!article) return notFound();

  return (
    <HydrateClient>
      <ArticleDetailClient article={article} />
    </HydrateClient>
  );
}
