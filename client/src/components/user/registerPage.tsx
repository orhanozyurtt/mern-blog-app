'use client';
import React, { useState, FormEvent } from 'react';
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
import { toast } from 'react-toastify'; // Toastify import edin
import { useRegisterMutation } from '@/redux/slice/userApiSlice'; // useRegisterMutation'ı import edin
import { useRouter } from 'next/navigation';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation(); // useRegisterMutation hook'unu kullanın

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const userData = { name, email, password };
      const response = await register(userData).unwrap();
      console.log('response : ', response);

      // Sadece email ve name bilgisini sessionStorage içine ekle
      const userInfo = { email: response.data.email, name: response.data.name };
      sessionStorage.setItem('user', JSON.stringify(userInfo));

      toast.success('Registration successful!');
      console.log('Response: ---- ', response);

      // Kayıttan sonra login sayfasına yönlendir
      router.push('/login');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center bg-login h-screen">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="*****"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="*****"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
            <Button type="submit" className="w-full mt-3" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <div className="flex justify-center mt-3">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Login Account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
