'use client';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/redux/store';

const Test = () => {
  // const logInfo = useSelector((state: RootState) => state.login.value);

  return (
    <div>
      <div>ana sayffa comp</div>
      {/* <div>Login State: {logInfo ? 'Logged In' : 'Logged Out'}</div> */}
    </div>
  );
};

export default Test;
