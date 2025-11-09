"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLinkProps = {
  href: string;
  label: string;
};

export default function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link 
      href={href} 
      className={`nav-link ${pathname === href ? 'active' : ''}`}
    >
      {label}
    </Link>
  );
}
