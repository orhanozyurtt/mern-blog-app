'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logIn, logOut } from '@/redux/slice/loginSlice';
import { redirect, usePathname } from 'next/navigation';
interface ContainerProps {
  children: ReactNode;
}

const ContainerLay: React.FC<ContainerProps> = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/checkAuth/');
        if (!response.ok) {
          sessionStorage.removeItem('user');
          dispatch(logOut());
          redirect('/login');
        } else {
          dispatch(logIn());
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkAuth();
  }, [pathname]); // dispatch'i bağımlılık olarak ekledik

  return <div>{children}</div>;
};

export default ContainerLay;
