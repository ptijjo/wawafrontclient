import { FaLocationDot } from "react-icons/fa6";
import { BsFillTelephoneFill } from "react-icons/bs";
import { CiClock2, CiMail } from "react-icons/ci";


const Contact = () => {
    return (
        <main className="flex flex-col grow items-center w-full justify-center bg-[#0A0A0A]">
            <h1 className='text-[#D4AF37] text-2xl font-bold'>Nous contacter</h1>
            <p>Vous avezdes questions? Envoyez-nous un message par le biais du formulaire ci-dessous.</p>

            <section>
                <div className="flex">
                    {/* Adresse */}
                    <div className="flex flex-col gap-4 items-start justifify-center text-white">
                        <p className='flex gap-2.5 items-center'> <FaLocationDot className="text-[#D4AF37]" /> 123 rue du couscous</p>
                        <p className='flex gap-2.5 items-center'> <BsFillTelephoneFill className="text-[#D4AF37]" /> 01-82-75-98-63</p>
                        <p className=' flex gap-2.5 items-center'><CiMail className="text-[#D4AF37]" /> INFO@EXEMPLE.FR</p>
                        <p className='flex gap-2.5 items-center'> <CiClock2 className="text-[#D4AF37]" />LUN - SAM : 9H00 - 18H00</p>
                    </div>
                    <form>
                        
                    </form>
                </div>
                <div></div>
            </section>
        </main>
    )
}

export default Contact