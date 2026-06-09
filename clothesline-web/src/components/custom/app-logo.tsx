import { Shirt, Wifi } from "lucide-react";

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ikon Utama: Baju (merepresentasikan Jemuran) */}
      <Shirt className="w-full h-full text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
      
      {/* Ikon Overlay: WiFi (merepresentasikan IoT/Smart Device) */}
      <div className="absolute -bottom-1 -right-2 rounded-full bg-background p-[2px]">
        <Wifi className="w-[14px] h-[14px] text-amber-500" strokeWidth={3} />
      </div>
    </div>
  );
}
