"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const Galerie = () => {
    const router = useRouter()

    const categories = [
        {
            id: 'tatouages',
            title: 'Tatouages',
            description: 'Nos créations en tatouage',
            image: '/galerie/tatouages/IMG_4461.JPEG'
        },
        {
            id: 'coiffure',
            title: 'Coiffures',
            description: 'Nos coupes et styles',
            image: '/galerie/coiffure/IMG_3723.JPEG'
        },
        {
            id: 'cils',
            title: 'Cils',
            description: 'Nos extensions de cils',
            image: '/galerie/cils/IMG_6112.JPEG'
        }
    ]

    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A] min-h-screen">
            <div className="w-full max-w-7xl px-4 py-16 sm:py-20">
                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-[#D4AF37] text-3xl sm:text-5xl font-bold mb-4">Galerie</h1>
                    <p className="text-gray-400 text-base sm:text-lg">Découvrez nos créations par catégorie</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => router.push(`/galerie/${category.id}`)}
                            className="group cursor-pointer"
                        >
                            <div className="relative overflow-hidden rounded-2xl border border-[#1F1F1F] hover:border-[#D4AF37] transition-all duration-300 h-64 sm:h-80 flex items-center justify-center bg-[#111]">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    priority
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/90 transition-all duration-300" />
                                <div className="relative z-10 text-center">
                                    <h2 className="text-[#D4AF37] text-2xl sm:text-3xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">{category.title}</h2>
                                    <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{category.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default Galerie