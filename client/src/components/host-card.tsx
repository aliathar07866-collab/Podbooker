import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import type { Host } from "@shared/schema";

interface HostCardProps {
  host: Host;
}

export function HostCard({ host }: HostCardProps) {
  const averageRating = host.reviewCount > 0 ? (host.rating / host.reviewCount).toFixed(1) : "0.0";

  return (
    <Card className="overflow-visible hover-elevate" data-testid={`card-host-${host.id}`}>
      <div className="relative h-40 overflow-hidden rounded-t-lg">
        <img 
          src={host.coverArt} 
          alt={`${host.name} podcast cover`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-20 w-20 border-2 border-background -mt-10">
            <AvatarImage src={host.avatar} alt={host.name} />
            <AvatarFallback>{host.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0 pt-2">
            <h3 className="text-xl font-bold text-foreground truncate" data-testid={`text-host-name-${host.id}`}>
              {host.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{host.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-semibold" data-testid={`text-rating-${host.id}`}>
              {averageRating}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({host.reviewCount} {host.reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        <Badge variant="secondary" className="mb-4" data-testid={`badge-category-${host.id}`}>
          {host.category}
        </Badge>

        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="font-bold text-foreground" data-testid={`text-rate-${host.id}`}>
              ${host.hourlyRate}/hr
            </span>
          </div>
          
          <Link href={`/host/${host.id}`}>
            <a>
              <Button size="sm" data-testid={`button-view-profile-${host.id}`}>
                View Profile
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </Card>
  );
}
