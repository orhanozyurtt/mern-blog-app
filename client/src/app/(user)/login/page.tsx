import React from 'react';
import LoginPage from '@/components/user/loginPage';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Login: React.FC = () => {
  const nextCookies = cookies();

  if (nextCookies.has('refreshToken')) {
    redirect('/');
  }
  return (
    <>
      <LoginPage />
    </>
  );
};

export default Login;
