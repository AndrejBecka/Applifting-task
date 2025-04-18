"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { formatDate } from "~/lib/utils";
import MDEditor from "@uiw/react-md-editor";
import { mockComments } from "~/lib/comments-mock";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface Comment {
  commentId: string;
  articleId: string;
  content: string;
  author: string;
  postedAt: string;
  score?: number;
}

interface CommentsProps {
  articleId: string;
}

export function CommentSection({ articleId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(
    mockComments.filter((c) => c.articleId === articleId),
  );
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    const newEntry: Comment = {
      commentId: crypto.randomUUID(),
      articleId,
      content: newComment,
      author: authorName,
      postedAt: new Date().toISOString(),
      score: 0,
    };

    setIsSubmitting(true);
    setTimeout(() => {
      setComments((prev) => [...prev, newEntry]);
      setNewComment("");
      setAuthorName("");
      setIsSubmitting(false);
    }, 500);
  };

  const handleVote = (id: string, direction: "up" | "down") => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.commentId === id
          ? {
              ...comment,
              score: (comment.score ?? 0) + (direction === "up" ? 1 : -1),
            }
          : comment,
      ),
    );
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-medium">Comments ({comments.length})</h2>

      <div className="mb-8 space-y-6">
        {comments.map((comment) => (
          <div key={comment.commentId} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {comment.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <p className="text-sm font-medium">{comment.author}</p>
                <span className="text-muted-foreground text-xs">•</span>
                <p className="text-muted-foreground text-xs">
                  {formatDate(comment.postedAt)}
                </p>
              </div>
              <div className="prose prose-sm max-w-none text-sm">
                <div dangerouslySetInnerHTML={{ __html: comment.content }} />
              </div>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
                    onClick={() => handleVote(comment.commentId, "up")}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span className="sr-only">Upvote</span>
                  </Button>
                  <span className="mx-1.5 text-xs font-medium">
                    {comment.score}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
                    onClick={() => handleVote(comment.commentId, "down")}
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                    <span className="sr-only">Downvote</span>
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmitComment} className="space-y-4">
        <h3 className="text-lg font-medium">Join the discussion</h3>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {authorName
                .split(" ")
                .map((n) => n[0])
                .join("") || "AB"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <MDEditor
              value={newComment}
              onChange={(val) => setNewComment(val ?? "")}
              minHeight={120}
              data-color-mode="light"
              preview="edit"
            />
            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                disabled={
                  isSubmitting || !newComment.trim() || !authorName.trim()
                }
                className="h-8 px-4 py-1 text-sm"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
