import { PencilIcon } from "lucide-react";
import type { Article } from "~/types/article";
import { TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { PRIVATE_ROUTES } from "~/routes/routes";
import Link from "next/link";

interface ArticlesTableProps {
  articles: Array<Article & { commentCount: number }>;
}

export function ArticlesTable({ articles }: ArticlesTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b bg-gray-50 text-left">
          <th className="px-4 py-3 font-medium">Article title</th>
          <th className="px-4 py-3 font-medium">Perex</th>
          <th className="px-4 py-3 font-medium">Author</th>
          <th className="px-4 py-3 font-medium"># of comments</th>
          <th className="px-4 py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((article) => (
          <tr key={article.articleId} className="border-b last:border-0">
            <td className="px-4 py-3">{article.title}</td>
            <td className="px-4 py-3">{article.perex}</td>
            <td className="px-4 py-3">Andrej Bečka</td>
            <td className="px-4 py-3">{article.commentCount}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href={`${PRIVATE_ROUTES.EDIT_ARTICLE}/${article.articleId}`}
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon">
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
