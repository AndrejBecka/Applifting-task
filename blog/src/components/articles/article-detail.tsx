"use client";

import { useImageHandler } from "~/hooks/image-handler-hook";
import { formatDate } from "~/lib/utils";
import type { ArticleDetail } from "~/types/article";
import { CommentSection } from "./comment-section";
import MDEditor from "@uiw/react-md-editor";
import { Separator } from "../ui/separator";

interface ArticleDetailProps {
  article: ArticleDetail;
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const { useSecureImage } = useImageHandler();
  const secureImageUrl = useSecureImage(article.imageId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">{article.title}</h1>
        <p className="text-muted-foreground text-sm">
          Published on {formatDate(article.createdAt)}
        </p>
      </header>

      {secureImageUrl && (
        <img
          src={secureImageUrl}
          alt={article.title || "Article cover"}
          className="mb-6 w-full rounded-md object-cover shadow"
          loading="lazy"
        />
      )}

      <section className="prose prose-neutral max-w-none">
        <MDEditor.Markdown
          source={article.content}
          style={{ backgroundColor: "white", color: "black" }}
        />
      </section>

      <Separator className="my-12" />

      <CommentSection articleId={article.articleId} />
    </div>
  );
}
