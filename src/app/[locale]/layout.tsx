import { notFound } from 'next/navigation';
import { createSupabaseStaticClient } from '@/lib/supabase/server';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validar que el locale sea válido
  // const supabase = await createSupabaseStaticClient();
  // const { data } = await supabase.from('languages').select('code');
  // const validLocales = data?.map(lang => lang.code) || ['en', 'es'];

  const validLocales = ['en', 'es'];
  
  if (!validLocales.includes(locale)) {
    notFound(); // Esto dispara el 404
  }

  return <>{children}</>;
}

export async function generateStaticParams() {
  const supabase = await createSupabaseStaticClient();
  const { data } = await supabase.from('languages').select('code');
  
  if (!data || data.length === 0) {
    return [
      { locale: 'en' },
      { locale: 'es' }
    ];
  }
  
  return data.map((language) => ({ locale: language.code }));
}