"use client";

import { useSecureImage } from "~/hooks/getImages-hook";
import { formatDate } from "~/lib/utils";
import type { ArticleDetail } from "~/types/article";
import ReactMarkdown from "react-markdown";

interface ArticleDetailClientProps {
  article: ArticleDetail;
}

export function ArticleDetailClient({ article }: ArticleDetailClientProps) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const secureImageUrl = useSecureImage(article.imageId, token);

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

      <div className="prose prose-invert">
        {/* You can parse markdown if needed */}
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      {/* Comments Preview (Optional) */}
      {article.comments?.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Comments</h2>
          <ul className="space-y-4">
            {article.comments.map((comment) => (
              <li key={comment.commentId}>
                <div className="rounded bg-white/5 p-4 shadow">
                  <p className="font-semibold">{comment.author}</p>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
