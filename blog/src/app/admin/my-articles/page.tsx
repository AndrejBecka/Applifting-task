import { api } from "~/trpc/server";
import { ArticlesTable } from "~/components/articles/articles-table";
import type { Article } from "~/types/article";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ArticleWithComments extends Article {
  commentCount: number;
}

export default async function MyArticles() {
  const { items: articles } = await api.article.getArticle({});

  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const enrichedArticles = await Promise.all(
    articles.map(async (article) => {
      const detail = await api.article.getArticleDetail({
        articleId: article.articleId,
      });

      return {
        ...article,
        commentCount: detail.comments?.length ?? 0,
      } satisfies ArticleWithComments;
    }),
  );

  return (
    <div className="mx-auto mt-4 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My articles</h1>
      </div>

      <div className="rounded-md border bg-white">
        <div className="overflow-x-auto">
          <ArticlesTable articles={enrichedArticles} />
        </div>
      </div>
    </div>
  );
}
