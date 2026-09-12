import Link from "next/link";
import { ArrowRight, CircleHelp } from "lucide-react";
import { PublicShell } from "../public-shell";

export default function AyudaPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8 lg:py-28">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10"><CircleHelp className="h-7 w-7 text-cyan-300" /></span>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Ayuda</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] sm:text-6xl">Mide tu experiencia de conectividad.</h1>
        <p className="mt-6 text-lg leading-8 text-slate-400">Inicia la prueba desde tu navegador, recorre los espacios de tu hogar y revisa un resultado facil de entender. No necesitas conocimientos tecnicos.</p>
        <div className="mt-8 rounded-2xl bg-white/[0.04] p-5"><p className="font-semibold">Antes de comenzar</p><p className="mt-2 text-sm leading-6 text-slate-400">Conecta tu celular a la red WiFi que quieres evaluar y permite el acceso solicitado por el navegador.</p></div>
        <Link href="/diagnostico" className="group mt-10 inline-flex items-center gap-3 rounded-xl bg-win-orange px-5 py-3.5 text-sm font-bold">Iniciar diagnostico <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
      </section>
    </PublicShell>
  );
}
