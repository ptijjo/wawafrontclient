import { FaLocationDot } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { CiClock2, CiMail } from "react-icons/ci";
import ContactForm from './components/ContactForm';


const Contact = () => {
    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A]">
            <h1 className='text-[#D4AF37] text-center text-3xl sm:text-5xl md:text-6xl font-bold'>Nous contacter</h1>
            <p className="text-[#EAEAEA] text-center mt-3.5 px-4">Vous avez des questions ? Envoyez-nous un message via le formulaire ci-dessous.</p>

            <section className="flex flex-col mt-12 sm:mt-20 md:mt-36 w-full items-center gap-12 sm:gap-16 md:gap-20 mb-12 sm:mb-16 md:mb-20">
                <div className="flex w-full flex-col md:flex-row justify-center md:justify-between px-4 sm:px-6 md:px-20 gap-8 md:gap-12">
                    {/* Adresse */}
                    <div className="flex flex-col gap-3 sm:gap-4 items-start text-[#EAEAEA] text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-0">
                        <p className='flex gap-2.5 items-start sm:items-center text-sm sm:text-base md:text-lg lg:text-xl'> <FaLocationDot className="text-[#D4AF37] flex-shrink-0 mt-1 sm:mt-0" /> <span>30 rue de la forêt 77160 Chenoise Cucharmoy</span></p>
                        <p className='flex gap-2.5 items-center'> <BsFillTelephoneFill className="text-[#D4AF37] flex-shrink-0" /> <a href="tel:0749422924" className="hover:text-[#D4AF37] transition-colors">07-49-42-29-24</a></p>
                        <p className='flex gap-2.5 items-center'><CiMail className="text-[#D4AF37] flex-shrink-0" /> <a href="mailto:wava05@outlook.fr" className="hover:text-[#D4AF37] transition-colors break-all">wava05@outlook.fr</a></p>
                        <p className='flex gap-2.5 items-start sm:items-center text-sm sm:text-base md:text-lg lg:text-xl'> <CiClock2 className="text-[#D4AF37] flex-shrink-0 mt-1 sm:mt-0" /> <span>LUN - SAM : 9H00 - 12H00 / 14H00 - 18H00</span></p>
                    </div>
                    <ContactForm />
                </div>
                <div className="flex justify-center w-full px-4 md:px-20">
                    {/* Carte Google Maps */}
                    <div className="w-full max-w-4xl aspect-video">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.8!2d3.0482!3d48.6827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e5daa4e5e5e5e5%3A0x5e5e5e5e5e5e5e5e!2s30%20Rue%20de%20la%20For%C3%AAt%2C%2077160%20Chenoise-Cucharmoy!5e0!3m2!1sfr!2sfr!4v1733500000000!5m2!1sfr!2sfr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Contact