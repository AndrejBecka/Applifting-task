"use client";

import { useEffect, useState } from "react";
import type { Article } from "~/types/article";
import { ArticleCard } from "./article-card";

interface LatestPostProps {
  articles: Article[];
}

const API_URL = process.env.NEXT_PUBLIC_AppLift_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export function LatestPost({ articles }: LatestPostProps) {
  const [articlesWithImages, setArticlesWithImages] = useState<
    (Article & { imageUrl: string | null })[]
  >([]);

  useEffect(() => {
    const fetchImages = async () => {
      const enriched = await Promise.all(
        articles.map(async (article) => {
          if (!article.imageId) {
            return { ...article, imageUrl: null };
          }

          try {
            const res = await fetch(`${API_URL}/images/${article.imageId}`, {
              headers: {
                "x-api-key": API_KEY,
              },
            });

            if (!res.ok) throw new Error("Image fetch failed");

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            return { ...article, imageUrl: url };
          } catch (err) {
            console.error("Image fetch error:", err);
            return { ...article, imageUrl: null };
          }
        }),
      );

      setArticlesWithImages(enriched);
    };

    void fetchImages();

    return () => {
      articlesWithImages.forEach((a) => {
        if (a.imageUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(a.imageUrl);
        }
      });
    };
  }, [articles]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Recent articles
        </h1>
      </div>
      <div>
        {articlesWithImages.length === 0 ? (
          <p className="text-muted-foreground text-center">
            No articles found.
          </p>
        ) : (
          articlesWithImages.map((article) => (
            <ArticleCard key={article.articleId} article={article} />
          ))
        )}
      </div>
    </div>
  );
}
