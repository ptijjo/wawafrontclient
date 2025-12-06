"use client"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function Home() {
  const router = useRouter();
  const carouselImages = [
    "/caroussel/0b83f5db-118f-4af0-ac11-4a847e7cc7f7.jpg",
    "/caroussel/IMG_1847.JPEG",
    "/caroussel/IMG_2011.JPEG",
    "/caroussel/IMG_3963.JPEG",
    "/caroussel/IMG_4436.JPEG",
    "/caroussel/IMG_4807.JPEG",
    "/caroussel/IMG_4810.JPEG",
    "/caroussel/IMG_5076.JPG",
    "/caroussel/IMG_5287.JPEG",
    "/caroussel/IMG_7031.JPEG",
    "/caroussel/IMG_7158.JPEG",
    "/caroussel/IMG_8415.JPEG",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!carouselImages.length) return;
    const intervalId = setInterval(() => {
      setIsAnimating(true);
    }, 3500);

    const updateId = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
      setIsAnimating(false);
    }, 3500);

    return () => {
      clearInterval(intervalId);
      clearInterval(updateId);
    };
  }, [carouselImages.length]);

  const totalImages = carouselImages.length;
  const prevIndex = totalImages ? (currentImageIndex - 1 + totalImages) % totalImages : 0;
  const nextIndex = totalImages ? (currentImageIndex + 1) % totalImages : 0;

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

      {/* Carrousel créations */}
      <section className="w-full bg-linear-to-b from-black via-[#0A0A0A] to-black py-16 px-4 sm:px-8 md:px-20">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <div className="flex items-center justify-center w-full">
            <div className="text-center">
              {/* <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Nos réalisations</p> */}
              <h2 className="text-[#D4AF37] text-2xl sm:text-3xl md:text-4xl font-bold">Quelques créations signées WavaBANGS</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.6fr_1fr] gap-4 sm:gap-6 items-center">
            {/* Image précédente (miniature) */}
            <div className="relative h-40 sm:h-64 overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#111] flex items-center justify-center opacity-80">
              {totalImages > 0 ? (
                <Image
                  key={`prev-${currentImageIndex}`}
                  src={carouselImages[prevIndex]}
                  alt="Création précédente WavaBANGS"
                  fill
                  sizes="33vw"
                  priority
                  className={`object-contain object-center ${isAnimating ? 'carousel-prev' : ''}`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                  Aucune image disponible.
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-black/10 to-transparent" />
            </div>

            {/* Image active (grande) */}
            <div className="relative h-[220px] sm:h-80 md:h-[420px] overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#111]
                            shadow-[0_10px_40px_rgba(0,0,0,0.35)] flex items-center justify-center">
              {totalImages > 0 ? (
                <Image
                  key={`current-${currentImageIndex}`}
                  src={carouselImages[currentImageIndex]}
                  alt="Création WavaBANGS"
                  fill
                  sizes="60vw"
                  priority
                  className={`object-contain object-center ${isAnimating ? 'carousel-current' : ''}`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                  Aucune image disponible pour le moment.
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
            </div>

            {/* Image suivante (miniature) */}
            <div className="relative h-40 sm:h-64 overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#111] flex items-center justify-center opacity-80">
              {totalImages > 0 ? (
                <Image
                  key={`next-${currentImageIndex}`}
                  src={carouselImages[nextIndex]}
                  alt="Création suivante WavaBANGS"
                  fill
                  sizes="33vw"
                  priority
                  className={`object-contain object-center ${isAnimating ? 'carousel-next' : ''}`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                  Aucune image disponible.
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-black/10 to-transparent" />
            </div>
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
