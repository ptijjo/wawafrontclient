"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaArrowUp, FaLongArrowAltLeft } from 'react-icons/fa'

interface CategoryPageProps {
    params: Promise<{ category: string }>
}

const CategoryPage = ({ params }: CategoryPageProps) => {
    const router = useRouter()
    const [category, setCategory] = useState<string>('')
    const [images, setImages] = useState<string[]>([])
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        params.then(({ category }) => {
            setCategory(category)
            loadImages(category)
        })
    }, [params])

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const loadImages = async (categoryName: string) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/galerie/${categoryName}`)
            if (response.ok) {
                const data = await response.json()
                setImages(data.images || [])
            }
        } catch (error) {
            console.error('Erreur lors du chargement des images:', error)
        } finally {
            setLoading(false)
        }
    }

    const categoryTitles: Record<string, string> = {
        'tatouages': 'Tatouages',
        'coiffure': 'Coiffures',
        'cils': 'Cils'
    }

    const title = categoryTitles[category] || category

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A] min-h-screen">
            <div className="w-full max-w-7xl px-4 py-16 sm:py-20">
                {/* En-tête */}
                <div className="flex items-center gap-4 mb-12">
                    <button
                        onClick={() => router.back()}
                        className="text-[#D4AF37] hover:text-white transition-colors duration-200 text-2xl hover:cursor-pointer"
                    >
                        <FaLongArrowAltLeft />

                    </button>
                    <h1 className="text-[#D4AF37] text-3xl sm:text-5xl font-bold">{title}</h1>
                </div>

                {/* Galerie */}
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <p className="text-gray-400">Chargement des images...</p>
                    </div>
                ) : images.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className="group cursor-pointer relative aspect-square overflow-hidden rounded-lg border border-[#1F1F1F] hover:border-[#D4AF37] transition-all duration-300 bg-[#111]"
                                >
                                    <Image
                                        src={image}
                                        alt={`${title} ${index + 1}`}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-96">
                        <p className="text-gray-400">Aucune image disponible pour cette catégorie.</p>
                    </div>
                )}
            </div>

            {/* Bouton retour en haut */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-[#D4AF37] hover:bg-[#C49B2C] text-black rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl z-40 hover:cursor-pointer"
                    aria-label="Retour en haut"
                >
                    <FaArrowUp />

                </button>
            )}

            {/* Modal de l'image */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative w-full h-full max-w-6xl max-h-[95vh] rounded-2xl overflow-hidden flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/75 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 z-10"
                        >
                            ✕
                        </button>
                        <Image
                            src={selectedImage}
                            alt="Image agrandie"
                            fill
                            className="object-contain w-full h-full"
                            sizes="100vw"
                        />
                    </div>
                </div>
            )}
        </main>
    )
}

export default CategoryPage
