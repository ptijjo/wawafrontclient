"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

const TatouagesPage = () => {
    const router = useRouter()

    const tarifs = [
        { nom: "Petit tatouage (< 5cm)", prix: "À partir de 25 €" },
        { nom: "Tatouage moyen (5-10cm)", prix: "À partir de 50 €" },
        { nom: "Tatouage grand (10-20cm)", prix: "À partir de 80 €" },
        { nom: "Tatouage très grand (> 20cm)", prix: "Sur devis" },
        { nom: "Tatouage henné - petit", prix: "À partir de 20 €" },
        { nom: "Tatouage henné - moyen", prix: "À partir de 35 €" },
        { nom: "Retouche/Correction", prix: "À partir de 20 €" },
        { nom: "Couverture", prix: "Sur devis" },
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
                    <h1 className="text-[#D4AF37] text-3xl sm:text-5xl font-bold mb-4">Tatouages - Tarifs détaillés</h1>
                    <p className="text-gray-400 text-base sm:text-lg">Découvrez tous nos services de tatouage</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {tarifs.map((tarif, index) => (
                        <div key={index} className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#1F1F1F] hover:border-[#D4AF37] transition-all duration-300">
                            <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">{tarif.nom}</h3>
                            <p className="text-gray-300 text-lg font-semibold">{tarif.prix}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default TatouagesPage
