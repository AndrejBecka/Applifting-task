"use client";

import { useSecureImage } from "~/hooks/getImages-hook";
import { formatDate } from "~/lib/utils";
import type { ArticleDetail } from "~/types/article";
import { CommentSection } from "./comment-section";
import MDEditor from "@uiw/react-md-editor";
import { Separator } from "../ui/separator";

interface ArticleDetailClientProps {
  article: ArticleDetail;
}

export function ArticleDetailClient({ article }: ArticleDetailClientProps) {
  const secureImageUrl = useSecureImage(article.imageId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">{article.title}</h1>
      <p className="text-muted-foreground mb-4 text-sm">
        Published on {formatDate(article.createdAt)}
      </p>
      {secureImageUrl && (
        <img
          src={secureImageUrl}
          alt={article.title}
          className="mb-6 w-full rounded-md object-cover shadow"
        />
      )}

      <MDEditor.Markdown
        style={{ backgroundColor: "white", color: "black" }}
        source={article.content}
      />

      <Separator className="my-12" />

      <CommentSection articleId={article.articleId} />
    </div>
  );
}
