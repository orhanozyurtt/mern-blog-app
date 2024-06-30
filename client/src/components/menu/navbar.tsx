import Link from 'next/link';
import Links from '@/components/menu/links';
import { cookies } from 'next/headers';
import { useEffect } from 'react';
const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="w-full px-4 py-2 flex justify-between items-center">
        <div className="flex items-center text-white text-2xl font-extrabold text-gray-500">
          <Link href="/">BLOG APP </Link>
        </div>
        <div className="flex items-center justify-end flex-1 text-white">
          <ul>
            <li>
              <Links />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
