import Image from "next/image";

const ServiceCard = ({ title, desc, price, img }: { title: string; desc: string; price: string; img: string }) => (
    <div className="flex flex-col items-center text-center w-full bg-[#1A1A1A] p-4 rounded-2xl hover:scale-105 transition-transform hover:border-[#F5D76E] border">
        <div className="relative rounded-2xl shadow-lg mb-4 w-full h-48 overflow-hidden">
            <Image src={img} alt={title} fill priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
        </div>
        <h3 className="text-xl font-semibold text-[#D4AF37] mb-1">{title}</h3>
        <p className="text-gray-300 text-sm mb-2">{desc}</p>
        <p className="text-[#D4AF37] font-semibold">{price}</p>
    </div>
);

const Services = () => {
    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A]">
            <h1 className="text-[#D4AF37] text-3xl sm:text-5xl font-bold mb-8">Nos Services</h1>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl px-4 py-8 sm:py-12">
                <ServiceCard title="COIFFURE FEMME" desc="Tresses, nattes, perruques ..." price="2500 €" img="/images/image11.png" />
                <ServiceCard title="COIFFURE HOMME" desc="Tresses, nattes, dégradés ..." price="1500 €" img="/images/image11.png" />
                <ServiceCard title="ENFANTS" desc="Coiffures filles et garçons" price="1500 €" img="/images/image11.png" />
                <ServiceCard title="TATOUAGES" desc="Tatouages au henné ou permanents" price="À partir de 2500 €" img="/images/image11.png" />
                <ServiceCard title="MANICURE" desc="Griffes toutes couleurs" price="2500 €" img="/images/image11.png" />
                <ServiceCard title="SOINS DU VISAGE" desc="Soin et beauté du visage" price="2500 €" img="/images/image11.png" />
            </section>
        </main>
    );
}

export default Services