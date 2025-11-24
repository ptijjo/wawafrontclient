'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import frLocale from '@fullcalendar/core/locales/fr';

interface Availability {
    id: string;
    date: string;
    isBooked: boolean;
    isBlocked: boolean;
    blockedNote?: string | null;
    appointment?: {
        id: string;
        firstname: string;
        lastname: string;
    } | null;
}

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    extendedProps: {
        isBooked: boolean;
        isBlocked: boolean;
        blockedNote?: string | null;
    };
}

export default function AvailabilityCalendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAvailabilities = async () => {
        try {
            setLoading(true);
            // Récupère un lot large (pagination) + possibilité de génération
            const response = await fetch('/api/availabilities?page=1&pageSize=200&autofill=1');
            const data = await response.json();

            if (data.success) {
                // Regrouper les slots réservés contigus par rendez-vous
                const slots: Availability[] = data.availabilities;

                // Tri par date (assurer ordre)
                slots.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                const grouped: CalendarEvent[] = [];
                const textColor = '#ffffff';

                let i = 0;
                while (i < slots.length) {
                    const slot = slots[i];
                    const slotDate = new Date(slot.date);

                    if (slot.isBlocked) {
                        grouped.push({
                            id: slot.id,
                            title: slot.blockedNote || 'Indisponible',
                            start: slot.date,
                            backgroundColor: '#6b7280', // Gris pour bloqué
                            borderColor: '#4b5563',
                            textColor,
                            extendedProps: { isBooked: false, isBlocked: true, blockedNote: slot.blockedNote },
                        });
                        i++; continue;
                    }

                    if (!slot.isBooked) {
                        grouped.push({
                            id: slot.id,
                            title: 'Disponible',
                            start: slot.date,
                            backgroundColor: '#10b981',
                            borderColor: '#059669',
                            textColor,
                            extendedProps: { isBooked: false, isBlocked: false },
                        });
                        i++; continue;
                    }

                    // Slot réservé: regrouper les suivants contigus (30 min) appartenant au même rendez-vous
                    const apptId = slot.appointment?.id || `appt-${slot.id}`;
                    let end = new Date(slotDate.getTime() + 30 * 60000);
                    let j = i + 1;
                    while (j < slots.length) {
                        const next = slots[j];
                        if (!next.isBooked) break;
                        if ((next.appointment?.id || `appt-${next.id}`) !== apptId) break;
                        const nextDate = new Date(next.date);
                        const diffMin = (nextDate.getTime() - end.getTime() + 30 * 60000) / 60000; // simplified check
                        if (nextDate.getTime() === end.getTime()) {
                            end = new Date(end.getTime() + 30 * 60000);
                            j++;
                        } else {
                            break;
                        }
                    }

                    grouped.push({
                        id: apptId,
                        title: slot.appointment ? `Réservé (${slot.appointment.firstname})` : 'Réservé',
                        start: slot.date,
                        backgroundColor: '#f59e0b',
                        borderColor: '#d97706',
                        textColor,
                        extendedProps: { isBooked: true, isBlocked: false },
                    });
                    i = j;
                }

                setEvents(grouped);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des disponibilités:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailabilities();
    }, []);

    const handleEventClick = (info: any) => {
        const { title, extendedProps } = info.event as { title: string; extendedProps: { isBlocked?: boolean; blockedNote?: string | null; isBooked?: boolean } };

        if (extendedProps.isBlocked) {
            alert(`${title}\n\nCe créneau est indisponible.${extendedProps.blockedNote ? `\nRaison: ${extendedProps.blockedNote}` : ''}`);
        } else if (extendedProps.isBooked) {
            alert('Ce créneau est déjà réservé.');
        } else {
            alert('Ce créneau est disponible ! Remplissez le formulaire pour réserver.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-[#D4AF37]">Chargement du calendrier...</div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#1a1a1a] rounded-lg p-4 md:p-6">
            <div className="mb-4 flex gap-4 flex-wrap text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#10b981] rounded"></div>
                    <span className="text-gray-300">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#f59e0b] rounded"></div>
                    <span className="text-gray-300">Réservé (groupé)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#6b7280] rounded"></div>
                    <span className="text-gray-300">Bloqué</span>
                </div>
            </div>

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={frLocale}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                eventClick={handleEventClick}
                height="auto"
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                nowIndicator={true}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6], // Lundi à Samedi
                    startTime: '09:00',
                    endTime: '19:00',
                }}
                slotDuration="00:30:00"
                eventDisplay="block"
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                }}
            />

            <style jsx global>{`
        .fc {
          color: #e5e7eb;
        }
        .fc .fc-button {
          background-color: #D4AF37;
          border-color: #D4AF37;
          color: #0A0A0A;
          text-transform: capitalize;
        }
        .fc .fc-button:hover {
          background-color: #c19b2e;
          border-color: #c19b2e;
        }
        .fc .fc-button:disabled {
          background-color: #666;
          border-color: #666;
          opacity: 0.5;
        }
        .fc .fc-button-active {
          background-color: #c19b2e !important;
          border-color: #c19b2e !important;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #374151;
        }
        .fc-theme-standard .fc-scrollgrid {
          border-color: #374151;
        }
        .fc .fc-col-header-cell {
          background-color: #1f2937;
          color: #D4AF37;
          font-weight: 600;
        }
        .fc .fc-timegrid-slot {
          height: 3em;
        }
        .fc .fc-timegrid-slot-label {
          color: #9ca3af;
        }
        .fc .fc-daygrid-day-number {
          color: #e5e7eb;
        }
        .fc .fc-day-today {
          background-color: rgba(212, 175, 55, 0.1) !important;
        }
        .fc-event {
          cursor: pointer;
        }
        .fc-event:hover {
          opacity: 0.8;
        }
      `}</style>
        </div>
    );
}
