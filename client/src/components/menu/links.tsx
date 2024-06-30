'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import DropMenu from '@/components/menu/dropMenu';
import { useLogoutMutation } from '@/redux/slice/userApiSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logOut } from '@/redux/slice/loginSlice';
import Link from 'next/link';
import { IoIosHome } from 'react-icons/io';

interface IUser {
  id: string;
  name: string;
  email: string;
}

const Links: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const loginProcess = async () => {
      const userData = sessionStorage.getItem('user');
      if (userData) {
        const user: IUser = JSON.parse(userData);
        setUserName(user.name);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        performLogout();
      }
    };
    loginProcess();
  }, [pathname]);

  const performLogout = async () => {
    try {
      await logout(undefined).unwrap();
      sessionStorage.removeItem('user');
      setIsLoggedIn(false);
      dispatch(logOut());
      toast.success('Çıkış başarılı');
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="flex space-x-4">
      <div className="flex items-center gap-2 cursor-pointer">
        <IoIosHome />

        <Link href={'/'}>Home Page</Link>
      </div>
      <div className="flex items-center gap-2 cursor-pointer">
        <IoIosHome />

        <Link href={'/blog'}>All Blogs</Link>
      </div>
      <div>
        <DropMenu
          profileLink="/profile"
          blogLink="/blog/myBlog"
          loginLink="/login"
          registerLink="/register"
          homeLink="/"
          onLogout={performLogout}
          userName={isLoggedIn ? userName : undefined}
        />
      </div>
    </div>
  );
};

export default Links;
