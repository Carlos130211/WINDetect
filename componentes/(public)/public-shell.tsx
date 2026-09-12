import Link from "next/link";
import { ArrowRight, CircleHelp, Home, Wifi } from "lucide-react";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-win-white text-win-text">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.10] blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/[0.08] blur-[140px]" />
      </div>

      <header className="relative z-10 border-b border-slate-200 bg-win-white backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" className="group flex items-center gap-3" aria-label="Ir al inicio">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-cyan-300/20 bg-cyan-300/[0.10] transition-transform group-hover:scale-105">
              <Wifi className="h-5 w-5 text-cyan-300" />
            </span>
            <span>
              <span className="block text-[15px] font-extrabold tracking-[0.22em]">WIN</span>
              <span className="block text-[9px] font-semibold tracking-[0.22em] text-win-orange">DETECT</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link href="/como-funciona" className="text-sm font-medium text-win-blue transition-colors hover:text-win-orange">Como funciona</Link>
            <Link href="/beneficios" className="text-sm font-medium text-win-blue transition-colors hover:text-win-orange">Beneficios</Link>
            <Link href="/ayuda" className="flex items-center gap-2 text-sm font-medium text-win-blue transition-colors hover:text-win-orange">
              <CircleHelp className="h-4 w-4" />
              Ayuda
            </Link>
          </nav>

          <Link href="/diagnostico" className="group flex items-center gap-2 rounded-xl bg-win-orange px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/15 transition-transform hover:-translate-y-0.5">
            <span className="hidden sm:inline">Iniciar diagnostico</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </header>

      <div className="relative z-10">{children}</div>

      <footer className="relative z-10 border-t border-slate-200 bg-win-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10"><Home className="h-4 w-4 text-cyan-300" /></span>
            <span className="text-xs font-bold tracking-[0.18em]">WINDetect</span>
          </Link>
          <p className="text-xs text-slate-600">Conectividad mas facil de entender.</p>
        </div>
      </footer>
    </main>
  );
}
