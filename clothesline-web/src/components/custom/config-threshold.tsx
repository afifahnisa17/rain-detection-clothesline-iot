"use client"

import { useState, useEffect } from "react";
import { useMqtt } from "@/contexts/mqtt-context";
import { useDevice } from "@/contexts/device-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sun, CloudRain, Thermometer, Settings2, ShieldCheck, Info } from "lucide-react";
import { useMqttStatus } from "@/hooks/use-mqtt-status";
import { Slider } from "@/components/ui/slider";

const PRESETS = [
  {
    id: 1,
    name: "Sangat Sensitif",
    desc: "Cepat masuk walau mendung tipis/gerimis kecil.",
    ldr: [1500, 2500, 3500],
    rain: [4000, 3500],
  },
  {
    id: 2,
    name: "Sensitif",
    desc: "Sedikit lebih waspada dari kondisi normal.",
    ldr: [1000, 2000, 3000],
    rain: [3900, 3000],
  },
  {
    id: 3,
    name: "Normal",
    desc: "Pengaturan seimbang (Rekomendasi).",
    ldr: [800, 1800, 2800],
    rain: [3800, 2500],
  },
  {
    id: 4,
    name: "Santai",
    desc: "Jemuran bertahan agak lama di luar walau mendung.",
    ldr: [500, 1500, 2000],
    rain: [3500, 1500],
  },
  {
    id: 5,
    name: "Sangat Santai",
    desc: "Hanya ditarik masuk jika sangat gelap atau hujan deras.",
    ldr: [300, 1000, 1500],
    rain: [3000, 800],
  }
];

function NumberInput({ value, onChange, min, max }: { value: number, onChange: (val: number) => void, min: number, max: number }) {
  const [localVal, setLocalVal] = useState(value.toString());

  useEffect(() => {
    const t = setTimeout(() => setLocalVal(value.toString()), 0);
    return () => clearTimeout(t);
  }, [value]);

  const handleBlur = () => {
    let num = Number(localVal);
    if (isNaN(num)) num = min;
    if (num < min) num = min;
    if (num > max) num = max;
    setLocalVal(num.toString());
    onChange(num);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <input 
      type="number" 
      value={localVal} 
      onChange={(e) => setLocalVal(e.target.value)} 
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-16 h-6 px-1 text-center bg-transparent border-b border-border hover:border-primary focus:border-primary outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
    />
  );
}

export function ConfigurationThreshold() {
  const { sendConfig } = useMqtt();
  const { activeDevice } = useDevice();
  const deviceId = activeDevice?.deviceId || null;

  const { isOnline, latestData } = useMqttStatus(deviceId);
  
  const [activeMode, setActiveMode] = useState<"SIMPLE" | "ADVANCED">("SIMPLE");
  const [selectedPreset, setSelectedPreset] = useState<number>(3); // Default Normal
  
  const [suhu, setSuhu] = useState(25);
  const [kelembaban, setKelembaban] = useState(80);
  
  const [ldrTerik, setLdrTerik] = useState(800);
  const [ldrBerawan, setLdrBerawan] = useState(1800);
  const [ldrMendung, setLdrMendung] = useState(2800);
  
  const [hujanKering, setHujanKering] = useState(3800);
  const [hujanGerimis, setHujanGerimis] = useState(2500);

  // Load from localStorage on mount
  useEffect(() => {
    if (deviceId) {
      const savedConfig = localStorage.getItem(`config_${deviceId}`);
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setTimeout(() => {
            if (parsed.presetId !== undefined) {
                setSelectedPreset(parsed.presetId);
            } else {
                setActiveMode("ADVANCED");
            }
            if (parsed.batasSuhu !== undefined) setSuhu(parsed.batasSuhu);
            if (parsed.batasLembab !== undefined) setKelembaban(parsed.batasLembab);
            if (parsed.ldrTerik !== undefined) setLdrTerik(parsed.ldrTerik);
            if (parsed.ldrBerawan !== undefined) setLdrBerawan(parsed.ldrBerawan);
            if (parsed.ldrMendung !== undefined) setLdrMendung(parsed.ldrMendung);
            if (parsed.hujanKering !== undefined) setHujanKering(parsed.hujanKering);
            if (parsed.hujanGerimis !== undefined) setHujanGerimis(parsed.hujanGerimis);
          }, 0);
        } catch (e) {
          console.error("Failed to parse config from localStorage", e);
        }
      }
    }
  }, [deviceId]);

  const handlePresetSelect = (presetId: number) => {
    const p = PRESETS.find(x => x.id === presetId);
    if(p) {
      setSelectedPreset(presetId);
      setLdrTerik(p.ldr[0]);
      setLdrBerawan(p.ldr[1]);
      setLdrMendung(p.ldr[2]);
      setHujanKering(p.rain[0]);
      setHujanGerimis(p.rain[1]);
    }
  };

  const handlePublishConfig = () => {
    if (!deviceId) {
      toast.error("Tidak ada device aktif yang terpilih");
      return;
    }

    if (activeMode === "ADVANCED") {
        if (Number(ldrTerik) >= Number(ldrBerawan) || Number(ldrBerawan) >= Number(ldrMendung)) {
            toast.error("Urutan threshold LDR salah! Harus: Terik < Berawan < Mendung");
            return;
        }
        if (Number(hujanGerimis) >= Number(hujanKering)) {
            toast.error("Urutan threshold Hujan salah! Harus: Gerimis < Kering");
            return;
        }
    }

    const payload = {
      presetId: activeMode === "SIMPLE" ? selectedPreset : undefined,
      batasSuhu: Number(suhu),
      batasLembab: Number(kelembaban),
      ldrTerik: Number(ldrTerik),
      ldrBerawan: Number(ldrBerawan),
      ldrMendung: Number(ldrMendung),
      hujanKering: Number(hujanKering),
      hujanGerimis: Number(hujanGerimis),
    };

    localStorage.setItem(`config_${deviceId}`, JSON.stringify(payload));
    sendConfig(payload);
    
    if (isOnline) {
      toast.success("Konfigurasi cuaca berhasil diterapkan!");
    } else {      
      toast.error("Perangkat offline (Tersimpan lokal)"); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan Sensitivitas</h1>
          <p className="text-sm text-muted-foreground">Sesuaikan sensitivitas jemuran pintar Anda membaca cuaca luar.</p>
        </div>
        <Button 
            variant="outline" 
            className="shrink-0"
            onClick={() => setActiveMode(activeMode === "SIMPLE" ? "ADVANCED" : "SIMPLE")}
        >
            <Settings2 className="w-4 h-4 mr-2" />
            {activeMode === "SIMPLE" ? "Buka Pengaturan Lanjutan" : "Kembali ke Mode Praktis"}
        </Button>
      </div>

      {activeMode === "SIMPLE" ? (
        <Card className="rounded-2xl shadow-sm border-primary/20">
            <CardHeader className="bg-primary/5 border-b pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Pilih Preset Sensitivitas
                </CardTitle>
                <CardDescription>Pilih salah satu pengaturan siap pakai yang paling cocok untuk kondisi lingkungan Anda.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PRESETS.map((p) => (
                        <div 
                            key={p.id}
                            onClick={() => handlePresetSelect(p.id)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPreset === p.id ? 'border-primary bg-primary/10 shadow-sm' : 'border-border hover:border-primary/50 bg-card hover:bg-accent/50'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-base">{p.name}</h3>
                                {selectedPreset === p.id && (
                                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-400">
                    <p className="font-semibold mb-1">Mode Lanjutan (ADC Raw Values)</p>
                    <p>Skala sensor LDR dan Hujan berkisar dari <strong>0 hingga 4095</strong>. Semakin kecil angkanya, berarti kondisi semakin ekstrem (0 = sangat terang menyilaukan, atau 0 = hujan sangat deras).</p>
                </div>
            </div>

            {/* Live Preview Bar */}
            {latestData && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-xs font-mono flex justify-between items-center border">
                        <span className="text-muted-foreground">Nilai Sensor Cahaya Saat Ini:</span>
                        <span className="font-bold text-yellow-600 dark:text-yellow-400 text-sm">{latestData.ldr}</span>
                    </div>
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-xs font-mono flex justify-between items-center border">
                        <span className="text-muted-foreground">Nilai Sensor Air Saat Ini:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{latestData.intensitasAir}</span>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* GRUP SENSOR CAHAYA (LDR) */}
                <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-2 text-yellow-500">
                    <Sun className="w-5 h-5" />
                    <CardTitle className="text-lg">Tingkatan Cahaya (LDR)</CardTitle>
                    </div>
                    <CardDescription>Geser titik batas antar cuaca (0 = Terang Benderang, 4095 = Gelap Gulita).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex flex-col gap-4">
                        <Slider 
                            value={[ldrTerik, ldrBerawan, ldrMendung]} 
                            min={0} max={4095} step={1}
                            minStepsBetweenThumbs={50}
                            onValueChange={(val) => {
                                setLdrTerik(val[0]);
                                setLdrBerawan(val[1]);
                                setLdrMendung(val[2]);
                            }}
                            className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-yellow-500 [&_[role=slider]]:border-2"
                        />
                        <div className="flex justify-between text-xs font-medium text-muted-foreground mt-2 px-1 gap-2">
                            <div className="flex flex-col items-center w-1/4 text-center">
                                <span className="text-yellow-600 font-bold mb-1">Cerah Terik</span>
                                <NumberInput value={ldrTerik} onChange={setLdrTerik} min={0} max={ldrBerawan - 50} />
                            </div>
                            <div className="flex flex-col items-center w-1/4 text-center">
                                <span className="text-orange-500 font-bold mb-1">Berawan</span>
                                <NumberInput value={ldrBerawan} onChange={setLdrBerawan} min={ldrTerik + 50} max={ldrMendung - 50} />
                            </div>
                            <div className="flex flex-col items-center w-1/4 text-center">
                                <span className="text-slate-500 font-bold mb-1">Mendung</span>
                                <NumberInput value={ldrMendung} onChange={setLdrMendung} min={ldrBerawan + 50} max={4095} />
                            </div>
                            <div className="flex flex-col items-center w-1/4 text-center">
                                <span className="font-bold mb-1 text-foreground">Gelap</span>
                                <div className="flex items-center h-6">
                                    <span>&gt; {ldrMendung}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                </Card>

                {/* GRUP SENSOR HUJAN */}
                <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-2 text-blue-500">
                    <CloudRain className="w-5 h-5" />
                    <CardTitle className="text-lg">Tingkatan Air Hujan</CardTitle>
                    </div>
                    <CardDescription>Geser titik batas deteksi air (0 = Banjir/Sangat Deras, 4095 = Kering Total).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex flex-col gap-4">
                        <Slider 
                            value={[hujanGerimis, hujanKering]} 
                            min={0} max={4095} step={1}
                            minStepsBetweenThumbs={50}
                            onValueChange={(val) => {
                                setHujanGerimis(val[0]);
                                setHujanKering(val[1]);
                            }}
                            className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-blue-500 [&_[role=slider]]:border-2"
                        />
                        <div className="flex justify-between text-xs font-medium text-muted-foreground mt-2 px-1 gap-2">
                            <div className="flex flex-col items-center w-1/3 text-center">
                                <span className="text-blue-700 font-bold mb-1">Hujan Deras</span>
                                <NumberInput value={hujanGerimis} onChange={setHujanGerimis} min={0} max={hujanKering - 50} />
                            </div>
                            <div className="flex flex-col items-center w-1/3 text-center">
                                <span className="text-sky-500 font-bold mb-1">Gerimis / Rintik</span>
                                <NumberInput value={hujanKering} onChange={setHujanKering} min={hujanGerimis + 50} max={4095} />
                            </div>
                            <div className="flex flex-col items-center w-1/3 text-center">
                                <span className="font-bold mb-1 text-foreground">Kering</span>
                                <div className="flex items-center h-6">
                                    <span>&gt; {hujanKering}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                </Card>
            </div>

            {/* GRUP CARD DHT (SUHU & KELEMBABAN) */}
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                <div className="flex items-center gap-2 text-emerald-500">
                    <Thermometer className="w-5 h-5" />
                    <CardTitle className="text-lg">Suhu & Kelembaban (DHT11)</CardTitle>
                </div>
                </CardHeader>
                <CardContent className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold items-center">
                        <span>Batas Minimum Suhu</span>
                        <div className="flex items-center gap-1 text-emerald-600">
                            <NumberInput value={suhu} onChange={setSuhu} min={15} max={40} />
                            <span>°C</span>
                        </div>
                    </div>
                    <Slider 
                        value={[suhu]} 
                        min={15} max={40} step={1}
                        onValueChange={(val) => setSuhu(val[0])}
                        className="[&_[role=slider]]:border-emerald-500 [&_[role=slider]]:bg-emerald-500"
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold items-center">
                        <span>Batas Maksimum Kelembaban</span>
                        <div className="flex items-center gap-1 text-emerald-600">
                            <NumberInput value={kelembaban} onChange={setKelembaban} min={50} max={100} />
                            <span>%</span>
                        </div>
                    </div>
                    <Slider 
                        value={[kelembaban]} 
                        min={50} max={100} step={1}
                        onValueChange={(val) => setKelembaban(val[0])}
                        className="[&_[role=slider]]:border-emerald-500 [&_[role=slider]]:bg-emerald-500"
                    />
                </div>
                </CardContent>
            </Card>
        </div>
      )}

      <Button disabled={!isOnline} onClick={handlePublishConfig} size="lg" className="w-full h-12 rounded-xl bg-primary hover:bg-primary font-bold">
        {isOnline ? "Simpan Konfigurasi" : "Perangkat Offline (Tidak Dapat Menyimpan)"}
      </Button>
    </div>
  );
}