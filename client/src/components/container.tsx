'use client';
import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface ContainerProps {
  children: ReactNode;
}
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import ContainerLay from '@/components/containerLay';
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <div className="w-screen h-screen overflow-x-hidden overflow-y-hidden flex flex-col">
        {/* <ContainerLay>{children}</ContainerLay>
         */}
        {children}
        <ToastContainer autoClose={1000} />
      </div>
    </Provider>
  );
};

export default Container;
