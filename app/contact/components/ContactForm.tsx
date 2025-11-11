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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center text-white gap-4 bg-[#1A1A1A] p-8 rounded-lg  w-full md:w-1/2">
            <input type="text" {...register("nom", { required: true })} placeholder="Nom" className="bg-[#141414] w-full px-1.5 h-10 rounded-lg" />
            {errors.nom && <span>Ce champ est requis</span>}

            <input type="email" {...register("email", { required: true })} placeholder="E-mail" className="bg-[#141414] w-full px-1.5 h-10 rounded-lg" />
            {errors.email && <span>Ce champ est requis</span>}

            <input type="tel" {...register("tel")} placeholder="Téléphone" className="bg-[#141414] w-full px-1.5 h-10 rounded-lg" />

            <textarea {...register("message", { required: true })} placeholder="Message" className="bg-[#141414] w-full px-1.5 h-40 rounded-lg resize-none" />
            {errors.message && <span>Ce champ est requis</span>}

            <input type="submit" value="Envoyer" className="bg-[#d2ad5c] w-full h-13 rounded-lg hover:bg-[#F5D76E] transition-transform" />
        </form>
    )
}

export default ContactForm