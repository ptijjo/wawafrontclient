/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from 'react'
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
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ReservationFormData>()
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = (data: ReservationFormData) => {
        console.log(data)
        // À compléter manuellement
    }

    const prestations = [
        // COIFFURE
        "Braids",
        "Cornrows braids/Stich braids",
        "Crochet braids",
        "Fausses locks",
        "Locks",
        "Passion twists",
        "Patras/Gros bébé",
        "Wings",
        "Tissage",
        "Vanilles",
        // TATOUAGES

        "Couverture",
        // PIERCING

        // CILS
        "Dépose complète",
        "Mixte",
        "Pose cils à cils",
        "Extensions cils volume russe - Naturel",
        "Extensions cils volume russe - Moyen",
        "Extensions cils volume russe - Très fourni",
    ]

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl sm:max-w-2xl bg-black/50 p-6 sm:p-8 rounded-lg">
            <h2 className="text-[#D4AF37] text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Réserver un rendez-vous</h2>

            {/* Messages de succès/erreur */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-lg text-green-400 text-center">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400 text-center">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
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
                disabled={isLoading}
                className="w-full bg-[#D4AF37] text-black font-bold py-3 px-6 rounded hover:bg-[#B8941F] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Réservation en cours...' : 'Réserver maintenant'}
            </button>
        </form>
    )
}

export default ReserveForm