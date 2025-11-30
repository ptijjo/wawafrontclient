'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/interfaces';

interface AvailabilityFromAPI {
    id: string;
    date: string;
    isBooked: boolean;
    isBlocked: boolean;
    blockedNote?: string | null;
    createdAt: string;
    appointment?: {
        id: string;
        firstname: string;
        lastname: string;
    } | null;
}

export default function AdminAvailabilitiesPage() {
    const [user, setUser] = useState<User | null>(null);
    const [availabilities, setAvailabilities] = useState<AvailabilityFromAPI[]>([]);
    const [loading, setLoading] = useState(true);
    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(24);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockDate, setBlockDate] = useState('');
    const [blockNote, setBlockNote] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const fetchAvailabilities = async () => {
        try {
            const response = await fetch('/api/availabilities?pageSize=500');
            const data = await response.json();

            if (data.success) {
                // Trier par date
                const sorted = data.availabilities.sort((a: AvailabilityFromAPI, b: AvailabilityFromAPI) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                setAvailabilities(sorted);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des disponibilités:', error);
        }
    };

    const checkAuthAndFetchData = useCallback(async () => {
        try {
            const authResponse = await fetch('/api/auth/me');
            const authData = await authResponse.json();

            if (!authResponse.ok || !authData.success) {
                router.push('/admin');
                return;
            }

            setUser(authData.user);
            await fetchAvailabilities();
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

    // Reset to first page if dataset changes
    useEffect(() => {
        setPage(1);
    }, [availabilities.length]);

    const handleGenerateSlots = async () => {
        if (!confirm('Générer automatiquement les créneaux pour les 3 prochains mois ?')) {
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch('/api/availabilities?autofill=1&months=3');
            const data = await response.json();

            if (data.success) {
                alert(`${data.autofill?.created || 0} créneaux générés avec succès !`);
                await fetchAvailabilities();
            } else {
                alert('Erreur lors de la génération des créneaux');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la génération des créneaux');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleBlockDay = async () => {
        if (!blockDate) {
            alert('Veuillez sélectionner une date');
            return;
        }

        try {
            const response = await fetch('/api/availabilities/block-day', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: blockDate,
                    note: blockNote || 'Indisponible',
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert(`${data.blocked} créneau(x) bloqué(s) avec succès`);
                setShowBlockModal(false);
                setBlockDate('');
                setBlockNote('');
                await fetchAvailabilities();
            } else {
                alert('Erreur : ' + data.error);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du blocage de la journée');
        }
    };

    const handleDeleteAvailability = async (id: string) => {
        if (!confirm('Supprimer cette disponibilité ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/availabilities/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                alert('Disponibilité supprimée');
                await fetchAvailabilities();
            } else {
                alert('Erreur : ' + data.error);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const handleUnblock = async (id: string) => {
        try {
            const response = await fetch(`/api/availabilities/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isBlocked: false,
                    blockedNote: null,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert('Créneau débloqué');
                await fetchAvailabilities();
            } else {
                alert('Erreur : ' + data.error);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du déblocage');
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
            weekday: 'short',
            year: 'numeric',
            month: 'short',
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

    const getStatusBadge = (availability: AvailabilityFromAPI) => {
        if (availability.isBlocked) {
            return <span className="px-2 py-1 bg-gray-600 text-white rounded text-xs">Bloqué</span>;
        }
        if (availability.isBooked) {
            return <span className="px-2 py-1 bg-orange-600 text-white rounded text-xs">Réservé</span>;
        }
        return <span className="px-2 py-1 bg-green-600 text-white rounded text-xs">Disponible</span>;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                <div className="text-[#D4AF37] text-xl">Chargement...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const availableCount = availabilities.filter(a => !a.isBooked && !a.isBlocked).length;
    const bookedCount = availabilities.filter(a => a.isBooked).length;
    const blockedCount = availabilities.filter(a => a.isBlocked).length;

    // Compute pagination
    const totalItems = availabilities.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const pagedAvailabilities = availabilities.slice(startIndex, endIndex);

    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A]">
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
                            <h1 className="text-xl sm:text-2xl font-bold text-[#D4AF37]">Gestion des Disponibilités</h1>
                            <p className="text-xs sm:text-sm text-gray-400">
                                {availableCount} disponibles • {bookedCount} réservés • {blockedCount} bloqués
                            </p>
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

            {/* Actions */}
            <section className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="flex gap-4 flex-wrap">
                    <button
                        onClick={handleGenerateSlots}
                        disabled={isGenerating}
                        className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
                    >
                        {isGenerating ? 'Génération...' : '✨ Générer des créneaux'}
                    </button>
                    <button
                        onClick={() => setShowBlockModal(true)}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-[0_6px_20px_rgba(0,0,0,0.2)]"
                    >
                        🚫 Bloquer une journée
                    </button>
                    <div className="flex items-center gap-2 ml-auto">
                        <label className="text-xs text-gray-400">Par page</label>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="px-3 py-2 bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-lg text-white text-sm"
                        >
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={36}>36</option>
                            <option value={48}>48</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Liste des disponibilités */}
            <section className="container mx-auto px-4 pb-8 max-w-7xl">
                {availabilities.length === 0 ? (
                    <div className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-xl p-8 text-center shadow-[0_6px_20px_rgba(0,0,0,0.25)]">
                        <p className="text-gray-400 text-lg mb-4">Aucune disponibilité</p>
                        <button
                            onClick={handleGenerateSlots}
                            className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Générer des créneaux
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {pagedAvailabilities.map((availability) => (
                                <div
                                    key={availability.id}
                                    className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-xl p-4 shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:border-[#D4AF37]/40 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-white font-medium">{formatDate(availability.date)}</p>
                                            <p className="text-[#D4AF37] text-lg font-bold">{formatTime(availability.date)}</p>
                                        </div>
                                        {getStatusBadge(availability)}
                                    </div>

                                    {availability.isBlocked && availability.blockedNote && (
                                        <div className="mb-3 p-2 bg-[#0a0a0a] rounded-lg border border-gray-700">
                                            <p className="text-xs text-gray-500 mb-1">Raison</p>
                                            <p className="text-gray-300 text-sm">{availability.blockedNote}</p>
                                        </div>
                                    )}

                                    {availability.appointment && (
                                        <div className="mb-3 p-2 bg-[#0a0a0a] rounded-lg border border-orange-900">
                                            <p className="text-xs text-gray-500 mb-1">Réservé par</p>
                                            <p className="text-orange-300 text-sm">
                                                {availability.appointment.firstname} {availability.appointment.lastname}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        {availability.isBlocked && (
                                            <button
                                                onClick={() => handleUnblock(availability.id)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded transition-colors"
                                            >
                                                Débloquer
                                            </button>
                                        )}
                                        {!availability.isBooked && (
                                            <button
                                                onClick={() => handleDeleteAvailability(availability.id)}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded transition-colors"
                                            >
                                                Supprimer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-xs sm:text-sm text-gray-400">
                                Affichage {startIndex + 1}–{endIndex} sur {totalItems}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] bg-[#0a0a0a] disabled:opacity-40"
                                >
                                    ← Précédent
                                </button>
                                <span className="text-xs sm:text-sm text-gray-400">
                                    Page {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] bg-[#0a0a0a] disabled:opacity-40"
                                >
                                    Suivant →
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {/* Modal de blocage de journée */}
            {showBlockModal && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowBlockModal(false)}
                >
                    <div
                        className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Bloquer une journée</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Date à bloquer
                                </label>
                                <input
                                    type="date"
                                    value={blockDate}
                                    onChange={(e) => setBlockDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Raison (optionnel)
                                </label>
                                <input
                                    type="text"
                                    value={blockNote}
                                    onChange={(e) => setBlockNote(e.target.value)}
                                    placeholder="Ex: Vacances, Jour férié..."
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setShowBlockModal(false)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleBlockDay}
                                className="flex-1 bg-[#D4AF37] hover:bg-[#B8941F] text-black py-3 rounded-lg transition-colors font-semibold"
                            >
                                Bloquer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
