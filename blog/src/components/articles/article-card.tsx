import type { Article } from "~/types/article";
import { MessageSquare } from "lucide-react";
import { formatDate } from "~/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { PUBLIC_ROUTES } from "~/routes/routes";

interface ArticleCardProps {
  article: Article & { imageUrl?: string | null };
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`${PUBLIC_ROUTES.ARTICLE_DETAIL}/${article.articleId}`}
      className="block first:pt-0 last:pb-0"
    >
      <Card className="hover:bg-accent/5 border-none shadow-none transition-colors">
        <CardContent className="p-0">
          <article className="group">
            <div className="flex gap-4 md:gap-6">
              <div className="h-24 w-24 flex-shrink-0 md:h-32 md:w-32">
                <div className="aspect-square overflow-hidden rounded-md">
                  <img
                    src={article.imageUrl ?? ""}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <h2 className="group-hover:text-primary mb-1 font-serif text-lg leading-tight font-bold md:text-xl">
                  {article.title}
                </h2>
                <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
                  <span>Andrej Bečka</span>
                  <span className="mx-1">•</span>
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                  {article.perex}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <Button
                    variant="link"
                    className="text-primary h-auto p-0"
                    tabIndex={-1}
                  >
                    Read article online
                  </Button>
                  <div className="text-muted-foreground flex items-center text-xs">
                    <MessageSquare className="mr-1 h-3 w-3" />
                    {article.commentsCount ?? 0} comments
                  </div>
                </div>
              </div>
            </div>
          </article>
        </CardContent>
      </Card>
    </Link>
  );
}
