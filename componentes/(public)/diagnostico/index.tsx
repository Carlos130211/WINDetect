"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Flag,
  Gauge,
  Home,
  MapPin,
  Play,
  Plus,
  RotateCcw,
  Router,
  Wifi,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PublicShell } from "../public-shell";

type SpaceType = "Casa" | "Departamento" | "Oficina";
type Phase = "setup" | "router" | "journey";

type Sample = { speed: number; latency: number; t: number };
type Baseline = { speed: number; latency: number };

type Leg = {
  from: string;
  to: string;
  avgSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  avgLatency: number;
  peakLatency: number;
  quality: number;
  samples: number;
};

type Live = { last: Sample | null; count: number; minSpeed: number; maxSpeed: number; peakLatency: number };

const spacePresets: Record<SpaceType, string[]> = {
  Casa: ["Sala", "Comedor", "Cocina", "Dormitorio principal", "Dormitorio 2", "Bano", "Patio"],
  Departamento: ["Sala", "Cocina", "Dormitorio", "Bano", "Balcon"],
  Oficina: ["Recepcion", "Sala de reuniones", "Area de trabajo", "Cocina / Break", "Almacen"],
};

const spaceIcon: Record<SpaceType, typeof Home> = { Casa: Home, Departamento: Building2, Oficina: Briefcase };

const ROUTER = "Router";
const SPEED_BYTES = 2_000_000;
const ROUTER_CYCLES = 4;
const GAP_MS = 300;
const SPEED_TIMEOUT = 8000;
const PING_TIMEOUT = 4000;

const emptyLive: Live = { last: null, count: 0, minSpeed: 0, maxSpeed: 0, peakLatency: 0 };

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const mean = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url: string, ms: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function measureLatency(): Promise<number> {
  const start = performance.now();
  await fetchWithTimeout(`/api/ping?t=${performance.now()}`, PING_TIMEOUT);
  return performance.now() - start;
}

async function measureSpeed(bytes: number): Promise<number> {
  const start = performance.now();
  const response = await fetchWithTimeout(`/api/speed?bytes=${bytes}&t=${performance.now()}`, SPEED_TIMEOUT);
  const buffer = await response.arrayBuffer();
  const seconds = (performance.now() - start) / 1000;
  return seconds > 0 ? (buffer.byteLength * 8) / 1_000_000 / seconds : 0;
}

async function measureCycle(): Promise<Sample> {
  try {
    const latency = await measureLatency();
    const speed = await measureSpeed(SPEED_BYTES);
    return { speed, latency, t: Date.now() };
  } catch {
    return { speed: 0, latency: 2000, t: Date.now() }; // zona sin conexion
  }
}

function runningFrom(samples: Sample[]): Live {
  if (!samples.length) return emptyLive;
  const speeds = samples.map((s) => s.speed);
  const latencies = samples.map((s) => s.latency);
  return {
    last: samples[samples.length - 1],
    count: samples.length,
    minSpeed: Math.min(...speeds),
    maxSpeed: Math.max(...speeds),
    peakLatency: Math.max(...latencies),
  };
}

function buildLeg(from: string, to: string, samples: Sample[], base: Baseline): Leg {
  const speeds = samples.map((s) => s.speed);
  const latencies = samples.map((s) => s.latency);
  const avgSpeed = mean(speeds);
  const minSpeed = speeds.length ? Math.min(...speeds) : 0;
  const maxSpeed = speeds.length ? Math.max(...speeds) : 0;
  const avgLatency = mean(latencies);
  const peakLatency = latencies.length ? Math.max(...latencies) : 0;

  const speedRatio = clamp01(avgSpeed / base.speed);
  const dropRatio = clamp01(minSpeed / base.speed);
  const latencyRatio = clamp01(base.latency / Math.max(1, avgLatency));
  const spikeRatio = clamp01(base.latency / Math.max(1, peakLatency));
  const quality = Math.round(100 * (speedRatio * 0.35 + dropRatio * 0.2 + latencyRatio * 0.25 + spikeRatio * 0.2));

  return { from, to, avgSpeed, minSpeed, maxSpeed, avgLatency, peakLatency, quality, samples: samples.length };
}

function qualityStyles(quality: number) {
  if (quality >= 80) return { dot: "bg-win-excellent", text: "text-emerald-600", ring: "border-emerald-200", label: "Excelente", verdict: "El internet llega bien en este tramo." };
  if (quality >= 50) return { dot: "bg-win-regular", text: "text-amber-600", ring: "border-amber-200", label: "Regular", verdict: "Se degrada en partes del recorrido." };
  return { dot: "bg-win-poor", text: "text-rose-600", ring: "border-rose-200", label: "Critico", verdict: "Aqui la conexion cae con fuerza." };
}

export default function DiagnosticoPage() {
  const [spaceType, setSpaceType] = useState<SpaceType>("Casa");
  const [rooms, setRooms] = useState<string[]>(spacePresets.Casa);
  const [customRoom, setCustomRoom] = useState("");
  const [phase, setPhase] = useState<Phase>("setup");
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [currentPoint, setCurrentPoint] = useState(ROUTER);
  const [visited, setVisited] = useState<string[]>([]);
  const [legs, setLegs] = useState<Leg[]>([]);
  const [destination, setDestination] = useState<string | null>(null);
  const [measuringRouter, setMeasuringRouter] = useState(false);
  const [live, setLive] = useState<Live>(emptyLive);

  const walkingRef = useRef(false);
  const legSamplesRef = useRef<Sample[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      walkingRef.current = false;
    };
  }, []);

  const selectSpace = (type: SpaceType) => {
    setSpaceType(type);
    setRooms(spacePresets[type]);
  };

  const toggleRoom = (room: string) =>
    setRooms((list) => (list.includes(room) ? list.filter((item) => item !== room) : [...list, room]));

  const addCustomRoom = () => {
    const name = customRoom.trim();
    if (!name || rooms.includes(name)) return;
    setRooms((list) => [...list, name]);
    setCustomRoom("");
  };

  const measureRouter = async () => {
    setMeasuringRouter(true);
    const samples: Sample[] = [];
    for (let i = 0; i < ROUTER_CYCLES; i += 1) {
      const sample = await measureCycle();
      if (!mountedRef.current) return;
      samples.push(sample);
      setLive(runningFrom(samples));
    }
    setBaseline({ speed: mean(samples.map((s) => s.speed)), latency: mean(samples.map((s) => s.latency)) });
    setMeasuringRouter(false);
    setLive(emptyLive);
    setCurrentPoint(ROUTER);
    setPhase("journey");
  };

  const walkTo = async (room: string) => {
    if (!baseline || destination) return;
    legSamplesRef.current = [];
    setLive(emptyLive);
    setDestination(room);
    walkingRef.current = true;

    while (walkingRef.current) {
      const sample = await measureCycle();
      if (!walkingRef.current || !mountedRef.current) break;
      legSamplesRef.current.push(sample);
      setLive(runningFrom(legSamplesRef.current));
      await sleep(GAP_MS);
    }
  };

  const arrive = () => {
    if (!destination || !baseline) return;
    walkingRef.current = false;
    const leg = buildLeg(currentPoint, destination, legSamplesRef.current, baseline);
    setLegs((prev) => [...prev, leg]);
    if (destination !== ROUTER) setVisited((prev) => [...prev, destination]);
    setCurrentPoint(destination);
    setDestination(null);
    legSamplesRef.current = [];
    setLive(emptyLive);
  };

  const reset = () => {
    walkingRef.current = false;
    setPhase("setup");
    setBaseline(null);
    setCurrentPoint(ROUTER);
    setVisited([]);
    setLegs([]);
    setDestination(null);
    setMeasuringRouter(false);
    setLive(emptyLive);
    legSamplesRef.current = [];
  };

  const suggestions = spacePresets[spaceType];
  const chips = [...suggestions, ...rooms.filter((room) => !suggestions.includes(room))];
  const available = rooms.filter((room) => !visited.includes(room));
  const done = phase === "journey" && currentPoint === ROUTER && legs.length > 0;
  const worstLeg = legs.length ? legs.reduce((worst, leg) => (leg.quality < worst.quality ? leg : worst)) : null;

  const SpaceIcon = spaceIcon[spaceType];

  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-win-blue hover:text-win-orange">
          <ArrowLeft className="h-4 w-4" /> Volver al inicio
        </Link>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-win-white p-7 sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10">
            <Wifi className="h-7 w-7 text-cyan-300" />
          </span>
          <h1 className="mt-7 text-3xl font-extrabold text-win-blue sm:text-4xl">Diagnostico de tu conexion</h1>
          <p className="mt-4 leading-7 text-slate-400">
            Sales del router, caminas hacia cada ambiente midiendo los picos del trayecto y vuelves al router para cerrar el recorrido. Con eso armamos el mapa de calor de la ruta.
          </p>
        </div>

        {/* PASO 1: tipo de espacio + ambientes */}
        {phase === "setup" ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-win-white p-7 sm:p-10">
            <h2 className="text-xl font-bold text-win-blue">1. Que tipo de espacio vas a medir?</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(Object.keys(spacePresets) as SpaceType[]).map((type) => {
                const Icon = spaceIcon[type];
                return (
                  <button key={type} type="button" onClick={() => selectSpace(type)} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${spaceType === type ? "border-win-blue bg-cyan-50 text-win-blue" : "border-slate-200 text-win-text hover:border-win-blue hover:text-win-blue"}`}>
                    <Icon className="h-4 w-4" /> {type}
                    {spaceType === type && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>

            <h2 className="mt-9 text-xl font-bold text-win-blue">2. Que ambientes tiene tu {spaceType.toLowerCase()}?</h2>
            <p className="mt-2 text-sm text-slate-400">Estos seran tus destinos durante el recorrido.</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {chips.map((room) => {
                const selected = rooms.includes(room);
                return (
                  <button key={room} type="button" onClick={() => toggleRoom(room)} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${selected ? "border-win-blue bg-cyan-50 text-win-blue" : "border-slate-200 text-slate-400 hover:border-win-blue"}`}>
                    <MapPin className="h-3.5 w-3.5" /> {room}
                    {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex gap-2">
              <input value={customRoom} onChange={(event) => setCustomRoom(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addCustomRoom()} placeholder="Agregar otro ambiente" className="flex-1 rounded-xl border border-slate-200 bg-win-surface px-4 py-2.5 text-sm outline-none focus:border-win-blue" />
              <button type="button" onClick={addCustomRoom} className="inline-flex items-center gap-1.5 rounded-xl bg-win-surface px-4 py-2.5 text-sm font-semibold text-win-blue hover:bg-cyan-50"><Plus className="h-4 w-4" /> Agregar</button>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.05] p-4 text-sm text-slate-400">
              <Router className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
              <p>El recorrido <strong className="text-win-text">empieza y termina en el router</strong>. Ese es tu punto de referencia; cada tramo se compara contra el.</p>
            </div>

            <button type="button" disabled={rooms.length === 0} onClick={() => setPhase("router")} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-win-orange py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/15 disabled:opacity-40">
              Continuar ({rooms.length} ambientes) <Play className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {/* PASO 2: medir router (punto principal) */}
        {phase === "router" ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-win-white p-7 sm:p-10 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-300/10"><Router className="h-8 w-8 text-cyan-300" /></span>
            <h2 className="mt-6 text-2xl font-bold text-win-blue">Colocate junto al router</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">Tomamos aqui la medicion base. Es el punto de partida y de llegada del recorrido.</p>

            {measuringRouter ? (
              <div className="mx-auto mt-8 max-w-sm">
                <p className="text-sm font-semibold text-win-blue">Midiendo punto base... ({live.count}/{ROUTER_CYCLES})</p>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <span className="flex items-center gap-1.5 text-emerald-600"><Gauge className="h-4 w-4" /> {live.last ? live.last.speed.toFixed(0) : "--"} Mbps</span>
                  <span className="flex items-center gap-1.5 text-amber-600"><Activity className="h-4 w-4" /> {live.last ? live.last.latency.toFixed(0) : "--"} ms</span>
                </div>
              </div>
            ) : (
              <button type="button" onClick={measureRouter} className="mx-auto mt-8 flex items-center justify-center gap-2 rounded-xl bg-win-orange px-8 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/15">
                <Router className="h-4 w-4" /> Medir router y empezar
              </button>
            )}
          </div>
        ) : null}

        {/* PASO 3: recorrido + mapa de calor */}
        {phase === "journey" ? (
          <>
            {/* Controles del recorrido */}
            {!done ? (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-win-white p-6 sm:p-8">
                <div className="flex items-center gap-2 text-sm font-semibold text-win-blue">
                  <MapPin className="h-4 w-4 text-cyan-300" /> Estas en: <span>{currentPoint}</span>
                </div>

                {destination ? (
                  <div className="mt-5 rounded-2xl border border-win-blue bg-cyan-50/40 p-5">
                    <p className="text-sm font-semibold text-win-blue">Caminando hacia {destination}...</p>
                    <p className="mt-1 text-xs text-slate-500">Midiendo los picos del trayecto. Camina sin apurarte.</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-xl bg-win-white p-3"><p className="text-xs text-slate-500">Ahora</p><p className="mt-1 text-lg font-bold text-win-blue">{live.last ? live.last.speed.toFixed(0) : "--"} <span className="text-xs">Mbps</span></p></div>
                      <div className="rounded-xl bg-win-white p-3"><p className="text-xs text-slate-500">Pico max</p><p className="mt-1 text-lg font-bold text-emerald-600">{live.maxSpeed.toFixed(0)} <span className="text-xs">Mbps</span></p></div>
                      <div className="rounded-xl bg-win-white p-3"><p className="text-xs text-slate-500">Caida min</p><p className="mt-1 text-lg font-bold text-rose-600">{live.minSpeed.toFixed(0)} <span className="text-xs">Mbps</span></p></div>
                      <div className="rounded-xl bg-win-white p-3"><p className="text-xs text-slate-500">Latencia pico</p><p className="mt-1 text-lg font-bold text-amber-600">{live.peakLatency.toFixed(0)} <span className="text-xs">ms</span></p></div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">Muestras del tramo: {live.count}</p>
                    <button type="button" onClick={arrive} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-win-orange py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/15">
                      <Flag className="h-4 w-4" /> Llegue a {destination}
                    </button>
                  </div>
                ) : (
                  <div className="mt-5">
                    <p className="text-sm text-slate-400">A donde vas ahora?</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {available.map((room) => (
                        <button key={room} type="button" onClick={() => walkTo(room)} className="flex items-center justify-between rounded-xl border border-slate-200 bg-win-surface px-4 py-3 text-sm font-semibold text-win-text transition-colors hover:border-win-blue hover:text-win-blue">
                          <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-300" /> {room}</span>
                          <Play className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                    {legs.length > 0 && currentPoint !== ROUTER ? (
                      <button type="button" onClick={() => walkTo(ROUTER)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-win-blue py-3.5 text-sm font-bold text-win-blue transition-colors hover:bg-cyan-50">
                        <Router className="h-4 w-4" /> Volver al router y terminar
                      </button>
                    ) : null}
                    {available.length === 0 && currentPoint !== ROUTER ? (
                      <p className="mt-3 text-center text-xs text-slate-400">Ya recorriste todos los ambientes. Vuelve al router para cerrar.</p>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}

            {/* Mapa de calor del recorrido */}
            {legs.length > 0 ? (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-win-white p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><SpaceIcon className="h-5 w-5 text-cyan-300" /><h2 className="text-xl font-bold text-win-blue">Mapa de calor del recorrido</h2></div>
                  <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">{done ? "Completo" : "En curso"}</span>
                </div>

                <div className="mt-6">
                  {/* Nodo inicial: router */}
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-win-excellent/15 text-emerald-600"><Router className="h-4 w-4" /></span>
                    <div><p className="text-sm font-bold text-win-blue">Router</p><p className="text-xs text-slate-500">Referencia: {baseline?.speed.toFixed(0)} Mbps / {baseline?.latency.toFixed(0)} ms</p></div>
                  </div>

                  {legs.map((leg, index) => {
                    const styles = qualityStyles(leg.quality);
                    return (
                      <div key={`${leg.from}-${leg.to}-${index}`}>
                        {/* Tramo */}
                        <div className="ml-4 flex gap-4 border-l-2 border-dashed border-slate-200 py-4 pl-6">
                          <div className={`w-full rounded-2xl border bg-win-white p-4 ${styles.ring}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{leg.from} → {leg.to}</span>
                              <span className={`flex items-center gap-1.5 text-xs font-bold ${styles.text}`}><span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} /> {leg.quality}% · {styles.label}</span>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-500">
                              <span>Pico: <strong className="text-emerald-600">{leg.maxSpeed.toFixed(0)} Mbps</strong></span>
                              <span>Caida: <strong className="text-rose-600">{leg.minSpeed.toFixed(0)} Mbps</strong></span>
                              <span>Lat. pico: <strong className="text-amber-600">{leg.peakLatency.toFixed(0)} ms</strong></span>
                            </div>
                            <p className="mt-2 text-xs text-slate-400">{styles.verdict}</p>
                          </div>
                        </div>
                        {/* Nodo destino */}
                        <div className="flex items-center gap-3">
                          <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-win-surface ${styles.text}`}>{leg.to === ROUTER ? <Router className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}</span>
                          <p className="text-sm font-bold text-win-blue">{leg.to}{leg.to === ROUTER ? " (fin)" : ""}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                  <span>Critico</span>
                  <div className="flex gap-1"><span className="h-3 w-6 rounded bg-win-poor" /><span className="h-3 w-6 rounded bg-win-regular" /><span className="h-3 w-6 rounded bg-win-excellent" /></div>
                  <span>Excelente</span>
                </div>

                {done ? (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-emerald-700">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <p>Recorrido cerrado. {worstLeg ? `El tramo mas critico fue ${worstLeg.from} → ${worstLeg.to} (${worstLeg.quality}%).` : ""} Ya puedes generar el reporte para WIN.</p>
                    </div>
                    <button type="button" onClick={reset} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-win-blue">
                      <RotateCcw className="h-4 w-4" /> Reiniciar diagnostico
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </PublicShell>
  );
}