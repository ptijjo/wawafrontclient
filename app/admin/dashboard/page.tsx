'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
}

export default function AdminDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [newAppointmentsCount, setNewAppointmentsCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me');
            const data = await response.json();

            if (response.ok && data.success) {
                setUser(data.user);
                // Récupérer le nombre de nouveaux rendez-vous
                await fetchNewAppointmentsCount();
            } else {
                // Non authentifié, rediriger vers la page de connexion
                router.push('/admin');
            }
        } catch (error) {
            console.error('Erreur de vérification:', error);
            router.push('/admin');
        } finally {
            setLoading(false);
        }
    };

    const fetchNewAppointmentsCount = async () => {
        try {
            const response = await fetch('/api/appointments');
            const data = await response.json();

            if (data.success) {
                // Compter les rendez-vous des dernières 24h
                const oneDayAgo = new Date();
                oneDayAgo.setDate(oneDayAgo.getDate() - 1);

                const newCount = data.appointments.filter((apt: { createdAt: string }) => {
                    const createdDate = new Date(apt.createdAt);
                    return createdDate > oneDayAgo;
                }).length;

                setNewAppointmentsCount(newCount);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des rendez-vous:', error);
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

    if (loading) {
        return (
            <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A] mt-15">
                <div className="text-[#D4AF37] text-xl">Chargement...</div>
            </main>
        );
    }

    if (!user) {
        return null; // Redirection en cours
    }

    return (
        <main className="flex flex-col grow items-center w-full bg-[#0A0A0A] mt-15">
            {/* Header */}
            <section className="bg-[#1a1a1a] border-b border-[#D4AF37]/20 w-full">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[#D4AF37]">Dashboard Admin</h1>
                        <p className="text-sm text-gray-400">
                            Bienvenue, {user.firstname} {user.lastname}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Notification cloche */}
                        <button
                            onClick={() => router.push('/admin/appointments')}
                            className="relative p-3 hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
                            title="Nouveaux rendez-vous"
                        >
                            <svg
                                className="w-6 h-6 text-[#D4AF37]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                            {newAppointmentsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {newAppointmentsCount > 9 ? '9+' : newAppointmentsCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </section>

            {/* Contenu principal */}
            <section className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card Rendez-vous */}
                    <div className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-[#D4AF37] mb-2">Rendez-vous</h2>
                        <p className="text-gray-400 mb-4">Gérer les rendez-vous clients</p>
                        <a
                            href="/admin/appointments"
                            className="inline-block bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold px-4 py-2 rounded transition-colors"
                        >
                            Accéder
                        </a>
                    </div>

                    {/* Card Disponibilités */}
                    <div className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-[#D4AF37] mb-2">Disponibilités</h2>
                        <p className="text-gray-400 mb-4">Gérer les créneaux horaires</p>
                        <a
                            href="/admin/availabilities"
                            className="inline-block bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold px-4 py-2 rounded transition-colors"
                        >
                            Accéder
                        </a>
                    </div>

                    {/* Card Services */}
                    <div className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-[#D4AF37] mb-2">Services</h2>
                        <p className="text-gray-400 mb-4">Gérer les services proposés</p>
                        <a
                            href="/admin/services"
                            className="inline-block bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold px-4 py-2 rounded transition-colors"
                        >
                            Accéder
                        </a>
                    </div>
                </div>

                {/* Info utilisateur */}
                <div className="mt-8 bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-[#D4AF37] mb-4">Informations du compte</h2>
                    <div className="space-y-2 text-gray-300">
                        <p><span className="font-semibold">Email:</span> {user.email}</p>
                        <p><span className="font-semibold">Nom:</span> {user.firstname} {user.lastname}</p>
                        <p><span className="font-semibold">ID:</span> {user.id}</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
