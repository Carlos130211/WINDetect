import Link from "next/link";
import { Activity, ArrowRight, Network, ShieldCheck, Wifi } from "lucide-react";
import { PublicShell } from "../public-shell";

const benefits = [
  { icon: Wifi, title: "Informacion clara", text: "Resultados explicados con palabras sencillas." },
  { icon: Network, title: "Por espacios", text: "Identifica como cambia la experiencia en tu hogar." },
  { icon: Activity, title: "Recorrido real", text: "Observa la conexion mientras te mueves." },
  { icon: ShieldCheck, title: "Sin complicaciones", text: "Una experiencia pensada para cualquier usuario." },
];

export default function BeneficiosPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
        <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Mas que una prueba</p><h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl lg:text-6xl">No se trata solo de ver numeros.</h1><p className="mt-6 text-lg leading-8 text-slate-400">WINDetect transforma los datos de conectividad en informacion que cualquier persona puede comprender.</p></div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {benefits.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-slate-200 bg-win-white p-6"><span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300/10"><Icon className="h-5 w-5 text-cyan-300" /></span><h2 className="text-lg font-bold text-win-text">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}
        </div>
        <Link href="/diagnostico" className="group mt-12 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-5 py-3.5 text-sm font-bold text-cyan-200 sm:w-auto">Conocer mi conexion <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
      </section>
    </PublicShell>
  );
}
