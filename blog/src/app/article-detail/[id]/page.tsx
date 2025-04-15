import { notFound } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";
import { ArticleDetail } from "~/components/articles/article-detail";

interface ArticleDetailPageProps {
  params: { id: string };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { id } = params;

  const article = await api.article.getArticleDetail({ articleId: id });

  if (!article) return notFound();

  return (
    <HydrateClient>
      <ArticleDetail article={article} />
    </HydrateClient>
  );
}
