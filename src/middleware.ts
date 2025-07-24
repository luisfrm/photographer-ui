import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseStaticClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    const client = await createSupabaseStaticClient();
    const { data: languages, error } = await client.from('languages').select('code');

    if (error) {
      console.error('Error fetching languages:', error);
      return NextResponse.redirect(new URL('/en', request.url));
    }

    const supportedLocales = languages.map(({ code }) => code);

    const acceptLanguage = request.headers.get('accept-language') || 'en';
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].split('-')[0]) // Extraer el código base (por ejemplo, 'es' de 'es-ES')
      .find((lang) => supportedLocales.includes(lang)) || 'en';

    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};