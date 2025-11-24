import ReserveForm from './components/ReserveForm';
import AvailabilityCalendar from './components/AvailabilityCalendar';
import Image from 'next/image';

const Reserver = () => {
    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A] mt-15">
            <section className="flex flex-col items-center w-full gap-8 px-4 md:px-20 py-20">
                {/* Calendrier des disponibilités */}
                <div className="w-full max-w-6xl">
                    <h2 className="text-3xl font-bold text-[#D4AF37] mb-6 text-center">
                        Nos disponibilités
                    </h2>
                    <AvailabilityCalendar />
                </div>

                {/* Section formulaire et image */}
                <div className="flex flex-col md:flex-row items-start justify-between w-full gap-8 mt-8">
                    <ReserveForm />
                    <div className='hidden relative border text-[#D4AF37] w-1/2 h-[900px] md:flex items-center justify-center bg-black overflow-hidden rounded-lg'>
                        <Image
                            src="/images/rdv.png"
                            alt="Image de réservation"
                            fill
                            priority
                            className="object-cover rounded-lg"
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Reserver