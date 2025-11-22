import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full h-16 bg-[#0A0A0A] text-[#D4AF37] border-t-[#1C1C1C] flex items-center justify-between px-8 ">
      <div className="flex items-center">
        © 2024 Wava BANGS All rights reserved.
      </div>
      <div className="flex items-center justify-center gap-10">
        <Link href="https://www.facebook.com/wava.bangs" target="_blank" rel="noopener noreferrer">
          <FaFacebookF size={24} className="hover:scale-120 transition-transform duration-300 cursor-pointer" />
        </Link>
        <Link href="https://www.instagram.com/wavabangs/" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={24} className="hover:scale-120 transition-transform duration-300 cursor-pointer" />
        </Link>
        <Link href="https://www.tiktok.com/@amelie.wava.bangs?lang=fr" target="_blank" rel="noopener noreferrer">
          <FaTiktok size={24} className="hover:scale-120 transition-transform duration-300 cursor-pointer" />
        </Link>
      </div>
    </footer>
  )
}

export default Footer