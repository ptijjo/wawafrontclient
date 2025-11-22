"use client"

import React from 'react'
import { useForm } from 'react-hook-form'

type ReservationFormData = {
    nom: string
    prenom: string
    email: string
    telephone: string
    prestation: string
    date: string
    heure: string
    message?: string
}

const ReserveForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ReservationFormData>()

    const onSubmit = (data: ReservationFormData) => {
        console.log(data)
        // Logique de soumission du formulaire
    }

    const prestations = [
        "Coupe homme",
        "Coupe femme",
        "Coloration",
        "Décoloration",
        "Brushing",
        "Lissage brésilien",
        "Tatouage",
        "Soins du visage",
        "Soins des cheveux",
        "Autre"
    ]

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl bg-black/50 p-8 rounded-lg">
            <h2 className="text-[#D4AF37] text-3xl font-bold mb-6 text-center">Réserver un rendez-vous</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Nom */}
                <div>
                    <label className="block text-[#EAEAEA] mb-2">Nom *</label>
                    <input
                        {...register("nom", { required: "Le nom est requis" })}
                        className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                        placeholder="Votre nom"
                    />
                    {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
                </div>

                {/* Prénom */}
                <div>
                    <label className="block text-[#EAEAEA] mb-2">Prénom *</label>
                    <input
                        {...register("prenom", { required: "Le prénom est requis" })}
                        className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                        placeholder="Votre prénom"
                    />
                    {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom.message}</p>}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Email */}
                <div>
                    <label className="block text-[#EAEAEA] mb-2">Email *</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "L'email est requis",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Email invalide"
                            }
                        })}
                        className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                        placeholder="votre@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Téléphone */}
                <div>
                    <label className="block text-[#EAEAEA] mb-2">Téléphone *</label>
                    <input
                        type="tel"
                        {...register("telephone", {
                            required: "Le téléphone est requis",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Numéro invalide (10 chiffres)"
                            }
                        })}
                        className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                        placeholder="0612345678"
                    />
                    {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone.message}</p>}
                </div>
            </div>

            {/* Prestation */}
            <div className="mb-6">
                <label className="block text-[#EAEAEA] mb-2">Prestation *</label>
                <select
                    {...register("prestation", { required: "Veuillez sélectionner une prestation" })}
                    className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                >
                    <option value="">Sélectionnez une prestation</option>
                    {prestations.map((prestation) => (
                        <option key={prestation} value={prestation}>{prestation}</option>
                    ))}
                </select>
                {errors.prestation && <p className="text-red-500 text-sm mt-1">{errors.prestation.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Date */}
                <div>
                    <label className="block text-[#EAEAEA] mb-2">Date *</label>
                    <input
                        type="date"
                        {...register("date", { required: "La date est requise" })}
                        className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>

                {/* Heure */}
                <div>
                    <label className="block text-[#EAEAEA] mb-2">Heure *</label>
                    <input
                        type="time"
                        {...register("heure", { required: "L'heure est requise" })}
                        className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                    />
                    {errors.heure && <p className="text-red-500 text-sm mt-1">{errors.heure.message}</p>}
                </div>
            </div>

            {/* Message */}
            <div className="mb-6">
                <label className="block text-[#EAEAEA] mb-2">Message (optionnel)</label>
                <textarea
                    {...register("message")}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none resize-none"
                    placeholder="Des précisions sur votre demande..."
                />
            </div>

            {/* Bouton */}
            <button
                type="submit"
                className="w-full bg-[#D4AF37] text-black font-bold py-3 px-6 rounded hover:bg-[#B8941F] transition-all duration-300"
            >
                Réserver maintenant
            </button>
        </form>
    )
}

export default ReserveForm