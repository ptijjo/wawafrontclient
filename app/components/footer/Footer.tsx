import { FaFacebookF,FaTwitter,FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full h-16 bg-[#0A0A0A] text-[#D4AF37] border-t-[#1C1C1C] flex items-center justify-between px-8 ">
      <div className="flex items-center">
        © 2024 Wava BANGS All rights reserved.
      </div>
      <div className="flex items-center justify-center gap-10">
        <FaFacebookF size={24} />
        <FaInstagram size={24}/>
        <FaTwitter size={24}/>
      </div>
    </footer>
  )
}

export default Footer