import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Mail, User } from "lucide-react";
import type { Appointment } from "@shared/schema";
import type { Host } from "@shared/schema";

interface AppointmentWithHost extends Appointment {
  host?: Host;
}

export default function Appointments() {
  const { data: appointments = [], isLoading } = useQuery<AppointmentWithHost[]>({
    queryKey: ["/api/appointments"],
  });

  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= new Date();
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate < new Date();
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-appointments-title">
            My Appointments
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your upcoming and past podcast recording sessions
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Appointments Yet</h3>
            <p className="text-muted-foreground">
              Browse podcast hosts and book your first appointment
            </p>
          </Card>
        ) : (
          <>
            {upcomingAppointments.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Upcoming Appointments ({upcomingAppointments.length})
                </h2>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id} className="p-6" data-testid={`card-appointment-${appointment.id}`}>
                      <div className="flex flex-col md:flex-row gap-6">
                        {appointment.host && (
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={appointment.host.avatar} alt={appointment.host.name} />
                              <AvatarFallback>{appointment.host.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground" data-testid={`text-host-name-${appointment.id}`}>
                                {appointment.host.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{appointment.host.title}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm" data-testid={`text-date-${appointment.id}`}>
                                {new Date(appointment.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm" data-testid={`text-time-${appointment.id}`}>
                                {appointment.timeSlot} ({appointment.duration} min)
                              </span>
                            </div>
                            <Badge 
                              variant={appointment.status === "confirmed" ? "default" : "secondary"}
                              data-testid={`badge-status-${appointment.id}`}
                            >
                              {appointment.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{appointment.guestName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{appointment.guestEmail}</span>
                            </div>
                          </div>

                          {appointment.notes && (
                            <div className="pt-2">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-semibold">Notes:</span> {appointment.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Past Appointments ({pastAppointments.length})
                </h2>
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <Card key={appointment.id} className="p-6 opacity-75" data-testid={`card-past-appointment-${appointment.id}`}>
                      <div className="flex flex-col md:flex-row gap-6">
                        {appointment.host && (
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={appointment.host.avatar} alt={appointment.host.name} />
                              <AvatarFallback>{appointment.host.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">
                                {appointment.host.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{appointment.host.title}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm">
                                {new Date(appointment.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">
                                {appointment.timeSlot} ({appointment.duration} min)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
