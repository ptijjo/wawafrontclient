import React from 'react'

const Galerie = () => {
    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A]">
            <h1 className="text-[#D4AF37] text-3xl sm:text-5xl font-bold mb-8">Galerie</h1>
            <section className="w-full max-w-7xl px-4 pb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {/* Placeholder responsive grid; branch images to be added */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-[#1C1C1C] aspect-square rounded-lg" />
                    ))}
                </div>
            </section>
        </main>
    )
}

export default Galerie