import { ReactElement, useEffect, useState } from "react";
import AnalyticsPage from "@/views/dashboard/analytics";
import DashboardLayout from "@/views/dashboard/layout";
import { 
  ThermometerSun, Droplets, Sun, CloudRain, 
  ShieldAlert, Clock, TrendingUp, ActivitySquare 
} from "lucide-react";

// Struktur data gabungan: Dasar & Komprehensif
interface AnalyticsData {
  rata_rata_suhu: number;
  rata_rata_kelembaban: number;
  rata_rata_cahaya: number;
  rata_rata_hujan: number;
  korelasi_cuaca: number;
  total_penyelamatan: number;
  jam_rawan_hujan: number;
  suhu_mingguan: number;
  last_updated: string;
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          'https://my-second-project-491611-default-rtdb.asia-southeast1.firebasedatabase.app/analytics_summary.json'
        );
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Gagal mengambil data Big Data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Mengambil hasil komputasi Spark dari Firebase...</p>
      </div>
    );
  }

  // Menggabungkan Analisis Dasar & Komprehensif ke dalam satu array stat
  const stats = data ? [
    // --- ANALISIS DASAR (OVERALL) ---
    {
      title: "Rata-rata Suhu",
      description: "Kalkulasi keseluruhan waktu",
      value: data.rata_rata_suhu,
      unit: "°C",
      footer: `Diperbarui: ${data.last_updated}`,
      icon: ThermometerSun,
      colorClass: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    },
    {
      title: "Rata-rata Kelembaban",
      description: "Kalkulasi keseluruhan waktu",
      value: data.rata_rata_kelembaban,
      unit: "%",
      footer: `Diperbarui: ${data.last_updated}`,
      icon: Droplets,
      colorClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    },
    {
      title: "Intensitas Cahaya",
      description: "Kalkulasi keseluruhan waktu",
      value: data.rata_rata_cahaya,
      unit: " Lux",
      footer: `Diperbarui: ${data.last_updated}`,
      icon: Sun,
      colorClass: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
    },
    {
      title: "Intensitas Hujan",
      description: "Kalkulasi keseluruhan waktu",
      value: data.rata_rata_hujan,
      unit: " ADC",
      footer: `Diperbarui: ${data.last_updated}`,
      icon: CloudRain,
      colorClass: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400",
    },

    // --- ANALISIS KOMPREHENSIF (INSIGHTS) ---
    {
      title: "Penyelamatan Jemuran",
      description: "Total aktuasi motor servo",
      value: data.total_penyelamatan,
      unit: " Kali",
      footer: "Otomatisasi jemuran ditarik karena hujan",
      icon: ShieldAlert,
      colorClass: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
    },
    {
      title: "Jam Rawan Hujan",
      description: "Waktu paling sering cuaca buruk",
      value: `${String(data.jam_rawan_hujan).padStart(2, '0')}:00`,
      unit: " WIB",
      footer: "Hindari menjemur pakaian di jam ini",
      icon: Clock,
      colorClass: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    },
    {
      title: "Tren Suhu Mingguan",
      description: "Rata-rata 7 Hari Terakhir",
      value: data.suhu_mingguan,
      unit: "°C",
      footer: "Mendeteksi pergeseran cuaca sepekan",
      icon: TrendingUp,
      colorClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    },
    {
      title: "Korelasi Suhu & Lembab",
      description: "Analisis Pearson Correlation",
      value: data.korelasi_cuaca,
      unit: "",
      footer: data.korelasi_cuaca < 0 ? "Normal: Berbanding terbalik" : "Anomali cuaca terdeteksi",
      icon: ActivitySquare,
      colorClass: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/40 dark:text-fuchsia-400",
    }
  ] : [];

  return (
    <>
      <title>Analitik Big Data - Smart Clothesline</title>
      <AnalyticsPage stats={stats} />
    </>
  );
};

// Menggabungkan halaman ke dalam Layout Dashboard utama
Analytics.getLayout = function getLayout(page: ReactElement) {
  const breadcrumbs = [
    { label: "System Analytics" },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      {page}
    </DashboardLayout>
  );
};

export default Analytics;