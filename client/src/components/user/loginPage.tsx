'use client';
import React, { useState, useEffect } from 'react';
import Loader from '@/app/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useLoginMutation } from '@/redux/slice/userApiSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface CustomError {
  data?: {
    error?: {
      message?: string;
    };
    code?: number;
  };
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Form gönderimini engelle

    try {
      const res = await login({ email, password }).unwrap();
      console.log('response : ', res);
      if (res?.code === 200) {
        toast.success('Giriş başarılı');
        sessionStorage.setItem('user', JSON.stringify(res?.data));
        // router.push('/sayfa', { shallow: true });
        router.push('/');
      }
      // Kullanıcı bilgisini session storage'e kaydet
    } catch (error: unknown) {
      const customError = error as CustomError;
      const errMsg = customError.data?.error?.message;
      const errCode = customError.data?.code;
      console.log('error code', errCode);
      if (errCode === 400) {
        toast.error(errMsg);
      } else if (errCode === 409) {
        toast.error(errMsg);
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-login">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password below to login
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isLoading && <Loader />}{' '}
          {/* Yüklenme durumu true ise Loader göster */}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="grid gap-2 mt-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-3">
              Login
            </Button>
          </form>
          <div className="flex justify-center mt-3">
            <Link href="/register">
              <Button variant="outline" className="w-full">
                Register
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
