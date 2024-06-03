import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const generateToken = (res, userId, isAdmin) => {
  //?bu fonksiyon çağırıldığı yerden bir res userId ve isAdmin bilgisin alıyor

  //!
  const accessToken = jwt.sign(
    { id: userId, isAdmin: isAdmin },
    config.JWT_SECRET,
    // { expiresIn: '1m' }
    { expiresIn: '1h' } // 1 saat
  );

  res.cookie('jwt', accessToken, {
    httpOnly: true,
    secure: config.LOG_LEVEL === 'production',
    sameSite: 'strict',
    maxAge: 1 * 60 * 60 * 1000, // 1 saat
    // maxAge: 10000,
  });

  return { accessToken };
};

const refreshToken = (res, userId, isAdmin) => {
  const refreshToken = jwt.sign(
    { id: userId, isAdmin: isAdmin },
    config.JWT_REFRESH_SECRET,
    // { expiresIn: '1d' }
    { expiresIn: '30d' } // 30 gün
    // {1m}
  );
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.LOG_LEVEL === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    // maxAge: 1 * 60 * 1000, // 1 dakika
  });
  return { refreshToken };
};
export { generateToken, refreshToken };
