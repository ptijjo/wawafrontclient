'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Service } from '@/interfaces';

// Interface pour les disponibilités tel que renvoyé par l'API
interface AvailabilityFromAPI {
    id: string;
    date: string; // L'API renvoie des dates en string (JSON)
}

// Interface pour les rendez-vous tel que renvoyé par l'API
interface AppointmentFromAPI {
    id: string;
    lastname: string;
    firstname: string;
    phone: string;
    email?: string | null;
    note?: string | null;
    createdAt: string; // L'API renvoie des dates en string (JSON)
    service: Service;
    availabilities: AvailabilityFromAPI[]; // Multi-slots
}

export default function AdminAppointmentsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [appointments, setAppointments] = useState<AppointmentFromAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentFromAPI | null>(null);
    const router = useRouter();

    const fetchAppointments = async () => {
        try {
            const response = await fetch('/api/appointments');
            const data = await response.json();

            if (data.success) {
                // Trier par date de création (plus récent en premier)
                const sorted = data.appointments.sort((a: AppointmentFromAPI, b: AppointmentFromAPI) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setAppointments(sorted);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des rendez-vous:', error);
        }
    };

    const checkAuthAndFetchData = useCallback(async () => {
        try {
            // Vérifier l'authentification
            const authResponse = await fetch('/api/auth/me');
            const authData = await authResponse.json();

            if (!authResponse.ok || !authData.success) {
                router.push('/admin');
                return;
            }

            setUser(authData.user);

            // Récupérer les rendez-vous
            await fetchAppointments();
        } catch (error) {
            console.error('Erreur:', error);
            router.push('/admin');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        checkAuthAndFetchData();
    }, [checkAuthAndFetchData]);



    const handleDeleteAppointment = async (appointmentId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/appointments/${appointmentId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                alert('Rendez-vous supprimé avec succès');
                setSelectedAppointment(null);
                await fetchAppointments();
            } else {
                alert('Erreur lors de la suppression : ' + data.error);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression du rendez-vous');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin');
        } catch (error) {
            console.error('Erreur de déconnexion:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getAppointmentTimeRange = (availabilities: AvailabilityFromAPI[]) => {
        if (availabilities.length === 0) return 'Non défini';

        const sorted = [...availabilities].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const start = formatTime(sorted[0].date);
        const endDate = new Date(sorted[sorted.length - 1].date);
        endDate.setMinutes(endDate.getMinutes() + 60); // Ajouter la durée du slot
        const end = endDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return `${start} - ${end}`;
    };

    if (loading) {
        return (
            <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A]">
                <div className="text-[#D4AF37] text-xl">Chargement...</div>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="flex flex-col grow items-center w-full bg-[#0A0A0A]">
            {/* Header */}
            <section className="bg-[#1a1a1a] border-b border-[#D4AF37]/20 sticky top-0 z-10 w-full">
                <div className="container mx-auto px-4 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center">
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="flex items-center gap-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] px-3 sm:px-4 py-2 rounded-lg transition-colors border border-[#D4AF37]/30 text-sm"
                        >
                            <span>←</span>
                            <span>Retour au dashboard</span>
                        </button>
                        <div className="text-left sm:text-center">
                            <h1 className="text-xl sm:text-2xl font-bold text-[#D4AF37]">Gestion des Rendez-vous</h1>
                            <p className="text-xs sm:text-sm text-gray-400">{appointments.length} rendez-vous total</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </section>

            {/* Contenu principal */}
            <section className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
                {appointments.length === 0 ? (
                    <div className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-xl p-8 text-center shadow-[0_6px_20px_rgba(0,0,0,0.25)]">
                        <p className="text-gray-400 text-lg">Aucun rendez-vous pour le moment</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-xl p-5 sm:p-6 shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:border-[#D4AF37]/40 transition-colors cursor-pointer"
                                onClick={() => setSelectedAppointment(appointment)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <h3 className="text-xl font-semibold text-[#D4AF37]">
                                                {appointment.firstname} {appointment.lastname}
                                            </h3>
                                            <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-sm">
                                                {appointment.service.service}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
                                            <div>
                                                <p className="text-sm text-gray-500">📞 Téléphone</p>
                                                <p className="font-medium">{appointment.phone}</p>
                                            </div>

                                            {appointment.email && (
                                                <div>
                                                    <p className="text-sm text-gray-500">📧 Email</p>
                                                    <p className="font-medium">{appointment.email}</p>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-sm text-gray-500">📅 Date</p>
                                                <p className="font-medium">
                                                    {appointment.availabilities.length > 0
                                                        ? formatDate(appointment.availabilities[0].date)
                                                        : 'Non défini'
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">🕐 Horaire</p>
                                                <p className="font-medium">
                                                    {getAppointmentTimeRange(appointment.availabilities)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">⏱️ Durée</p>
                                                <p className="font-medium">{appointment.service.durationMin} minutes</p>
                                            </div>

                                            {appointment.service.price && (
                                                <div>
                                                    <p className="text-sm text-gray-500">💰 Prix</p>
                                                    <p className="font-medium">{appointment.service.price} €</p>
                                                </div>
                                            )}
                                        </div>

                                        {appointment.note && (
                                            <div className="mt-3 p-3 bg-[#0a0a0a] rounded-lg border border-[#D4AF37]/10">
                                                <p className="text-sm text-gray-500 mb-1">💬 Note du client</p>
                                                <p className="text-gray-300">{appointment.note}</p>
                                            </div>
                                        )}

                                        <div className="mt-3 text-xs text-gray-500">
                                            Créé le {formatDateTime(appointment.createdAt)}
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAppointment(appointment.id);
                                        }}
                                        className="ml-4 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Modal de détails */}
            {selectedAppointment && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedAppointment(null)}
                >
                    <div
                        className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-[#D4AF37]">Détails du rendez-vous</h2>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Prénom</p>
                                    <p className="text-white font-medium">{selectedAppointment.firstname}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Nom</p>
                                    <p className="text-white font-medium">{selectedAppointment.lastname}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                                <p className="text-white font-medium">{selectedAppointment.phone}</p>
                            </div>

                            {selectedAppointment.email && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email</p>
                                    <p className="text-white font-medium">{selectedAppointment.email}</p>
                                </div>
                            )}

                            <div className="border-t border-[#D4AF37]/20 pt-4">
                                <p className="text-sm text-gray-500 mb-1">Service</p>
                                <p className="text-white font-medium text-lg">{selectedAppointment.service.service}</p>
                                {selectedAppointment.service.description && (
                                    <p className="text-gray-400 text-sm mt-1">{selectedAppointment.service.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Durée</p>
                                    <p className="text-white font-medium">{selectedAppointment.service.durationMin} min</p>
                                </div>
                                {selectedAppointment.service.price && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Prix</p>
                                        <p className="text-white font-medium">{selectedAppointment.service.price} €</p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-[#D4AF37]/20 pt-4">
                                <p className="text-sm text-gray-500 mb-2">Créneaux réservés</p>
                                <div className="space-y-2">
                                    {selectedAppointment.availabilities.map((avail) => (
                                        <div key={avail.id} className="bg-[#0a0a0a] rounded p-3 border border-[#D4AF37]/10">
                                            <p className="text-white">
                                                📅 {formatDate(avail.date)}
                                            </p>
                                            <p className="text-[#D4AF37] text-sm">
                                                🕐 {formatTime(avail.date)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedAppointment.note && (
                                <div className="border-t border-[#D4AF37]/20 pt-4">
                                    <p className="text-sm text-gray-500 mb-2">Note du client</p>
                                    <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#D4AF37]/10">
                                        <p className="text-white">{selectedAppointment.note}</p>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-[#D4AF37]/20 pt-4">
                                <p className="text-sm text-gray-500">Réservé le</p>
                                <p className="text-gray-400">{formatDateTime(selectedAppointment.createdAt)}</p>
                            </div>

                            <div className="border-t border-[#D4AF37]/20 pt-4">
                                <p className="text-sm text-gray-500 mb-1">ID du rendez-vous</p>
                                <p className="text-gray-400 text-xs font-mono">{selectedAppointment.id}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-semibold"
                            >
                                Supprimer ce rendez-vous
                            </button>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#B8941F] text-black py-3 rounded-lg transition-colors font-semibold"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
