import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ReviewCard } from "@/components/review-card";
import { Star, MapPin, DollarSign, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Host, Review, InsertAppointment } from "@shared/schema";

export default function HostProfile() {
  const [, params] = useRoute("/host/:id");
  const hostId = params?.id;
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [notes, setNotes] = useState("");

  const { data: host, isLoading: hostLoading } = useQuery<Host>({
    queryKey: ["/api/hosts", hostId],
    enabled: !!hostId,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews/host", hostId],
    enabled: !!hostId,
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      return await apiRequest("POST", "/api/appointments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been confirmed. Check your email for details.",
      });
      setShowBookingDialog(false);
      setGuestName("");
      setGuestEmail("");
      setNotes("");
      setSelectedSlot("");
      setSelectedDate("");
    },
  });

  const availableTimeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const handleBooking = () => {
    if (!guestName || !guestEmail || !selectedDate || !selectedSlot || !hostId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    bookingMutation.mutate({
      hostId,
      guestName,
      guestEmail,
      date: selectedDate,
      timeSlot: selectedSlot,
      duration: 60,
      notes: notes || undefined,
    });
  };

  if (hostLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!host) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Host not found</p>
      </div>
    );
  }

  const averageRating = host.reviewCount > 0 ? (host.rating / host.reviewCount).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
          <img 
            src={host.coverArt} 
            alt={`${host.name} podcast cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-32 relative z-10">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 border-4 border-background mb-4">
                  <AvatarImage src={host.avatar} alt={host.name} />
                  <AvatarFallback className="text-2xl">{host.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <h1 className="text-2xl font-bold text-foreground mb-1" data-testid="text-host-name">
                  {host.name}
                </h1>
                <p className="text-muted-foreground mb-3">{host.title}</p>
                
                <Badge variant="secondary" className="mb-4">
                  {host.category}
                </Badge>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="text-lg font-semibold">{averageRating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({host.reviewCount} reviews)
                  </span>
                </div>

                <div className="w-full space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">
                      <span className="font-bold text-foreground">${host.hourlyRate}</span>/hour
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">60 min sessions</span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => setShowBookingDialog(true)}
                  data-testid="button-book-appointment"
                >
                  Book Appointment
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
              <p className="text-foreground leading-relaxed" data-testid="text-host-bio">
                {host.bio}
              </p>
            </Card>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Reviews ({reviews.length})</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No reviews yet</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-booking">
          <DialogHeader>
            <DialogTitle>Book Appointment with {host.name}</DialogTitle>
            <DialogDescription>
              Select your preferred date and time, then provide your contact information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">Select Date</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {nextSevenDays.map((date) => {
                  const dateObj = new Date(date);
                  const formatted = dateObj.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  });
                  return (
                    <Button
                      key={date}
                      variant={selectedDate === date ? "default" : "outline"}
                      onClick={() => setSelectedDate(date)}
                      className="h-auto py-3"
                      data-testid={`button-date-${date}`}
                    >
                      {formatted}
                    </Button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div>
                <Label className="text-base font-semibold mb-3 block">Select Time</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableTimeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedSlot === slot ? "default" : "outline"}
                      onClick={() => setSelectedSlot(slot)}
                      data-testid={`button-timeslot-${slot}`}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedSlot && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="guestName">Your Name *</Label>
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="John Doe"
                    data-testid="input-guest-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestEmail">Your Email *</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="john@example.com"
                    data-testid="input-guest-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or topics you'd like to discuss..."
                    rows={4}
                    data-testid="textarea-notes"
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Booking Summary</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                    <p>Time: {selectedSlot}</p>
                    <p>Duration: 60 minutes</p>
                    <p className="font-semibold text-foreground">Total: ${host.hourlyRate}</p>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleBooking}
                  disabled={bookingMutation.isPending}
                  data-testid="button-confirm-booking"
                >
                  {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
