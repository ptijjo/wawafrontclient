import Image from "next/image";

const Services = () => {
    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A] mt-15">
            <h1 className=" text-[#D4AF37] text-5xl font-bold mb-8">Nos Services</h1>
            <section className="flex flex-row flex-wrap  gap-8 items-center justify-around w-full max-w-7xl px-4 py-12">
                <div className="flex flex-row flex-wrap items-center justify-center gap-8 w-full"></div>
                {/* Bloc 1 */}
                <div className="flex flex-col items-center text-center w-full sm:w-1/2 md:w-1/4 lg:w-1/4 bg-[#1A1A1A] p-4 rounded-2xl hover:scale-105 transition-transform hover:border-[#F5D76E] border">
                    <div className="relative rounded-2xl shadow-lg mb-4 w-full h-48 overflow-hidden flex items-center justify-center">
                        <Image src="/images/image11.png" alt="Expérience complète" fill priority sizes="800" className="object-cover" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">COIFFURE FEMME</h3>
                    <p className="text-gray-300 text-sm">Tresses, nattes, perruques ...</p>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">2500 €</h3>
                </div>
                {/* Bloc 2 */}
                <div className="flex flex-col items-center text-center w-full sm:w-1/2 md:w-1/4 lg:w-1/4 bg-[#1A1A1A] p-4 rounded-2xl hover:scale-105 transition-transform hover:border-[#F5D76E] border ">
                    <div className="relative rounded-2xl shadow-lg mb-4 w-full h-48 overflow-hidden flex items-center justify-center">
                        <Image src="/images/image11.png" alt="Expérience complète" fill priority sizes="800" className="object-cover" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">COIFFURE HOMME</h3>
                    <p className="text-gray-300 text-sm">Tresses, nattes, dégradés ...</p>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">1500 €</h3>
                </div>
                {/* Bloc 3 */}
                <div className="flex flex-col items-center text-center w-full sm:w-1/2 md:w-1/4 lg:w-1/4    bg-[#1A1A1A] p-4 rounded-2xl  hover:scale-105 transition-transform hover:border-[#F5D76E] border">
                    <div className="relative rounded-2xl shadow-lg mb-4 w-full h-48 overflow-hidden flex items-center justify-center">
                        <Image src="/images/image11.png" alt="Expérience complète" fill priority sizes="800" className="object-cover" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">ENFANTS</h3>
                    <p className="text-gray-300 text-sm">Coiffures filles et garçons</p>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">1500 €</h3>
                </div>
                {/* Bloc 4 */}
                <div className="flex flex-col items-center text-center w-full sm:w-1/2 md:w-1/4 lg:w-1/4    bg-[#1A1A1A] p-4 rounded-2xl  hover:scale-105 transition-transform hover:border-[#F5D76E] border">
                    <div className="relative rounded-2xl shadow-lg mb-4 w-full h-48 overflow-hidden flex items-center justify-center">
                        <Image src="/images/image11.png" alt="Expérience complète" fill priority sizes="800" className="object-cover" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">TATOUAGES</h3>
                    <p className="text-gray-300 text-sm">Tatouages au henné ou permanents</p>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">A partir de 2500 €</h3>
                </div>
                {/* Bloc 5 */}
                <div className="flex flex-col items-center text-center w-full sm:w-1/2 md:w-1/4 lg:w-1/4    bg-[#1A1A1A] p-4 rounded-2xl  hover:scale-105 transition-transform hover:border-[#F5D76E] border">
                    <div className="relative rounded-2xl shadow-lg mb-4 w-full h-48 overflow-hidden flex items-center justify-center">
                        <Image src="/images/image11.png" alt="Expérience complète" fill priority sizes="800" className="object-cover" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">MANICURE</h3>
                    <p className="text-gray-300 text-sm">Griffes toutes couleurs</p>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">2500 €</h3>
                </div>
                {/* Bloc 6 */}
                <div className="flex flex-col items-center text-center w-full sm:w-1/2 md:w-1/4 lg:w-1/4    bg-[#1A1A1A] p-4 rounded-2xl  hover:scale-105 transition-transform hover:border-[#F5D76E] border">
                    <div className="relative rounded-2xl shadow-lg mb-4 w-full h-48 overflow-hidden flex items-center justify-center">
                        <Image src="/images/image11.png" alt="Expérience complète" fill priority sizes="800" className="object-cover" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">SOINS DU VISAGES</h3>
                    <p className="text-gray-300 text-sm">Ecailles de dragon, peau de serpent ....</p>
                    <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">2500 €</h3>
                </div>
            </section>
        </main>
    )
}

export default Services