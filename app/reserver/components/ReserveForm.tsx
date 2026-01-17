
"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

type ReservationFormData = {
    lastname: string
    firstname: string
    email: string
    phone: string
    serviceId: string
    startAvailabilityId: string
    note?: string
}

interface Service {
    id: string
    service: string
    durationMin: number
    price?: number | null
    description?: string | null
}

interface Availability {
    id: string
    date: string
    isBooked: boolean
    isBlocked: boolean
}

const ReserveForm = () => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ReservationFormData>()
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [services, setServices] = useState<Service[]>([])
    const [availabilities, setAvailabilities] = useState<Availability[]>([])
    const [loadingServices, setLoadingServices] = useState(false)
    const [loadingAvailabilities, setLoadingAvailabilities] = useState(false)

    const selectedServiceId = watch('serviceId')

    // Récupérer les services au chargement
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoadingServices(true)
                const response = await fetch('/api/services?public=1')
                if (response.ok) {
                    const data = await response.json()
                    console.log('Services reçus:', data)
                    setServices(data.services || [])
                    if (!data.services || data.services.length === 0) {
                        setErrorMessage('Aucun service disponible')
                    }
                } else {
                    const errorData = await response.json()
                    console.error('Erreur API:', errorData)
                    setErrorMessage('Erreur lors du chargement des services: ' + (errorData.error || response.statusText))
                }
            } catch (error) {
                console.error('Erreur:', error)
                setErrorMessage('Erreur lors du chargement des services: ' + (error instanceof Error ? error.message : 'Unknown error'))
            } finally {
                setLoadingServices(false)
            }
        }
        fetchServices()
    }, [])

    // Récupérer les disponibilités quand un service est sélectionné
    useEffect(() => {
        if (!selectedServiceId) {
            setAvailabilities([])
            return
        }

        const fetchAvailabilities = async () => {
            try {
                setLoadingAvailabilities(true)
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                // Générer les créneaux pour les 3 prochains mois
                const response = await fetch(`/api/availabilities?autofill=0&fromDate=${today.toISOString()}&isBooked=false&isBlocked=false&pageSize=500`)
                if (response.ok) {
                    const data = await response.json()
                    // Filtrer les créneaux non bloqués et non réservés, et à partir d'aujourd'hui
                    const available = (data.availabilities || []).filter(
                        (slot: Availability) => !slot.isBlocked && !slot.isBooked && new Date(slot.date) >= today
                    )
                    setAvailabilities(available)
                    setErrorMessage('')
                } else {
                    setErrorMessage('Erreur lors du chargement des créneaux')
                }
            } catch (error) {
                console.error('Erreur:', error)
                setErrorMessage('Erreur lors du chargement des créneaux')
            } finally {
                setLoadingAvailabilities(false)
            }
        }

        // Récupérer immédiatement
        fetchAvailabilities()

        // Rafraîchir les créneaux toutes les 30 secondes
        const interval = setInterval(fetchAvailabilities, 30000)

        return () => clearInterval(interval)
    }, [selectedServiceId])

    const onSubmit = async (data: ReservationFormData) => {
        try {
            setIsLoading(true)
            setErrorMessage('')
            setSuccessMessage('')

            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lastname: data.lastname,
                    firstname: data.firstname,
                    email: data.email || null,
                    phone: data.phone,
                    serviceId: data.serviceId,
                    startAvailabilityId: data.startAvailabilityId,
                    note: data.note || null,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erreur lors de la création du rendez-vous')
            }

            await response.json()
            setSuccessMessage('Rendez-vous créé avec succès ! Vous recevrez une confirmation par email.')
            reset()

            // Recharger les créneaux pour refleter la réservation
            if (selectedServiceId) {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const availResponse = await fetch(`/api/availabilities?autofill=0&fromDate=${today.toISOString()}&isBooked=false&isBlocked=false&pageSize=500`)
                if (availResponse.ok) {
                    const availData = await availResponse.json()
                    const available = (availData.availabilities || []).filter(
                        (slot: Availability) => !slot.isBlocked && !slot.isBooked && new Date(slot.date) >= today
                    )
                    setAvailabilities(available)
                }
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Une erreur est survenue'
            setErrorMessage(errorMsg)
            console.error('Erreur:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Grouper et formater les disponibilités par date
    const groupedAvailabilities = availabilities.reduce((acc: { [key: string]: Availability[] }, slot) => {
        const date = new Date(slot.date).toLocaleDateString('fr-FR')
        if (!acc[date]) {
            acc[date] = []
        }
        acc[date].push(slot)
        return acc
    }, {})

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl sm:max-w-2xl bg-black/50 p-4 sm:p-6 md:p-8 rounded-lg">
            <h2 className="text-[#D4AF37] text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">Réserver un rendez-vous</h2>

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
                        {...register("lastname", { required: "Le nom est requis" })}
                        className="w-full px-4 py-3.5 min-h-[44px] bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none text-base"
                        placeholder="Votre nom"
                    />
                    {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>}
                </div>

                {/* Prénom */}
                <div>
                    <label className="block text-[#EAEAEA] mb-2">Prénom *</label>
                    <input
                        {...register("firstname", { required: "Le prénom est requis" })}
                        className="w-full px-4 py-3.5 min-h-[44px] bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none text-base"
                        placeholder="Votre prénom"
                    />
                    {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>}
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
                        className="w-full px-4 py-3.5 min-h-[44px] bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none text-base"
                        placeholder="votre@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Téléphone */}
                <div>
                    <label className="block text-[#EAEAEA] mb-2">Téléphone *</label>
                    <input
                        type="tel"
                        {...register("phone", {
                            required: "Le téléphone est requis",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Numéro invalide (10 chiffres)"
                            }
                        })}
                        className="w-full px-4 py-3.5 min-h-[44px] bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none text-base"
                        placeholder="0612345678"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
            </div>

            {/* Service */}
            <div className="mb-6">
                <label className="block text-[#EAEAEA] mb-2">Prestation *</label>
                {loadingServices ? (
                    <div className="text-gray-400">Chargement des prestations...</div>
                ) : (
                    <select
                        {...register("serviceId", { required: "Veuillez sélectionner une prestation" })}
                        className="w-full px-4 py-3.5 min-h-[44px] bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none text-base"
                    >
                        <option value="">Sélectionnez une prestation</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.service} - {service.description}
                            </option>
                        ))}
                    </select>
                )}
                {errors.serviceId && <p className="text-red-500 text-sm mt-1">{errors.serviceId.message}</p>}
            </div>

            {/* Créneau */}
            <div className="mb-6">
                <label className="block text-[#EAEAEA] mb-2">Créneau disponible *</label>
                {!selectedServiceId ? (
                    <div className="text-gray-400 text-sm">Sélectionnez d&apos;abord une prestation</div>
                ) : loadingAvailabilities ? (
                    <div className="text-gray-400 text-sm">Chargement des créneaux...</div>
                ) : availabilities.length === 0 ? (
                    <div className="text-gray-400 text-sm">Aucun créneau disponible pour cette prestation</div>
                ) : (
                    <select
                        {...register("startAvailabilityId", { required: "Veuillez sélectionner un créneau" })}
                        className="w-full px-4 py-3.5 min-h-[44px] bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none text-base"
                    >
                        <option value="">Sélectionnez un créneau</option>
                        {Object.entries(groupedAvailabilities).map(([date, slots]) => (
                            <optgroup key={date} label={date}>
                                {slots.map((slot) => (
                                    <option key={slot.id} value={slot.id}>
                                        {new Date(slot.date).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                )}
                {errors.startAvailabilityId && <p className="text-red-500 text-sm mt-1">{errors.startAvailabilityId.message}</p>}
            </div>

            {/* Message */}
            <div className="mb-6">
                <label className="block text-[#EAEAEA] mb-2">Message (optionnel)</label>
                <textarea
                    {...register("note")}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none resize-none text-base min-h-[100px]"
                    placeholder="Des précisions sur votre demande..."
                />
            </div>

            {/* Bouton */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#D4AF37] text-black font-bold py-3.5 px-6 min-h-[48px] rounded hover:bg-[#B8941F] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-base"
            >
                {isLoading ? 'Réservation en cours...' : 'Réserver maintenant'}
            </button>
        </form>
    )
}

export default ReserveForm