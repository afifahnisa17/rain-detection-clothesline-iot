import Head from "next/head";
import { Poppins } from "next/font/google";
import styles from "@/styles/404.module.scss";
import Link from "next/dist/client/link";
import Image from "next/image";

// Konfigurasi font Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>404 - Halaman Tidak Ditemukan</title>
        <meta
          name="description"
          content="Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan."
        />
      </Head>

      {/* Menggabungkan class dari module SCSS dan font Poppins */}
      <div className={`${styles.error} ${poppins.className}`}>
        {/* Dekorasi Background (Blobs) */}
        <div className={styles.error__blob1}></div>
        <div className={styles.error__blob2}></div>

        {/* Konten Utama dengan efek Glassmorphism */}
        <div className={styles.error__content}>
          <Image
            src="/page-not-found.png"
            alt="404 Illustration"
            className={styles.error__image}
            width={400}
            height={200}
          />
          <h1 className={styles.error__title}>Oops! 404</h1>
          <p className={styles.error__description}>
            Maaf, halaman yang Anda cari tidak ada atau mungkin sudah
            dipindahkan. Jangan khawatir, mari kembali ke jalan yang benar.
          </p>
          <Link href="/homepage" className={styles.error__button}>
            Kembali ke Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Custom404;
