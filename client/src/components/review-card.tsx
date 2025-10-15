import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Review } from "@shared/schema";

interface ReviewCardProps {
  review: Review;
  featured?: boolean;
}

export function ReviewCard({ review, featured = false }: ReviewCardProps) {
  return (
    <Card className={`p-6 ${featured ? 'border-primary border-2' : ''}`} data-testid={`card-review-${review.id}`}>
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
          <AvatarFallback>{review.reviewerName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-foreground" data-testid={`text-reviewer-name-${review.id}`}>
              {review.reviewerName}
            </h4>
            {review.verified && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? 'fill-accent text-accent'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-foreground leading-relaxed max-w-prose mb-3" data-testid={`text-review-comment-${review.id}`}>
            {review.comment}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ThumbsUp className="h-4 w-4" />
            <span>{review.helpful} found this helpful</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
