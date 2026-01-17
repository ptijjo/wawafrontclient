import Image from "next/image";
import Link from "next/link";

const ServiceCard = ({ title, desc, price, img, href }: { title: string; desc: string; price: string; img: string; href: string }) => (
    <Link href={href}>
        <div className="flex flex-col items-center text-center bg-[#1A1A1A] p-4 rounded-2xl hover:scale-105 transition-transform hover:border-[#F5D76E] border w-full sm:w-auto cursor-pointer">
            <div className="relative rounded-2xl shadow-lg mb-4 w-full h-40 sm:h-48 overflow-hidden">
                <Image src={img} alt={title} fill priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-2">{title}</h3>
            <p className="text-gray-300 text-sm mb-2 line-clamp-2">{desc}</p>
            <p className="text-[#D4AF37] font-semibold">{price}</p>
        </div>
    </Link>
);

const Services = () => {
    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A]">
            <div className="w-full max-w-7xl px-4 py-16 sm:py-20 mb-12 sm:mb-20 lg:mb-32">
                <div className="text-center mb-12">
                    <h1 className="text-[#D4AF37] text-3xl sm:text-5xl font-bold mb-4">Nos Services</h1>
                    <p className="text-gray-400 text-base sm:text-lg">Découvrez tous nos services</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    <ServiceCard title="COIFFURE" desc="Tresses, nattes, coupes, dégradés..." price="À partir de 30 €" img="/galerie/coiffure/IMG_3723.JPEG" href="/services/coiffure" />
                    <ServiceCard title="TATOUAGES" desc="Tatouages au henné ou permanents" price="À partir de 25 €" img="/galerie/tatouages/IMG_4461.JPEG" href="/services/tatouages" />
                    <ServiceCard title="PIERCING" desc="Piercing professionnel et sécurisé" price="À partir de 30 €" img="/images/image11.png" href="/services/piercing" />
                    <ServiceCard title="CILS" desc="Extensions et rehaussement de cils" price="À partir de 40 €" img="/galerie/cils/IMG_6112.JPEG" href="/services/cils" />
                </div>
            </div>
        </main>
    );
}

export default Services