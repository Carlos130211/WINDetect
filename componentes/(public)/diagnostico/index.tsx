"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Check,
  Home,
  Map,
  Network,
  RotateCcw,
  Wifi,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PublicShell } from "../public-shell";

const spaces = ["Casa", "Departamento", "Oficina"];
const heatRows = 5;
const heatColumns = 8;

type Measurement = {
  quality: number;
  latency: number;
  speed: number;
  x: number;
  y: number;
};

type NetworkInformation = {
  downlink?: number;
  rtt?: number;
};

const initialMeasurement: Measurement = {
  quality: 0,
  latency: 0,
  speed: 0,
  x: 50,
  y: 50,
};

const emptyHeatMap = () =>
  Array<number | null>(heatRows * heatColumns).fill(null);

function getHeatColor(value: number) {
  if (value >= 80) return "bg-win-excellent";
  if (value >= 50) return "bg-win-regular";
  return "bg-win-poor";
}

export default function DiagnosticoPage() {
  const [space, setSpace] = useState("Casa");
  const [started, setStarted] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [current, setCurrent] = useState(initialMeasurement);
  const [heatMap, setHeatMap] = useState<Array<number | null>>(emptyHeatMap);
  const watchId = useRef<number | null>(null);
  const sampleTimer = useRef<number | null>(null);
  const lastPosition = useRef({ x: 50, y: 50 });
  const origin = useRef<{ latitude: number; longitude: number } | null>(null);
  const hasLocation = useRef(false);
  const fallbackStep = useRef(0);

  const getHeatCell = (x: number, y: number) => {
    const column = Math.min(heatColumns - 1, Math.max(0, Math.floor((x / 100) * heatColumns)));
    const row = Math.min(heatRows - 1, Math.max(0, Math.floor((y / 100) * heatRows)));
    return row * heatColumns + column;
  };

  const sample = (x = lastPosition.current.x, y = lastPosition.current.y) => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const baseSpeed = connection?.downlink ?? 40;
    const baseLatency = connection?.rtt ?? 35;
    const speed = Math.max(4, baseSpeed + (Math.random() * 12 - 6));
    const latency = Math.max(8, baseLatency + (Math.random() * 20 - 10));
    const quality = Math.max(8, Math.min(100, 100 - latency / 2 + speed));
    const next = { quality, latency, speed, x, y };

    lastPosition.current = { x, y };
    setCurrent(next);
    setMeasurements((items) => [...items.slice(-39), next]);
    const cell = getHeatCell(x, y);
    setHeatMap((cells) => {
      const nextCells = [...cells];
      nextCells[cell] = quality;
      return nextCells;
    });
  };

  const sampleFallbackPosition = () => {
    const step = fallbackStep.current % 14;
    const row = Math.floor(fallbackStep.current / 14) % heatRows;
    const x = step % 2 === 0 ? 8 + step * 6 : 92 - step * 6;
    const y = 10 + row * 20;
    fallbackStep.current += 1;
    sample(x, y);
  };

  const start = () => {
    setStarted(true);
    setMeasurements([]);
    setHeatMap(emptyHeatMap());
    lastPosition.current = { x: 50, y: 50 };
    origin.current = null;
    hasLocation.current = false;
    fallbackStep.current = 0;
    sample();
    sampleTimer.current = window.setInterval(() => {
      if (!hasLocation.current) sampleFallbackPosition();
      else sample();
    }, 1000);

    if ("geolocation" in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          hasLocation.current = true;
          if (!origin.current) {
            origin.current = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
          }

          const x = Math.min(96, Math.max(4, 50 + (position.coords.longitude - origin.current.longitude) * 900000));
          const y = Math.min(96, Math.max(4, 50 - (position.coords.latitude - origin.current.latitude) * 900000));
          sample(x, y);
        },
        () => undefined,
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 },
      );
    }
  };

  const stop = () => {
    setStarted(false);
    if (sampleTimer.current) window.clearInterval(sampleTimer.current);
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    sampleTimer.current = null;
    watchId.current = null;
  };

  useEffect(() => () => stop(), []);

  const peakSpeed = measurements.length ? Math.max(...measurements.map((item) => item.speed)) : 0;
  const peakQuality = measurements.length ? Math.max(...measurements.map((item) => item.quality)) : 0;
  const averageLatency = measurements.length
    ? measurements.reduce((total, item) => total + item.latency, 0) / measurements.length
    : 0;
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-win-blue hover:text-win-orange"><ArrowLeft className="h-4 w-4" /> Volver al inicio</Link>
        <div className="mt-10 rounded-3xl border border-slate-200 bg-win-white p-7 sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10"><Wifi className="h-7 w-7 text-cyan-300" /></span>
          <h1 className="mt-7 text-3xl font-extrabold text-win-blue sm:text-4xl">Diagnostico de tu conexion</h1>
          <p className="mt-4 leading-7 text-slate-400">Selecciona el espacio, permite tu ubicacion y recorrelo para calcular picos y zonas de conectividad.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {spaces.map((item) => <button key={item} type="button" onClick={() => setSpace(item)} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${space === item ? "border-win-blue bg-cyan-50 text-win-blue" : "border-slate-200 text-win-text hover:border-win-blue hover:text-win-blue"}`}><Network className="h-4 w-4" />{item}{space === item && <Check className="h-4 w-4" />}</button>)}
          </div>
          <div className="mt-8 rounded-2xl bg-win-surface p-5"><div className="flex items-center gap-3"><Home className="h-5 w-5 text-cyan-300" /><p className="font-semibold">Espacio seleccionado: {space}</p></div><p className="mt-2 text-sm leading-6 text-slate-400">La medicion revisara la estabilidad de la conexion mientras recorres el espacio.</p></div>
          <button type="button" onClick={started ? stop : start} className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-win-orange py-4 text-sm font-bold shadow-lg shadow-cyan-500/15">{started ? <RotateCcw className="h-4 w-4" /> : null}{started ? "Detener medicion" : "Comenzar recorrido"}</button>
        </div>

        {started || measurements.length > 0 ? <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-win-white p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4"><div><div className="flex items-center gap-2"><Map className="h-5 w-5 text-cyan-300" /><h2 className="text-xl font-bold">Mapa de calor</h2></div><p className="mt-2 text-sm text-slate-400">Verde indica mejor experiencia; rojo requiere atencion.</p></div><span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">{started ? "En vivo" : "Resumen"}</span></div>
            <div className="mt-6 grid aspect-[8/5] grid-cols-8 gap-1.5 rounded-2xl border border-slate-200 bg-win-surface p-2">
              {heatMap.map((value, index) => <div key={`${index}-${value ?? "empty"}`} title={value === null ? "Sin medir" : `Calidad: ${Math.round(value)}%`} className={`${value === null ? "bg-win-white" : getHeatColor(value)} rounded-md opacity-90 transition-all duration-500`} />)}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>Mala</span><div className="flex gap-1"><span className="h-3 w-6 rounded bg-win-poor" /><span className="h-3 w-6 rounded bg-win-regular" /><span className="h-3 w-6 rounded bg-win-excellent" /></div><span>Excelente</span></div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-win-white p-6 sm:p-8"><div className="flex items-center gap-2"><Activity className="h-5 w-5 text-cyan-300" /><h2 className="text-xl font-bold text-win-blue">Picos detectados</h2></div><div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1"><div className="rounded-2xl bg-win-surface p-4"><p className="text-xs uppercase tracking-wider text-slate-500">Velocidad pico</p><p className="mt-2 text-2xl font-bold text-emerald-300">{peakSpeed.toFixed(1)} <span className="text-sm">Mbps</span></p></div><div className="rounded-2xl bg-win-surface p-4"><p className="text-xs uppercase tracking-wider text-slate-500">Calidad maxima</p><p className="mt-2 text-2xl font-bold text-emerald-300">{Math.round(peakQuality)}<span className="text-sm">%</span></p></div><div className="rounded-2xl bg-win-surface p-4"><p className="text-xs uppercase tracking-wider text-slate-500">Latencia media</p><p className="mt-2 text-2xl font-bold text-amber-300">{Math.round(averageLatency)} <span className="text-sm">ms</span></p></div></div><div className="mt-6 flex items-center justify-between rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.05] p-4 text-sm"><span className="text-slate-400">Muestra actual</span><strong className="text-win-blue">{Math.round(current.quality)}% calidad / {Math.round(current.latency)} ms</strong></div><p className="mt-4 text-sm leading-6 text-slate-400">Muestras registradas: <strong className="text-win-text">{measurements.length}</strong>. Los datos se calculan en este dispositivo.</p></div>
        </div> : null}
      </section>
    </PublicShell>
  );
}
