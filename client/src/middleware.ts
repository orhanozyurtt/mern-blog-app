import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // JWT ve refreshToken çerezlerini kontrol et
  const jwtToken = request.cookies.get('jwt');
  const refreshToken = request.cookies.get('refreshToken');

  const url = request.nextUrl.clone();

  // Eğer profile sayfasına gidiliyorsa ve jwt veya refreshToken çerezleri yoksa, ana sayfaya yönlendir
  if (url.pathname.startsWith('/profile')) {
    if (!jwtToken && !refreshToken) {
      request.cookies.clear();
      console.log(
        'Profile sayfasına erişim engellendi, jwt veya refreshToken çerezleri yok.'
      );
      // Ana sayfaya yönlendir
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Eğer login veya register sayfalarına gidiliyorsa ve jwt veya refreshToken çerezleri varsa, ana sayfaya yönlendir
  if (
    (url.pathname.startsWith('/login') ||
      url.pathname.startsWith('/register')) &&
    (jwtToken || refreshToken)
  ) {
    request.cookies.clear();
    console.log(
      'Login veya register sayfasına erişim engellendi, jwt veya refreshToken çerezleri mevcut.'
    );
    // Ana sayfaya yönlendir
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Diğer durumlarda devam et
  return NextResponse.next();
}

// next.config.js
export const config = {
  matcher: ['/profile', '/login', '/register'],
};
