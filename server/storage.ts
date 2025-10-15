import { 
  type Host, type InsertHost,
  type Appointment, type InsertAppointment,
  type Review, type InsertReview,
  type Availability, type InsertAvailability
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getHosts(): Promise<Host[]>;
  getHost(id: string): Promise<Host | undefined>;
  createHost(host: InsertHost): Promise<Host>;
  updateHost(id: string, host: Partial<InsertHost>): Promise<Host | undefined>;
  deleteHost(id: string): Promise<boolean>;
  
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;
  
  getReviews(): Promise<Review[]>;
  getReviewsByHost(hostId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: string): Promise<boolean>;
  
  getAvailability(hostId: string): Promise<Availability[]>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  updateAvailability(id: string, availability: Partial<InsertAvailability>): Promise<Availability | undefined>;
  deleteAvailability(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private hosts: Map<string, Host>;
  private appointments: Map<string, Appointment>;
  private reviews: Map<string, Review>;
  private availability: Map<string, Availability>;

  constructor() {
    this.hosts = new Map();
    this.appointments = new Map();
    this.reviews = new Map();
    this.availability = new Map();
    this.seedData();
  }

  async getHosts(): Promise<Host[]> {
    return Array.from(this.hosts.values());
  }

  async getHost(id: string): Promise<Host | undefined> {
    return this.hosts.get(id);
  }

  async createHost(insertHost: InsertHost): Promise<Host> {
    const id = randomUUID();
    const host: Host = { 
      ...insertHost, 
      id,
      rating: 0,
      reviewCount: 0
    };
    this.hosts.set(id, host);
    return host;
  }

  async updateHost(id: string, updateData: Partial<InsertHost>): Promise<Host | undefined> {
    const host = this.hosts.get(id);
    if (!host) return undefined;
    
    const updated = { ...host, ...updateData };
    this.hosts.set(id, updated);
    return updated;
  }

  async deleteHost(id: string): Promise<boolean> {
    return this.hosts.delete(id);
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      status: "confirmed",
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updated = { ...appointment, ...updateData };
    this.appointments.set(id, updated);
    return updated;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    return this.appointments.delete(id);
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async getReviewsByHost(hostId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(r => r.hostId === hostId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      helpful: 0,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);

    this.recalculateHostRating(insertReview.hostId);

    return review;
  }

  async updateReview(id: string, updateData: Partial<InsertReview>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;
    
    const updated = { ...review, ...updateData };
    this.reviews.set(id, updated);
    
    if (updateData.rating !== undefined || updateData.hostId !== undefined) {
      this.recalculateHostRating(updated.hostId);
    }
    
    return updated;
  }

  async deleteReview(id: string): Promise<boolean> {
    const review = this.reviews.get(id);
    if (!review) return false;
    
    const deleted = this.reviews.delete(id);
    if (deleted) {
      this.recalculateHostRating(review.hostId);
    }
    return deleted;
  }

  private recalculateHostRating(hostId: string): void {
    const host = this.hosts.get(hostId);
    if (!host) return;

    const hostReviews = Array.from(this.reviews.values()).filter(r => r.hostId === hostId);
    host.reviewCount = hostReviews.length;
    host.rating = hostReviews.reduce((sum, r) => sum + r.rating, 0);
    this.hosts.set(host.id, host);
  }

  async getAvailability(hostId: string): Promise<Availability[]> {
    return Array.from(this.availability.values()).filter(a => a.hostId === hostId);
  }

  async createAvailability(insertAvailability: InsertAvailability): Promise<Availability> {
    const id = randomUUID();
    const availability: Availability = { ...insertAvailability, id };
    this.availability.set(id, availability);
    return availability;
  }

  async updateAvailability(id: string, updateData: Partial<InsertAvailability>): Promise<Availability | undefined> {
    const availability = this.availability.get(id);
    if (!availability) return undefined;
    
    const updated = { ...availability, ...updateData };
    this.availability.set(id, updated);
    return updated;
  }

  async deleteAvailability(id: string): Promise<boolean> {
    return this.availability.delete(id);
  }

  private seedData() {
    const host1Id = randomUUID();
    const host2Id = randomUUID();
    const host3Id = randomUUID();
    const host4Id = randomUUID();
    const host5Id = randomUUID();
    const host6Id = randomUUID();

    const hosts: Host[] = [
      {
        id: host1Id,
        name: "Sarah Mitchell",
        title: "Tech & Innovation Podcast Host",
        bio: "Award-winning tech journalist with 10+ years of experience interviewing industry leaders. I specialize in making complex technical topics accessible and engaging for all audiences. My podcast 'TechForward' has reached over 5 million downloads.",
        category: "Technology",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
        coverArt: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop",
        rating: 48,
        reviewCount: 10,
        hourlyRate: 150,
      },
      {
        id: host2Id,
        name: "Marcus Johnson",
        title: "Business & Entrepreneurship Expert",
        bio: "Serial entrepreneur and business strategist helping founders share their stories. With a background in venture capital and 3 successful exits, I bring deep insights to every conversation about startups, funding, and growth.",
        category: "Business",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
        coverArt: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop",
        rating: 45,
        reviewCount: 9,
        hourlyRate: 200,
      },
      {
        id: host3Id,
        name: "Dr. Emily Chen",
        title: "Health & Wellness Podcast Host",
        bio: "Board-certified physician and wellness advocate dedicated to evidence-based health discussions. I create a comfortable space for guests to discuss mental health, nutrition, fitness, and holistic wellness approaches.",
        category: "Health",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
        coverArt: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=400&fit=crop",
        rating: 50,
        reviewCount: 10,
        hourlyRate: 175,
      },
      {
        id: host4Id,
        name: "Alex Rivera",
        title: "Creative Arts & Culture Host",
        bio: "Emmy-nominated producer with a passion for storytelling through art, music, and culture. I've interviewed Grammy winners, bestselling authors, and emerging artists. Let's create something memorable together.",
        category: "Arts & Culture",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
        coverArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
        rating: 47,
        reviewCount: 10,
        hourlyRate: 165,
      },
      {
        id: host5Id,
        name: "Jessica Taylor",
        title: "Marketing & Social Media Strategist",
        bio: "Digital marketing expert helping brands and creators amplify their message. Former CMO at two Fortune 500 companies, now helping podcasters and content creators grow their audience through strategic storytelling.",
        category: "Marketing",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
        coverArt: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=400&fit=crop",
        rating: 44,
        reviewCount: 9,
        hourlyRate: 180,
      },
      {
        id: host6Id,
        name: "David Park",
        title: "Sports & Performance Psychology Host",
        bio: "Former Olympic athlete turned sports psychologist. I explore the mental side of peak performance with athletes, coaches, and high achievers across all fields. Let's dive deep into what it takes to win.",
        category: "Sports",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
        coverArt: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop",
        rating: 46,
        reviewCount: 10,
        hourlyRate: 160,
      },
    ];

    hosts.forEach(host => this.hosts.set(host.id, host));

    const reviews: Review[] = [
      {
        id: randomUUID(),
        hostId: host1Id,
        reviewerName: "Michael Chen",
        reviewerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
        rating: 5,
        comment: "Sarah was absolutely fantastic! She asked thoughtful questions and made me feel completely at ease. The recording session was professional and the final episode exceeded my expectations.",
        verified: true,
        helpful: 24,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        hostId: host1Id,
        reviewerName: "Rachel Adams",
        reviewerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        rating: 5,
        comment: "Best podcast experience I've had. Sarah's tech expertise really shone through, and she helped me articulate complex ideas in a way that was accessible to everyone.",
        verified: true,
        helpful: 18,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        hostId: host2Id,
        reviewerName: "Jennifer Park",
        reviewerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
        rating: 5,
        comment: "Marcus has an incredible ability to draw out the story behind the business. Our conversation was engaging and insightful. Highly recommend for any entrepreneur!",
        verified: true,
        helpful: 31,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        hostId: host2Id,
        reviewerName: "Tom Wilson",
        reviewerAvatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop",
        rating: 5,
        comment: "Professional setup, great energy, and Marcus really understood our startup's unique challenges. The episode has already brought us new customers!",
        verified: false,
        helpful: 12,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        hostId: host3Id,
        reviewerName: "Lisa Anderson",
        reviewerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
        rating: 5,
        comment: "Dr. Chen created such a safe space to discuss mental health topics. Her medical expertise combined with genuine empathy made for a powerful conversation.",
        verified: true,
        helpful: 42,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        hostId: host4Id,
        reviewerName: "Carlos Martinez",
        reviewerAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop",
        rating: 5,
        comment: "Alex is a true artist in the podcasting space. The production quality was outstanding and the conversation flowed naturally. Can't wait to collaborate again!",
        verified: true,
        helpful: 28,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        hostId: host4Id,
        reviewerName: "Nina Roberts",
        reviewerAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
        rating: 4,
        comment: "Great experience overall! Alex really knows how to bring out the creative side of his guests. Minor audio issue at the start but was quickly resolved.",
        verified: false,
        helpful: 8,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        hostId: host5Id,
        reviewerName: "Brian Foster",
        reviewerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
        rating: 5,
        comment: "Jessica's marketing insights are gold. She helped me refine my message during our pre-interview and the final episode was perfectly on-brand.",
        verified: true,
        helpful: 19,
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        hostId: host6Id,
        reviewerName: "Amanda Lee",
        reviewerAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop",
        rating: 5,
        comment: "David's background as an athlete really came through. He asked questions that only someone who's been there could ask. Phenomenal experience!",
        verified: true,
        helpful: 35,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        hostId: host6Id,
        reviewerName: "Kevin Thompson",
        reviewerAvatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop",
        rating: 4,
        comment: "Really enjoyed our session. David pushed me to go deeper than I expected, which made for great content. Would definitely work with him again.",
        verified: false,
        helpful: 14,
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      },
    ];

    reviews.forEach(review => this.reviews.set(review.id, review));

    hosts.forEach(host => {
      this.recalculateHostRating(host.id);
    });
  }
}

export const storage = new MemStorage();
