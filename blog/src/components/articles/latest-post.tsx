"use client";

import { useEffect, useState } from "react";
import type { Article } from "~/types/article";
import { ArticleCard } from "./article-card";

interface LatestPostClientProps {
  articles: Article[];
}

export function LatestPostClient({ articles }: LatestPostClientProps) {
  const [articlesWithImages, setArticlesWithImages] = useState<
    (Article & { imageUrl: string | null })[]
  >([]);

  useEffect(() => {
    const fetchImages = async () => {
      const enriched = await Promise.all(
        articles.map(async (article) => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_AppLift_URL}/images/${article.imageId}`,
              {
                headers: {
                  "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
                },
              },
            );

            if (!res.ok) throw new Error("Image fetch failed");

            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            return { ...article, imageUrl: objectUrl };
          } catch (err) {
            console.error("Error fetching image", err);
            return { ...article, imageUrl: null };
          }
        }),
      );
      setArticlesWithImages(enriched);
    };

    void fetchImages();
  }, [articles]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Recent articles
        </h1>
      </div>
      <div>
        {articlesWithImages.map((article) => (
          <ArticleCard key={article.articleId} article={article} />
        ))}
      </div>
    </div>
  );
}
