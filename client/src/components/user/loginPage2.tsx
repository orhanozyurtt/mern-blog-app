'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FieldErrors } from 'react-hook-form';
import { z } from 'zod';
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
import { logIn, logOut } from '@/redux/slice/userInfoSlice';
import { useDispatch } from 'react-redux';
interface CustomError {
  data?: {
    error?: {
      message?: string;
    };
    code?: number;
  };
}

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: 'Email must be at least 2 characters.',
    })
    .email({
      message: 'Invalid email address.',
    }),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[0-9]/, {
      message: 'Password must contain at least one number.',
    }),
});

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await login(data).unwrap();
      console.log('response : ', res);
      if (res?.code === 200) {
        toast.success('Giriş başarılı');
        sessionStorage.setItem('user', JSON.stringify(res?.data));
        dispatch(
          logIn({
            name: res?.data.name,
            email: res?.data.email,
          })
        );
        router.push('/');
      }
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
          {isLoading && <Loader />}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message as string}
                </p>
              )}
            </div>
            <div className="grid gap-2 mt-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message as string}
                </p>
              )}
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
