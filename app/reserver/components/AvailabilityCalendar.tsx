'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import frLocale from '@fullcalendar/core/locales/fr';
import { SLOT_DURATION_MIN } from '@/config/schedule';

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
    const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('timeGridWeek');

    useEffect(() => {
        const fetchAvailabilities = async () => {
            try {
                setLoading(true);
                // Récupère un lot large (pagination) - sans autofill pour les clients
                const response = await fetch('/api/availabilities?page=1&pageSize=500');
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

                        // Slot réservé: regrouper les suivants contigus appartenant au même rendez-vous
                        const apptId = slot.appointment?.id || `appt-${slot.id}`;
                        let end = new Date(slotDate.getTime() + SLOT_DURATION_MIN * 60000);
                        let j = i + 1;
                        while (j < slots.length) {
                            const next = slots[j];
                            if (!next.isBooked) break;
                            if ((next.appointment?.id || `appt-${next.id}`) !== apptId) break;
                            const nextDate = new Date(next.date);
                            const diffMin = (nextDate.getTime() - end.getTime() + SLOT_DURATION_MIN * 60000) / 60000; // simplified check
                            if (nextDate.getTime() === end.getTime()) {
                                end = new Date(end.getTime() + SLOT_DURATION_MIN * 60000);
                                j++;
                            } else {
                                break;
                            }
                        }

                        grouped.push({
                            id: apptId,
                            title: 'Réservé',
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

        // Choisir une vue adaptée au mobile pour éviter le dépassement horizontal
        const updateView = () => {
            const w = window.innerWidth;
            if (w < 640) {
                setCalendarView('dayGridMonth');
            } else if (w < 1024) {
                setCalendarView('timeGridWeek');
            } else {
                setCalendarView('timeGridWeek');
            }
        };
        updateView();
        window.addEventListener('resize', updateView);
        
        // Écouter les événements de rafraîchissement du calendrier
        const handleRefresh = () => {
            fetchAvailabilities();
        };
        
        // Écouter l'événement personnalisé de création de rendez-vous
        window.addEventListener('appointment-created', handleRefresh);
        
        // Rafraîchir automatiquement toutes les 30 secondes
        const interval = setInterval(fetchAvailabilities, 30000);
        
        // Chargement initial
        fetchAvailabilities();
        
        return () => {
            window.removeEventListener('resize', updateView);
            window.removeEventListener('appointment-created', handleRefresh);
            clearInterval(interval);
        };
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
        <div className="w-full bg-[#1a1a1a] rounded-2xl p-3 sm:p-4 md:p-6 overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.35)] border border-[#D4AF37]/10">
            <div className="mb-4 flex gap-3 sm:gap-4 flex-wrap text-xs sm:text-sm">
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
                initialView={calendarView}
                locale={frLocale}
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: (typeof window !== 'undefined' && window.innerWidth < 640) ? 'today,dayGridMonth' : 'today,dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                eventClick={handleEventClick}
                height="auto"
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                nowIndicator={true}
                expandRows={true}
                contentHeight="auto"
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6], // Lundi à Samedi
                    startTime: '09:00',
                    endTime: '19:00',
                }}
                slotDuration={`00:${SLOT_DURATION_MIN.toString().padStart(2, '0')}:00`}
                eventDisplay="block"
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                }}
                titleFormat={{ year: 'numeric', month: 'long', day: (calendarView === 'timeGridDay' ? 'numeric' : undefined) }}
                buttonText={{
                    today: 'Aujourd\'hui',
                    month: 'Mois',
                    week: 'Semaine',
                    day: 'Jour'
                }}
                windowResizeDelay={50}
            />

            <style jsx global>{`
                .fc { color: #e5e7eb; min-width: 0; }
                .fc .fc-toolbar { align-items: center; padding: 0.25rem 0.25rem; }
                .fc .fc-toolbar-title { color: #D4AF37; font-weight: 700; }
                .fc .fc-button { background-color: #D4AF37; border-color: #D4AF37; color: #0A0A0A; text-transform: capitalize; border-radius: 0.5rem; }
                .fc .fc-button:hover { background-color: #c19b2e; border-color: #c19b2e; }
                .fc .fc-button:disabled { background-color: #666; border-color: #666; opacity: 0.5; }
                .fc .fc-button-active { background-color: #c19b2e !important; border-color: #c19b2e !important; }
                .fc-theme-standard td, .fc-theme-standard th { border-color: #2b2b2b; }
                .fc-theme-standard .fc-scrollgrid { border-color: #2b2b2b; }
                .fc .fc-col-header-cell, .fc .fc-daygrid-week-number, .fc .fc-daygrid-day-number { color: #D4AF37; }
                .fc .fc-daygrid-day-top { padding: 0.25rem 0.35rem; }
                .fc .fc-daygrid-day-number { font-weight: 600; }
                .fc .fc-daygrid-day-frame { background-color: #121212; }
                .fc .fc-day-today .fc-daygrid-day-frame { background-color: rgba(212, 175, 55, 0.12) !important; }
                .fc-event { cursor: pointer; border-radius: 0.5rem; padding: 0.125rem 0.25rem; }
                .fc-event:hover { opacity: 0.9; }
                .fc .fc-daygrid-event { margin: 2px 4px; }
                .fc .fc-timegrid-slot { height: 2.5em; }
                .fc .fc-timegrid-slot-label { color: #9ca3af; }
                .fc .fc-daygrid-day-number { color: #e5e7eb; }
                .fc .fc-day-today { background-color: rgba(212, 175, 55, 0.1) !important; }
                @media (max-width: 640px) {
                    .fc .fc-toolbar-title { font-size: 0.875rem; line-height: 1.25rem; }
                    .fc .fc-toolbar { flex-wrap: wrap; gap: 0.5rem; padding: 0.5rem 0.25rem; }
                    .fc .fc-button { padding: 0.5rem 0.75rem; font-size: 0.75rem; min-height: 36px; }
                    .fc .fc-daygrid-day { min-height: 80px; }
                    .fc .fc-daygrid-day-events { margin-top: 2px; }
                    .fc .fc-daygrid-day-number { font-size: 0.875rem; }
                    .fc .fc-col-header-cell { font-size: 0.75rem; padding: 0.5rem 0.25rem; }
                    .fc .fc-event { font-size: 0.75rem; padding: 0.125rem 0.25rem; }
                }
            `}</style>
        </div>
    );
}
