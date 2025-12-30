"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image"

const CoiffurePage = () => {
    const router = useRouter()

    const tarifs = [
        { nom: "Braids", prix: "À partir de 60 €", image: "/coiffures/braids.jpeg" },
        { nom: "Cornrows braids/stich braids", prix: "À partir de 30 €", image: "/coiffures/cornrows braids.jpeg" },
        { nom: "Crochet braids", prix: "À partir de 60 €", image: "" },
        { nom: "Fausses locks", prix: "À partir de 50 €", image: "" },
        { nom: "Locks", prix: "À partir de 200 €", image: "" },
        { nom: "Passion twists", prix: "À partir de 60 €", image: "" },
        { nom: "Patras/Gros bébé", prix: "À partir de 40 €", image: "" },
        { nom: "Wings", prix: "À partir de 25 €", image: "" },
        { nom: "Tissage", prix: "À partir de 50 €", image: "" },
        { nom: "Vanilles", prix: "À partir de 60 €", image: "" },

    ]

    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A]">
            <div className="w-full max-w-7xl px-4 py-16 sm:py-20 mb-12 sm:mb-20 lg:mb-32">
                <button
                    onClick={() => router.back()}
                    className="text-[#D4AF37] hover:text-white transition-colors duration-200 text-2xl mb-8"
                >
                    ← Retour
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-[#D4AF37] text-3xl sm:text-5xl font-bold mb-4">Coiffure - Tarifs détaillés</h1>
                    <p className="text-gray-400 text-base sm:text-lg">Découvrez tous nos services de coiffure</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {tarifs.map((tarif, index) => (
                        <div key={index} className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#1F1F1F] hover:border-[#D4AF37] transition-all duration-300 flex items-center gap-4">
                            <div className="relative overflow-hidden w-20 h-20 rounded-lg bg-green-500">
                                {tarif.image ? (
                                    <Image src={tarif.image} alt={tarif.nom} fill priority className="" />
                                ) : (
                                    <div className="w-full h-full bg-green-500" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">{tarif.nom}</h3>
                                <p className="text-gray-300 text-lg font-semibold">{tarif.prix}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default CoiffurePage
