import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface CommentSectionProps {
  projectId: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
}

export function CommentSection({ projectId, comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onAddComment(newComment);
    setNewComment("");
    toast({
      title: "Success",
      description: "Comment added successfully",
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Comments</h4>
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="font-medium">{comment.userName}</span>
              <span className="text-sm text-gray-500">
                {new Date(comment.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-sm">{comment.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[80px]"
        />
        <Button type="submit" size="sm">
          Add Comment
        </Button>
      </form>
    </div>
  );
}