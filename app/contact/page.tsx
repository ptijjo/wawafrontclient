import { FaLocationDot } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { CiClock2, CiMail } from "react-icons/ci";
import ContactForm from './components/ContactForm';


const Contact = () => {
    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A] mt-15">
            <h1 className='text-[#D4AF37] text-center text-7xl font-bold'>Nous contacter</h1>
            <p className="text-[#EAEAEA] text-center mt-3.5">Vous avezdes questions? Envoyez-nous un message par le biais du formulaire ci-dessous.</p>

            <section className="flex flex-col mt-36 w-full items-center gap-20 mb-20">
                <div className="flex w-full flex-col md:flex-row justify-center md:justify-between px-3.5 md:px-20">
                    {/* Adresse */}
                    <div className="flex flex-col gap-4 items-start text-[#EAEAEA] text-2xl mb-6 md:mb-0">
                        <p className='flex gap-2.5 items-center'> <FaLocationDot className="text-[#D4AF37]" /> 4 rue de Provins 77970 Jouy-Le-Châtel</p>
                        <p className='flex gap-2.5 items-center'> <BsFillTelephoneFill className="text-[#D4AF37]" /> 07-49-42-29-24</p>
                        <p className=' flex gap-2.5 items-center'><CiMail className="text-[#D4AF37]" /> INFO@EXEMPLE.FR</p>
                        <p className='flex gap-2.5 items-center'> <CiClock2 className="text-[#D4AF37]" />LUN - SAM : 9H00 - 12H00 / 14H00 - 18H00</p>
                    </div>
                    <ContactForm />
                </div>
                <div className="flex justify-center w-full px-3.5 md:px-20">
                    {/* Carte Google Maps */}
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2637.5!2d3.0482!3d48.6827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e5dcf9a8e9c9c9%3A0x9d9d9d9d9d9d9d9d!2s4%20Rue%20de%20Provins%2C%2077970%20Jouy-le-Ch%C3%A2tel!5e0!3m2!1sfr!2sfr!4v1732291200000!5m2!1sfr!2sfr"
                        width="800"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                    />
                </div>
            </section>
        </main>
    )
}

export default Contact