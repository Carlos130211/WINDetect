"use client";

import { useState } from "react";
import { Activity, ArrowRight, Menu, Wifi, X } from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050B18] text-white">
      {/* Fondo decorativo */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/[0.08] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <Wifi className="h-5 w-5 text-cyan-300" />
          </div>

          <div>
            <p className="text-[15px] font-bold tracking-[0.18em] text-white">
              WIN
            </p>
            <p className="text-[9px] font-medium tracking-[0.22em] text-slate-500">
              HOME CHECK
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#como-funciona"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Cómo funciona
          </a>

          <a
            href="#beneficios"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Beneficios
          </a>

          <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white">
            Ayuda
          </button>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-white/10 p-2 text-slate-300 md:hidden"
          aria-label="Abrir menú"
        >
          {menuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="relative z-30 border-y border-white/10 bg-[#081121] px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4 text-sm text-slate-300">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#beneficios">Beneficios</a>
            <a href="#diagnostico">Iniciar diagnóstico</a>
          </nav>
        </div>
      )}

      {/* Hero */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Texto */}
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3.5 py-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Diagnóstico inteligente de conectividad
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl lg:text-[4.4rem]">
              Conoce cómo funciona tu{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                WiFi
              </span>{" "}
              en cada rincón de tu hogar.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Recorre tu casa con el celular y descubre dónde tu conexión
              ofrece una buena experiencia y dónde podría estar perdiendo
              calidad.
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button
                id="diagnostico"
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-4 text-sm font-bold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.18)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(34,211,238,0.3)] sm:w-auto"
              >
                Iniciar diagnóstico
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>

              <span className="text-xs text-slate-500">
                Sin instalar ninguna aplicación
              </span>
            </div>

            {/* Mini beneficios */}
            <div
              id="beneficios"
              className="mt-14 grid max-w-lg grid-cols-3 gap-4 border-t border-white/[0.08] pt-7"
            >
              <div>
                <Activity className="mb-3 h-4 w-4 text-cyan-300" />
                <p className="text-sm font-medium text-slate-200">
                  Medición real
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Durante tu recorrido
                </p>
              </div>

              <div>
                <Wifi className="mb-3 h-4 w-4 text-cyan-300" />
                <p className="text-sm font-medium text-slate-200">
                  Por zonas
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Identifica cambios
                </p>
              </div>

              <div>
                <ArrowRight className="mb-3 h-4 w-4 text-cyan-300" />
                <p className="text-sm font-medium text-slate-200">
                  Reporte claro
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Entiende el resultado
                </p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[560px]">
            {/* Glow */}
            <div className="absolute h-72 w-72 rounded-full bg-cyan-400/[0.08] blur-[90px]" />

            {/* Anillos */}
            <div className="absolute h-[330px] w-[330px] rounded-full border border-cyan-300/[0.08]" />
            <div className="absolute h-[240px] w-[240px] rounded-full border border-cyan-300/[0.12]" />
            <div className="absolute h-[150px] w-[150px] rounded-full border border-cyan-300/[0.16]" />

            {/* Líneas de conexión */}
            <div className="absolute h-px w-[330px] rotate-45 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
            <div className="absolute h-px w-[330px] -rotate-45 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />

            {/* Tarjeta central */}
            <div className="relative z-10 flex h-52 w-52 flex-col items-center justify-center rounded-[2rem] border border-white/[0.12] bg-[#0B172B]/95 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-cyan-400/[0.08] to-transparent" />

              <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10">
                <Wifi className="h-8 w-8 text-cyan-300" />
              </div>

              <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Tu conexión
              </p>

              <p className="relative mt-2 text-lg font-semibold text-white">
                Lista para medir
              </p>
            </div>

            {/* Puntos flotantes */}
            <div className="absolute left-[5%] top-[24%] flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-200">
                Buena señal
              </span>
            </div>

            <div className="absolute right-[0%] top-[18%] flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.08] px-3 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-[10px] font-medium text-blue-200">
                Medición activa
              </span>
            </div>

            <div className="absolute bottom-[18%] left-[8%] flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-3 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-[10px] font-medium text-amber-200">
                Zona por revisar
              </span>
            </div>

            <div className="absolute bottom-[12%] right-[5%] hidden rounded-2xl border border-white/[0.08] bg-[#0B172B]/80 p-4 backdrop-blur-md sm:block">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Experiencia
              </p>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-2xl font-semibold text-white">360°</span>
                <span className="mb-1 text-xs text-slate-500">
                  de tu hogar
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Franja inferior */}
      <section
        id="como-funciona"
        className="relative z-10 border-t border-white/[0.06] bg-white/[0.015]"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:grid-cols-3 lg:px-10">
          <div className="flex gap-4">
            <span className="text-xs font-semibold text-cyan-300">01</span>
            <div>
              <p className="text-sm font-medium text-white">Inicia la prueba</p>
              <p className="mt-1 text-xs text-slate-500">
                Desde tu navegador.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="text-xs font-semibold text-cyan-300">02</span>
            <div>
              <p className="text-sm font-medium text-white">Recorre tu hogar</p>
              <p className="mt-1 text-xs text-slate-500">
                Mide la experiencia en distintas zonas.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="text-xs font-semibold text-cyan-300">03</span>
            <div>
              <p className="text-sm font-medium text-white">
                Obtén tu diagnóstico
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Comprende dónde mejorar tu conexión.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}