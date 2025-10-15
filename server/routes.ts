import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema, insertReviewSchema, insertHostSchema, insertAvailabilitySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/hosts", async (req, res) => {
    try {
      const hosts = await storage.getHosts();
      res.json(hosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hosts" });
    }
  });

  app.get("/api/hosts/:id", async (req, res) => {
    try {
      const host = await storage.getHost(req.params.id);
      if (!host) {
        return res.status(404).json({ message: "Host not found" });
      }
      res.json(host);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch host" });
    }
  });

  app.post("/api/hosts", async (req, res) => {
    try {
      const validatedData = insertHostSchema.parse(req.body);
      const host = await storage.createHost(validatedData);
      res.status(201).json(host);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid host data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create host" });
    }
  });

  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      const appointmentsWithHosts = await Promise.all(
        appointments.map(async (appointment) => {
          const host = await storage.getHost(appointment.hostId);
          return { ...appointment, host };
        })
      );
      res.json(appointmentsWithHosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      
      const host = await storage.getHost(validatedData.hostId);
      if (!host) {
        return res.status(404).json({ message: "Host not found" });
      }

      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/reviews/host/:hostId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByHost(req.params.hostId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      
      const host = await storage.getHost(validatedData.hostId);
      if (!host) {
        return res.status(404).json({ message: "Host not found" });
      }

      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get("/api/availability/:hostId", async (req, res) => {
    try {
      const availability = await storage.getAvailability(req.params.hostId);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  app.patch("/api/hosts/:id", async (req, res) => {
    try {
      const updated = await storage.updateHost(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Host not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update host" });
    }
  });

  app.delete("/api/hosts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteHost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Host not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete host" });
    }
  });

  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const updated = await storage.updateAppointment(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAppointment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  app.patch("/api/reviews/:id", async (req, res) => {
    try {
      const updated = await storage.updateReview(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteReview(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  app.post("/api/availability", async (req, res) => {
    try {
      const validatedData = insertAvailabilitySchema.parse(req.body);
      const availability = await storage.createAvailability(validatedData);
      res.status(201).json(availability);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid availability data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create availability" });
    }
  });

  app.patch("/api/availability/:id", async (req, res) => {
    try {
      const updated = await storage.updateAvailability(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Availability not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update availability" });
    }
  });

  app.delete("/api/availability/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAvailability(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Availability not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete availability" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
