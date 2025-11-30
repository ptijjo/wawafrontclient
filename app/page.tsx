"use client"
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A]">

      {/* Bannière principale */}
      <section
        className="relative flex flex-col md:flex-row items-center justify-between w-full h-auto md:h-[600px] bg-cover bg-center"
        style={{ backgroundImage: "url('/bg/bg_Home.png')", backgroundRepeat: 'no-repeat', backgroundPosition: 'center 0%', backgroundSize: 'cover' }}
      >
        {/* Overlay sombre pour un contraste harmonieux */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Contenu principal */}
        <div className="relative z-10 flex flex-col items-center md:items-start justify-center text-center md:text-left px-4 sm:px-6 md:px-20 py-16 md:py-0 w-full md:w-1/2">
          <h1 className="text-[#D4AF37] text-3xl sm:text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 md:mb-8">
            RÉVÉLEZ<br />VOTRE<br />ÉCLAT<br />NATUREL
          </h1>
          <button className="border border-[#D4AF37] text-[#D4AF37] px-5 sm:px-6 py-3 uppercase tracking-wider rounded hover:bg-[#D4AF37] hover:text-black transition-all duration-300" onClick={() => router.push('/reserver')}>
            Réservez maintenant
          </button>
        </div>
      </section>

      {/* pourquoi nous choisir et illusstration photo */}
      <section className="bg-black text-white py-12 sm:py-16 px-4 sm:px-8 md:px-20">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-[#D4AF37]">
            Pourquoi choisir <span className="text-white">WavaBANGS</span> ?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Bloc 1 */}
          <div className="flex flex-col items-center text-center w-full">
            <div className="relative rounded-2xl shadow-lg mb-4 w-full h-48 overflow-hidden flex items-center justify-center">
              <Image src="/images/image11.png" alt="Expérience complète" fill priority sizes="800" className="object-cover object-[center_18%]" />
            </div>
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">Une expérience complète</h3>
            <p className="text-gray-300 text-sm">Coiffure, tatouage et soins réunis pour révéler votre éclat naturel.</p>
          </div>

          {/* Bloc 2 */}
          <div className="flex flex-col items-center text-center w-full">
            <div className="relative rounded-2xl shadow-lg mb-4 w-full h-48 overflow-hidden">
              <Image src="/images/image3.png" alt="Espace d'expression" fill priority sizes="800" className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">Un espace d&apos;expression</h3>
            <p className="text-gray-300 text-sm">Votre style, votre identité — ici, la beauté devient art.</p>
          </div>

          {/* Bloc 3 */}
          <div className="flex flex-col items-center text-center w-full">
            <div className="relative rounded-2xl shadow-lg mb-4 w-full h-48 overflow-hidden flex items-center justify-center">
              <Image src="/images/image2.png" alt="Experts passionnés" fill priority sizes="800" className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">Des experts passionnés</h3>
            <p className="text-gray-300 text-sm">Un savoir-faire unique au service de votre singularité.</p>
          </div>

          {/* Bloc 4 */}
          <div className="flex flex-col items-center text-center w-full">
            <div className="relative rounded-2xl shadow-lg mb-4 object-cover w-full h-48 overflow-hidden">
              <Image src="/images/image4.png" alt="Atmosphère unique" fill priority sizes="800" />
            </div>
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">Une atmosphère unique</h3>
            <p className="text-gray-300 text-sm">Un lieu raffiné où chaque instant devient une expérience.</p>
          </div>
        </div>
      </section>


      {/* Avis des clients */}
      <section>
        <div className="flex flex-col w-full items-center px-4 md:px-20 mb-12 sm:mb-16">
          <h2 className="text-[#D4AF37] text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10 text-center">Ce que disent nos clients</h2>
          <div className="w-full min-h-48 sm:h-72 md:h-96 bg-[#1C1C1C] rounded-lg mt-6 sm:mt-10 mb-12 sm:mb-20 text-white p-4">Zone avis clients</div>
        </div>
      </section>

    </main >
  );
}
