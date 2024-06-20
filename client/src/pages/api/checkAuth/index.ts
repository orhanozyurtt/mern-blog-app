// pages/api/checkAuth/index.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Auth kontrolünü burada yapın, örneğin çerezlere bakarak
  const { cookies } = req;
  const refreshToken = cookies.refreshToken;

  // console.log('API route hit, refreshToken:', refreshToken);

  if (refreshToken) {
    // refreshToken varsa isLoggedIn true döner
    res.status(200).json({ isLoggedIn: true });
  } else {
    // refreshToken yoksa isLoggedIn false döner
    res.status(200).json({ isLoggedIn: false });
  }
}
