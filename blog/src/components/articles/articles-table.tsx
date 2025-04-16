"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import type { Article } from "~/types/article";
import { Button } from "../ui/button";
import { PRIVATE_ROUTES } from "~/routes/routes";
import { api } from "~/trpc/react";

interface ArticlesTableProps {
  articles: Array<Article & { commentCount: number }>;
}

export function ArticlesTable({ articles }: ArticlesTableProps) {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? (localStorage.getItem("token") ?? "") : "";

  const deleteArticle = api.article.deleteArticle.useMutation({
    onSuccess: () => {
      toast.success("Article deleted successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error(`Failed to delete article: ${error.message}`);
    },
  });

  const handleDelete = (articleId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?",
    );
    if (confirmed) {
      deleteArticle.mutate({ articleId });
    }
  };

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b bg-gray-50 text-left">
          <th className="px-4 py-3 font-medium">Article Title</th>
          <th className="px-4 py-3 font-medium">Perex</th>
          <th className="px-4 py-3 font-medium">Author</th>
          <th className="px-4 py-3 font-medium"># Comments</th>
          <th className="px-4 py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {articles.map(({ articleId, title, perex, commentCount }) => (
          <tr key={articleId} className="border-b last:border-0">
            <td className="px-4 py-3">{title}</td>
            <td className="px-4 py-3">{perex}</td>
            <td className="px-4 py-3">Andrej Bečka</td>
            <td className="px-4 py-3">{commentCount}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`${PRIVATE_ROUTES.EDIT_ARTICLE}/${articleId}`}>
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(articleId)}
                  disabled={deleteArticle.isPending}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
