import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { GiHamburgerMenu } from "react-icons/gi";
import NavLink from './NavLink';


const Header = () => {

  return (
    <header className='flex w-full items-center justify-between px-4 bg-[#0A0A0A] text-[#D4AF37] h-16'>
      <div>WavaBANGS</div>
      {/* MENU TABLETTE ET ORDI */}
      <nav className='hidden md:flex gap-8'>
        <NavLink href='/' label='Home' />
        <NavLink href='/services' label='Services' />
        <NavLink href='/galerie' label='Galerie' />
        <NavLink href='/reserver' label='Réserver' />
        <NavLink href='/contact' label='Contact' />
      </nav>

      {/* MENU MOBILE */}
      <Menubar className='md:hidden'>
        <MenubarMenu>
          <MenubarTrigger><GiHamburgerMenu /></MenubarTrigger>
          <MenubarContent className='bg-[#0A0A0A] text-[#D4AF37] border border-[#1C1C1C]'>
            <MenubarItem><NavLink href='/' label='Home' /></MenubarItem>
            <MenubarItem><NavLink href='/services' label='Services' /></MenubarItem>
            <MenubarItem><NavLink href='/galerie' label='Galerie' /></MenubarItem>
            <MenubarItem><NavLink href='/reserver' label='Réserver' /></MenubarItem>
            <MenubarItem><NavLink href='/contact' label='Contact' /></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

    </header>
  )
}

export default Header