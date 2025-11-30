import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0A0A0A] text-[#D4AF37] border-t-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-10 px-4 sm:px-8 py-4">
      <div className="flex items-center text-sm sm:text-base">
        © 2024 Wava BANGS All rights reserved.
      </div>
      <div className="flex items-center justify-center gap-5 sm:gap-8">
        <Link href="https://www.facebook.com/wava.bangs" target="_blank" rel="noopener noreferrer">
          <FaFacebookF size={20} className="sm:size-[22px] md:size-6 hover:scale-110 transition-transform duration-300 cursor-pointer" />
        </Link>
        <Link href="https://www.instagram.com/wavabangs/" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={20} className="sm:size-[22px] md:size-6 hover:scale-110 transition-transform duration-300 cursor-pointer" />
        </Link>
        <Link href="https://www.tiktok.com/@amelie.wava.bangs?lang=fr" target="_blank" rel="noopener noreferrer">
          <FaTiktok size={20} className="sm:size-[22px] md:size-6 hover:scale-110 transition-transform duration-300 cursor-pointer" />
        </Link>
      </div>
    </footer>
  )
}

export default Footer