'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
    id: string;
    service: string;
    durationMin: number;
    price: number | null;
    description: string | null;
}

interface FormData {
    service: string;
    durationMin: number;
    price: string;
    description: string;
}

export default function AdminServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        service: 'COIFFURE',
        durationMin: 60,
        price: '',
        description: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/services?public=1');
            const data = await response.json();

            if (data.success) {
                setServices(data.services);
            } else {
                setError('Erreur lors du chargement des services');
            }
        } catch (err) {
            setError('Erreur lors du chargement des services');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'durationMin' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const payload = {
                service: formData.service,
                durationMin: formData.durationMin,
                price: formData.price ? parseInt(formData.price) : null,
                description: formData.description || null,
            };

            if (editingId) {
                // Modifier un service
                const response = await fetch(`/api/services/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    setSuccess('Service modifié avec succès');
                    fetchServices();
                    resetForm();
                } else {
                    const data = await response.json();
                    setError(data.error || 'Erreur lors de la modification');
                }
            } else {
                // Créer un nouveau service
                const response = await fetch('/api/services', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    setSuccess('Service créé avec succès');
                    fetchServices();
                    resetForm();
                } else {
                    const data = await response.json();
                    setError(data.error || 'Erreur lors de la création');
                }
            }
        } catch (err) {
            setError('Une erreur est survenue');
            console.error(err);
        }
    };

    const handleEdit = (service: Service) => {
        setFormData({
            service: service.service,
            durationMin: service.durationMin,
            price: service.price ? service.price.toString() : '',
            description: service.description || '',
        });
        setEditingId(service.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

        try {
            const response = await fetch(`/api/services/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSuccess('Service supprimé avec succès');
                fetchServices();
            } else {
                const data = await response.json();
                setError(data.error || 'Erreur lors de la suppression');
            }
        } catch (err) {
            setError('Erreur lors de la suppression');
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({
            service: 'COIFFURE',
            durationMin: 60,
            price: '',
            description: '',
        });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) {
        return (
            <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A]">
                <div className="text-[#D4AF37] text-xl">Chargement...</div>
            </main>
        );
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
                            <h1 className="text-xl sm:text-2xl font-bold text-[#D4AF37]">Gestion des Services</h1>
                            <p className="text-xs sm:text-sm text-gray-400">{services.length} service(s) total</p>
                        </div>
                        <button
                            onClick={() => !showForm ? setShowForm(true) : resetForm()}
                            className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                            {showForm ? 'Annuler' : '+ Ajouter'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Messages */}
            <section className="container mx-auto px-4 py-4 max-w-7xl w-full">
                {error && (
                    <div className="mb-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-900/30 border border-green-500 rounded-lg text-green-400">
                        {success}
                    </div>
                )}
            </section>

            {/* Formulaire */}
            {showForm && (
                <section className="container mx-auto px-4 py-4 max-w-7xl w-full">
                    <div className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-xl p-6 shadow-[0_6px_20px_rgba(0,0,0,0.25)]">
                        <h2 className="text-xl font-semibold text-[#D4AF37] mb-4">
                            {editingId ? 'Modifier le service' : 'Nouveau service'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Type de service */}
                                <div>
                                    <label className="block text-[#EAEAEA] mb-2">Type de service *</label>
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#0A0A0A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                                        required
                                    >
                                        <option value="COIFFURE">Coiffure</option>
                                        <option value="TATTOUAGE">Tatouage</option>
                                        <option value="PIERCING">Piercing</option>
                                        <option value="CILS">Cils</option>
                                    </select>
                                </div>

                                {/* Durée */}
                                <div>
                                    <label className="block text-[#EAEAEA] mb-2">Durée (minutes) *</label>
                                    <input
                                        type="number"
                                        name="durationMin"
                                        value={formData.durationMin}
                                        onChange={handleInputChange}
                                        min="15"
                                        step="15"
                                        className="w-full px-4 py-3 bg-[#0A0A0A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                                        required
                                    />
                                </div>

                                {/* Prix */}
                                <div>
                                    <label className="block text-[#EAEAEA] mb-2">Prix (optionnel)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-3 bg-[#0A0A0A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-[#EAEAEA] mb-2">Description (optionnel)</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#0A0A0A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                                >
                                    {editingId ? 'Modifier' : 'Créer'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}

            {/* Liste des services */}
            <section className="container mx-auto px-4 py-4 max-w-7xl w-full">
                {services.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">Aucun service disponible</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-xl p-6 shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
                            >
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-[#D4AF37] mb-2">
                                        {service.service}
                                    </h3>
                                    {service.description && (
                                        <p className="text-gray-400 text-sm mb-2">{service.description}</p>
                                    )}
                                    <div className="text-sm text-gray-300 space-y-1">
                                        <p>
                                            <span className="font-semibold">Durée:</span> {service.durationMin} min
                                        </p>
                                        {service.price && (
                                            <p>
                                                <span className="font-semibold">Prix:</span> {service.price} €
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
