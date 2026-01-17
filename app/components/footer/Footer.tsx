import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0A0A0A] text-[#D4AF37] border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-10 px-4 sm:px-6 md:px-8 py-4 sm:py-5">
      <div className="flex items-center text-xs sm:text-sm md:text-base text-center sm:text-left">
        © 2024 Wava BANGS All rights reserved.
      </div>
      <div className="flex items-center justify-center gap-6 sm:gap-8">
        <Link href="https://www.facebook.com/wava.bangs" target="_blank" rel="noopener noreferrer" className="min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation">
          <FaFacebookF size={20} className="sm:size-[22px] md:size-6 hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer" />
        </Link>
        <Link href="https://www.instagram.com/wavabangs/" target="_blank" rel="noopener noreferrer" className="min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation">
          <FaInstagram size={20} className="sm:size-[22px] md:size-6 hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer" />
        </Link>
        <Link href="https://www.tiktok.com/@amelie.wava.bangs?lang=fr" target="_blank" rel="noopener noreferrer" className="min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation">
          <FaTiktok size={20} className="sm:size-[22px] md:size-6 hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer" />
        </Link>
      </div>
    </footer>
  )
}

export default Footer