import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { GiHamburgerMenu } from "react-icons/gi";
import NavLink from './NavLink';


const Header = () => {

  return (
    <header className='flex w-full items-center justify-between px-3 sm:px-4 md:px-6 bg-[#0A0A0A] text-[#D4AF37] h-14 sm:h-16 fixed top-0 z-50'>
      <div className="max-w-7xl mx-auto flex w-full items-center justify-between">
        <div className="text-sm sm:text-base md:text-lg font-semibold">WavaBANGS</div>
        {/* MENU TABLETTE ET ORDI */}
        <nav className='hidden md:flex gap-6 lg:gap-8'>
          <NavLink href='/' label='Home' />
          <NavLink href='/services' label='Services' />
          <NavLink href='/galerie' label='Galerie' />
          <NavLink href='/reserver' label='Réserver' />
          <NavLink href='/contact' label='Contact' />
        </nav>

        {/* MENU MOBILE */}
        <Menubar className='md:hidden'>
          <MenubarMenu>
            <MenubarTrigger className="min-h-[44px] min-w-[44px] p-2 touch-manipulation"><GiHamburgerMenu className="size-5 sm:size-6" /></MenubarTrigger>
            <MenubarContent className='bg-[#0A0A0A] text-[#D4AF37] border border-[#1C1C1C]'>
              <MenubarItem><NavLink href='/' label='Home' /></MenubarItem>
              <MenubarItem><NavLink href='/services' label='Services' /></MenubarItem>
              <MenubarItem><NavLink href='/galerie' label='Galerie' /></MenubarItem>
              <MenubarItem><NavLink href='/reserver' label='Réserver' /></MenubarItem>
              <MenubarItem><NavLink href='/contact' label='Contact' /></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

      </div>
    </header>
  )
}

export default Header