'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Rediriger vers le dashboard admin
                router.push('/admin/dashboard');
            } else {
                setError(data.error || 'Erreur de connexion');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A]">
            <div className="w-full max-w-md">
                {/* Logo/Titre */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2">
                        Administration
                    </h1>
                    <p className="text-gray-400">Espace réservé aux administrateurs</p>
                </div>

                {/* Formulaire de connexion */}
                <div className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-lg p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Adresse email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                                placeholder="admin@example.com"
                                disabled={loading}
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        {/* Message d'erreur */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Bouton de connexion */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    {/* Lien retour */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-[#D4AF37] hover:text-[#B8941F] transition-colors"                        >
                            ← Retour à l&apos;accueil
                        </Link>
                    </div>
                </div>

                {/* Note de sécurité */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Accès sécurisé réservé au personnel autorisé
                    </p>
                </div>
            </div>
        </main>
    );
}
