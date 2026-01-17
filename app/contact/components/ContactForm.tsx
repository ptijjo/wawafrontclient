"use client"
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
    nom: string;
    email: string;
    tel: string;
    message: string;
}


const ContactForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center text-white gap-4 sm:gap-5 bg-[#1A1A1A] p-4 sm:p-6 md:p-8 rounded-lg w-full md:w-1/2">
            <input type="text" {...register("nom", { required: true })} placeholder="Nom" className="bg-[#141414] w-full px-4 py-3.5 min-h-[44px] rounded-lg text-base border border-transparent focus:border-[#D4AF37] focus:outline-none" />
            {errors.nom && <span className="text-red-400 text-sm">Ce champ est requis</span>}

            <input type="email" {...register("email", { required: true })} placeholder="E-mail" className="bg-[#141414] w-full px-4 py-3.5 min-h-[44px] rounded-lg text-base border border-transparent focus:border-[#D4AF37] focus:outline-none" />
            {errors.email && <span className="text-red-400 text-sm">Ce champ est requis</span>}

            <input type="tel" {...register("tel")} placeholder="Téléphone" className="bg-[#141414] w-full px-4 py-3.5 min-h-[44px] rounded-lg text-base border border-transparent focus:border-[#D4AF37] focus:outline-none" />

            <textarea {...register("message", { required: true })} placeholder="Message" className="bg-[#141414] w-full px-4 py-3 min-h-[120px] rounded-lg resize-none text-base border border-transparent focus:border-[#D4AF37] focus:outline-none" />
            {errors.message && <span className="text-red-400 text-sm">Ce champ est requis</span>}

            <input type="submit" value="Envoyer" className="bg-[#d2ad5c] w-full min-h-[48px] py-3 rounded-lg hover:bg-[#F5D76E] active:scale-95 transition-all duration-300 touch-manipulation font-semibold text-base cursor-pointer" />
        </form>
    )
}

export default ContactForm