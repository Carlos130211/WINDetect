"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Gauge,
  MapPinned,
  Route,
  Loader2,
  Send,
  Sparkles,
  TriangleAlert,
  Wifi,
} from "lucide-react";
import { PublicShell } from "@/componentes/(public)/public-shell";
import { loadSession } from "@/lib/session";
import { buildReport, localSummary, statusStyles } from "@/lib/classify";
import type { Report, Session } from "@/lib/types";

type SendState = "idle" | "sending" | "sent" | "error";

const subscribeToSession = () => () => undefined;
const getServerSession = () => null;
let cachedSession: Session | null | undefined;

const getSessionSnapshot = () => {
  if (cachedSession === undefined) cachedSession = loadSession();
  return cachedSession;
};

export default function ReportePage() {
  const session = useSyncExternalStore(subscribeToSession, getSessionSnapshot, getServerSession);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [ticket, setTicket] = useState<string | null>(null);

  const report: Report | null = useMemo(() => (session ? buildReport(session) : null), [session]);

  useEffect(() => {
    if (!report) return;
    fetch("/api/diagnose", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ report }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.summary) setSummary(data.summary);
      })
      .catch(() => undefined)
      .finally(() => setSummaryLoading(false));
  }, [report]);

  const displayedSummary = summary ?? (report ? localSummary(report) : null);

  const sendToWin = async () => {
    if (!report) return;
    setSendState("sending");
    try {
      const response = await fetch("/api/send-report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ report: { ...report, summary } }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error("Fallo el envio");
      setTicket(data.ticket);
      setSendState("sent");
    } catch {
      setSendState("error");
    }
  };

  if (!report || !session) {
    return (
      <PublicShell>
        <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10"><Wifi className="h-7 w-7 text-cyan-300" /></span>
          <h1 className="mt-6 text-2xl font-bold text-win-blue">Aun no hay un diagnostico</h1>
          <p className="mt-3 text-sm text-slate-400">Haz un recorrido para generar tu reporte.</p>
          <Link href="/diagnostico" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-win-orange px-6 py-3 text-sm font-bold text-white">Ir al diagnostico</Link>
        </section>
      </PublicShell>
    );
  }

  const overall = statusStyles[report.overallStatus];

  return (
    <PublicShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16 lg:py-24">
        <Link href="/diagnostico" className="inline-flex items-center gap-2 text-sm font-semibold text-win-blue hover:text-win-orange">
          <ArrowLeft className="h-4 w-4" /> Nuevo diagnostico
        </Link>

        {/* Cabecera con estado general */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-win-white p-5 sm:mt-10 sm:p-10">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10"><Wifi className="h-7 w-7 text-cyan-300" /></span>
              <h1 className="mt-6 text-2xl font-extrabold text-win-blue sm:text-4xl">Reporte de tu {session.spaceType.toLowerCase()}</h1>
              <p className="mt-2 text-sm text-slate-400">Recorrido con {report.zones.length} zonas · referencia {session.baseline.speed.toFixed(0)} Mbps en el router.</p>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${overall.badge}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${overall.dot}`} /> Calidad general: {overall.label}
            </span>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 min-[400px]:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-4 text-center"><p className="text-2xl font-bold text-emerald-700">{report.counts.excelente}</p><p className="text-xs text-emerald-700">Excelente</p></div>
            <div className="rounded-2xl bg-amber-50 p-4 text-center"><p className="text-2xl font-bold text-amber-700">{report.counts.regular}</p><p className="text-xs text-amber-700">Regular</p></div>
            <div className="rounded-2xl bg-rose-50 p-4 text-center"><p className="text-2xl font-bold text-rose-700">{report.counts.critico}</p><p className="text-xs text-rose-700">Critico</p></div>
          </div>
        </div>

        {/* Resumen IA */}
        <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.05] p-5 sm:p-8">
          <div className="flex items-center gap-2 text-win-blue"><Sparkles className="h-5 w-5 text-cyan-300" /><h2 className="text-lg font-bold">Analisis de tu experiencia</h2>{summaryLoading ? <Loader2 className="h-4 w-4 animate-spin text-cyan-300" /> : null}</div>
          <p className="mt-4 leading-7 text-slate-500">{displayedSummary}</p>
        </div>

        {/* Mapa de calor por recorrido */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-win-white p-5 sm:p-8" aria-labelledby="heatmap-title">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-win-blue"><Route className="h-5 w-5 text-cyan-300" /><h2 id="heatmap-title" className="text-xl font-bold">Mapa de calor por recorrido</h2></div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Cada ambiente muestra como cambia la experiencia desde el router hasta ese punto.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><span className="h-2.5 w-2.5 rounded-full bg-win-poor" /> Baja <span className="ml-2 h-2.5 w-2.5 rounded-full bg-win-regular" /> Media <span className="ml-2 h-2.5 w-2.5 rounded-full bg-win-excellent" /> Alta</div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {report.zones.map((zone) => {
              const styles = statusStyles[zone.status];
              const filledCells = Math.max(1, Math.ceil(zone.quality / 10));
              return (
                <article key={`heat-${zone.from}-${zone.name}`} className={`rounded-2xl border p-4 sm:p-5 ${styles.ring}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500"><MapPinned className="h-4 w-4 shrink-0 text-cyan-300" /> {zone.from} <span aria-hidden="true">→</span></p>
                      <h3 className="mt-1 truncate text-lg font-bold text-win-blue">{zone.name}</h3>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${styles.badge}`}>{zone.quality}%</span>
                  </div>

                  <div className="mt-5 flex items-center gap-2" aria-label={`Calidad ${zone.quality} de 100`}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-win-excellent/15 text-emerald-600"><MapPinned className="h-4 w-4" /></span>
                    <span className="h-1.5 flex-1 rounded-full bg-slate-100" />
                    <span className={`h-9 w-9 shrink-0 rounded-full border-4 bg-win-white ${styles.ring}`} />
                  </div>

                  <div className="mt-4 grid grid-cols-10 gap-1" aria-hidden="true">
                    {Array.from({ length: 10 }, (_, index) => (
                      <span key={index} className={`h-2 rounded-sm ${index < filledCells ? styles.dot : "bg-slate-100"}`} />
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-cyan-300" /> {zone.avgSpeed.toFixed(0)} Mbps</span>
                    <span className="text-right">Pico {zone.peakLatency.toFixed(0)} ms</span>
                  </div>
                  <p className={`mt-3 text-xs font-semibold ${styles.text}`}>{styles.label}: {zone.lossVsBaseline}% de perdida frente al router</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Tabla de zonas */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-win-white">
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full text-left text-sm">
              <thead className="bg-win-surface text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Zona</th>
                  <th className="px-5 py-3">Velocidad</th>
                  <th className="px-5 py-3">Latencia pico</th>
                  <th className="px-5 py-3">Perdida vs router</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.zones.map((zone) => {
                  const styles = statusStyles[zone.status];
                  return (
                    <tr key={`${zone.from}-${zone.name}`}>
                      <td className="px-5 py-3 font-semibold text-win-blue">{zone.name}</td>
                      <td className="px-5 py-3 text-slate-500">{zone.avgSpeed.toFixed(0)} Mbps</td>
                      <td className="px-5 py-3 text-slate-500">{zone.peakLatency.toFixed(0)} ms</td>
                      <td className="px-5 py-3 text-slate-500">{zone.lossVsBaseline}%</td>
                      <td className="px-5 py-3"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${styles.badge}`}><span className={`h-2 w-2 rounded-full ${styles.dot}`} /> {styles.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Zona critica destacada */}
        {report.worstZone && report.worstZone.status !== "excelente" ? (
          <div className={`mt-6 rounded-3xl border bg-win-white p-5 sm:p-8 ${statusStyles[report.worstZone.status].ring}`}>
            <div className="flex items-center gap-2"><TriangleAlert className={`h-5 w-5 ${statusStyles[report.worstZone.status].text}`} /><h2 className="text-lg font-bold text-win-blue">{report.worstZone.status === "critico" ? "Zona critica" : "Zona a observar"}: {report.worstZone.name}</h2></div>
            <p className="mt-3 text-sm leading-6 text-slate-500">{report.worstZone.diagnosis}</p>
            {report.worstZone.impacts.length ? (
              <ul className="mt-4 space-y-1.5 text-sm text-slate-500">
                {report.worstZone.impacts.map((impact) => (<li key={impact} className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${statusStyles[report.worstZone!.status].dot}`} /> {impact}</li>))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {/* Envio a WIN */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-win-white p-5 sm:p-8">
          {sendState === "sent" ? (
            <div className="flex items-center gap-3 text-sm text-emerald-700"><CheckCircle2 className="h-6 w-6 shrink-0" /><p>Diagnostico enviado a WIN. Tu codigo de seguimiento es <strong>{ticket}</strong>.</p></div>
          ) : (
            <>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="text-lg font-bold text-win-blue">Enviar diagnostico a WIN</h2><p className="mt-1 text-sm text-slate-400">Comparte este reporte para que WIN pueda revisar la cobertura de tu hogar.</p></div>
                <button type="button" onClick={sendToWin} disabled={sendState === "sending"} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-win-orange px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/15 disabled:opacity-50 sm:w-auto">
                  {sendState === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {sendState === "sending" ? "Enviando..." : "Enviar diagnostico a WIN"}
                </button>
              </div>
              {sendState === "error" ? <p className="mt-4 text-sm text-rose-600">No se pudo enviar. Intentalo de nuevo.</p> : null}
            </>
          )}
        </div>
      </section>
    </PublicShell>
  );
}