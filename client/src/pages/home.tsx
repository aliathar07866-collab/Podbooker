import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { HostCard } from "@/components/host-card";
import { ReviewCard } from "@/components/review-card";
import { Mic2, Star, Calendar, Shield } from "lucide-react";
import type { Host, Review } from "@shared/schema";

export default function Home() {
  const { data: hosts = [], isLoading: hostsLoading } = useQuery<Host[]>({
    queryKey: ["/api/hosts"],
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const featuredHosts = hosts.slice(0, 3);
  const featuredReview = reviews.find(r => r.verified) || reviews[0];

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1920&h=800&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-primary/40" />
        
        <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg" data-testid="text-hero-title">
            Book Podcast Appointments
            <br />
            Without Phone Calls
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow">
            Connect with verified podcast hosts instantly. Browse reviews, check availability, and schedule recording sessions—all in one place.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link href="/browse">
              <a>
                <Button 
                  size="lg" 
                  className="bg-accent border border-accent-border text-accent-foreground backdrop-blur-sm"
                  data-testid="button-search-podcasts"
                >
                  <Mic2 className="mr-2 h-5 w-5" />
                  Browse Podcast Hosts
                </Button>
              </a>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-white">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">15,000+ Appointments Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-semibold">4.8 Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">100% Verified Hosts</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-featured-hosts-title">
              Featured Podcast Hosts
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover top-rated hosts ready to collaborate on your next episode
            </p>
          </div>

          {hostsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredHosts.map((host) => (
                <HostCard key={host.id} host={host} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/browse">
              <a>
                <Button variant="outline" size="lg" data-testid="button-view-all-hosts">
                  View All Hosts
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-reviews-title">
              What Podcast Guests Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences from guests who've booked through our platform
            </p>
          </div>

          {reviewsLoading ? (
            <div className="max-w-4xl mx-auto">
              <div className="h-48 bg-muted animate-pulse rounded-lg" />
            </div>
          ) : featuredReview ? (
            <div className="max-w-4xl mx-auto mb-8">
              <ReviewCard review={featuredReview} featured={true} />
            </div>
          ) : null}

          {!reviewsLoading && reviews.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {reviews.slice(1, 5).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
