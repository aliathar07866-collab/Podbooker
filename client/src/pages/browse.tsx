import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HostCard } from "@/components/host-card";
import { Search } from "lucide-react";
import type { Host } from "@shared/schema";

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const { data: hosts = [], isLoading } = useQuery<Host[]>({
    queryKey: ["/api/hosts"],
  });

  const categories = ["all", ...Array.from(new Set(hosts.map(h => h.category)))];

  const filteredHosts = hosts.filter(host => {
    const matchesSearch = host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         host.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || host.category === categoryFilter;
    const matchesRating = ratingFilter === "all" || 
                         (host.reviewCount > 0 && (host.rating / host.reviewCount) >= parseFloat(ratingFilter));
    
    return matchesSearch && matchesCategory && matchesRating;
  });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-browse-title">
            Browse Podcast Hosts
          </h1>
          <p className="text-lg text-muted-foreground">
            Find the perfect host for your next podcast episode
          </p>
        </div>

        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b pb-6 mb-8 -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or specialty..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 h-12" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.filter(c => c !== "all").map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full md:w-48 h-12" data-testid="select-rating">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredHosts.length} {filteredHosts.length === 1 ? 'host' : 'hosts'}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredHosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHosts.map((host) => (
              <HostCard key={host.id} host={host} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground" data-testid="text-no-results">
              No hosts found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
