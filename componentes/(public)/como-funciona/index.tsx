import Link from "next/link";
import { Activity, ArrowRight, Home, Zap } from "lucide-react";
import { PublicShell } from "../public-shell";

const steps = [
  { number: "01", icon: Zap, title: "Inicia la medicion", text: "Presiona un boton y comienza sin instalar aplicaciones ni configurar equipos." },
  { number: "02", icon: Home, title: "Recorre tu hogar", text: "Camina por los espacios que quieras revisar mientras registramos tu experiencia." },
  { number: "03", icon: Activity, title: "Comprende el resultado", text: "Recibe un diagnostico visual para identificar las zonas que necesitan atencion." },
];

export default function ComoFuncionaPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Asi de sencillo</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] sm:text-6xl">Entender tu conexion no deberia ser complicado.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">Te acompanamos paso a paso para conocer como se comporta tu internet en los espacios que mas utilizas.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map(({ number, icon: Icon, title, text }) => (
            <article key={number} className="rounded-3xl border border-slate-200 bg-win-white p-7 transition-transform hover:-translate-y-1">
              <div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10"><Icon className="h-5 w-5 text-cyan-300" /></span><span className="text-sm font-bold text-slate-700">{number}</span></div>
              <h2 className="mt-7 text-xl font-bold">{title}</h2>
              <p className="mt-3 text-base leading-7 text-slate-400">{text}</p>
            </article>
          ))}
        </div>
        <Link href="/diagnostico" className="group mt-12 inline-flex items-center gap-3 rounded-xl bg-win-orange px-5 py-3.5 text-sm font-bold">Probar mi conexion <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
      </section>
    </PublicShell>
  );
}
