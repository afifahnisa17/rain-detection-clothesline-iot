import Head from 'next/head';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
}

export function SEO({ 
  title, 
  description = "Aplikasi pemantauan dan kontrol jemuran pintar berbasis IoT. Memberikan informasi cuaca real-time dan perlindungan jemuran dari hujan.", 
  keywords = "iot, jemuran pintar, smart clothesline, arduino, esp32, nextjs, react" 
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
