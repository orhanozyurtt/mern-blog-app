'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  useGetProfileInfoQuery,
  useUpdateMutation,
} from '@/redux/slice/userApiSlice';
import { toast } from 'react-toastify';
import { logIn, logOut } from '@/redux/slice/userInfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface UserInfo {
  name: string;
  email: string;
  password?: string;
}

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = React.memo(
  ({ id, label, value, onChange }) => {
    console.log(`${id} rendered`);
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type={id === 'password' ? 'password' : 'text'}
          id={id}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    );
  }
);

InputField.displayName = 'InputField';

const ProfilePage: React.FC = () => {
  const [localData, setLocalData] = useState<UserInfo>({
    name: '',
    email: '',
    password: '',
  });
  const dispatch = useDispatch();

  const { data, isLoading, error, refetch } = useGetProfileInfoQuery(
    undefined,
    {
      skip: true, // Skip initial automatic fetch
    }
  );
  const [updateProfile] = useUpdateMutation();

  const fetchProfileInfo = useCallback(async () => {
    try {
      const { data } = await refetch();
      if (data && data.userInfo) {
        sessionStorage.setItem('user', JSON.stringify(data.userInfo));
        setLocalData(data.userInfo);
        dispatch(logIn(data.userInfo));
      }
    } catch (error) {
      console.error('Failed to fetch profile info', error);
    }
  }, [refetch, dispatch]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setLocalData(user);
      dispatch(logIn(user));
    } else {
      fetchProfileInfo();
    }
  }, [dispatch, fetchProfileInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLocalData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      if (localData) {
        await updateProfile(localData).unwrap();
        toast.success('Profile updated successfully!');
        setLocalData(localData);
        dispatch(logIn(localData));
        sessionStorage.setItem('user', JSON.stringify(localData));
      }
    } catch (error) {
      toast.error('Update failed');
      console.error('Update failed', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Profile Information</h1>
      <form className="space-y-4">
        <InputField
          id="name"
          label="Name:"
          value={localData.name}
          onChange={handleChange}
        />
        <InputField
          id="email"
          label="Email:"
          value={localData.email}
          onChange={handleChange}
        />
        <InputField
          id="password"
          label="Password:"
          value={localData.password ?? ''}
          onChange={handleChange}
        />
        <button
          type="button"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          onClick={handleUpdateProfile}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
