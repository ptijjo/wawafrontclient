"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

const CilsPage = () => {
    const router = useRouter()

    const tarifs = [
        { nom: "Dépose complète", prix: "25", remplissage: "" },
        { nom: "Mixte", prix: "70 €", remplissage: "50 €" },
        { nom: "Pose cils à cils", prix: "60 €", remplissage: "50 €" },
        { nom: "Extensions cils volume russe", options: [{ nom: 'Naturel', prix: "70 €", remplissage: "50 €" }, { nom: 'Moyen', prix: "80 €", remplissage: "50 €" }, { nom: 'Très fourni', prix: "90 €", remplissage: "50 €" }] },

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
                    <h1 className="text-[#D4AF37] text-3xl sm:text-5xl font-bold mb-4">Cils - Tarifs détaillés</h1>
                    <p className="text-gray-400 text-base sm:text-lg">Découvrez tous nos services de cils</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {tarifs.map((tarif, index) => (
                        <div key={index} className={`bg-[#1A1A1A] p-6 rounded-2xl border border-[#1F1F1F] hover:border-[#D4AF37] transition-all duration-300 flex flex-col ${tarif.nom === "Pose cils à cils" ? "h-[140px]" : "min-h-[140px]"}`}>
                            <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">{tarif.nom}</h3>
                            {tarif.options ? (
                                <div className="space-y-3">
                                    {tarif.options.map((option, optIndex) => (
                                        <div key={optIndex} className="bg-[#0A0A0A] p-3 rounded-lg">
                                            <p className="text-gray-300 font-semibold text-sm">{option.nom}</p>
                                            <p className="text-gray-400 text-xs">prix : {option.prix}</p>
                                            {option.remplissage && option.remplissage !== "" && (
                                                <p className="text-gray-400 text-xs">remplissage : {option.remplissage}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-300 text-sm font-semibold">prix : {tarif.prix}</p>
                                    {tarif.remplissage && tarif.remplissage !== "" && (
                                        <p className="text-gray-300 text-sm font-semibold">remplissage : {tarif.remplissage}</p>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <p className='text-red-500 mt-8'>*** Supplément de 10 € pour les cils de couleurs</p>
                <div className='flex flex-col w-full'>
                    <h4 className='text-white font-semibold items-center justify-center w-full flex mb-4 underline!'>Conditions et acomptes</h4>
                    <p className='text-white'>* Un acompte de 30 € est a réglé à l&apos;issu de la prise de rendez-vous. Il sera déduit du prix de la prestation choisie.</p>
                    <p className='text-white'>** Il est impératif d&apos;effectuer un remplissage au bout de 20 jours (3 semaines) suivant la pose. Passé ce délai, une dépose + pose complète vous sera imposée.</p>
                </div>
            </div>
        </main>
    )
}

export default CilsPage
