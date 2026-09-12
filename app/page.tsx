"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Check,
  CircleHelp,
  Home,
  Menu,
  MoveRight,
  Network,
  ShieldCheck,
  Sparkles,
  Wifi,
  X,
  Zap,
} from "lucide-react";

const homeTypes = [
  {
    id: "casa",
    label: "Casa",
    icon: Home,
    description: "Para evaluar la conexión en tu hogar.",
  },
  {
    id: "departamento",
    label: "Departamento",
    icon: Network,
    description: "Ideal para espacios con varias habitaciones.",
  },
  {
    id: "oficina",
    label: "Oficina",
    icon: Activity,
    description: "Para revisar tu conectividad de trabajo.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedHome, setSelectedHome] = useState("casa");
  const [showHelp, setShowHelp] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const isDark = false;

  const handleStart = () => {
    setIsStarting(true);

    setTimeout(() => {
      setIsStarting(false);
      router.push("/diagnostico");
    }, 700);
  };

  const selectedHomeData =
    homeTypes.find((item) => item.id === selectedHome) ?? homeTypes[0];

  return (
    <main
      className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${
        isDark
          ? "bg-win-blue text-white"
          : "bg-win-surface text-win-text"
      }`}
    >
      {/* =====================================================
          FONDO DECORATIVO
      ====================================================== */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full blur-[120px] transition-colors duration-700 ${
            isDark ? "bg-cyan-500/[0.10]" : "bg-cyan-400/[0.12]"
          }`}
        />

        <div
          className={`absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-[140px] ${
            isDark ? "bg-blue-600/[0.08]" : "bg-blue-400/[0.08]"
          }`}
        />

      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header
        className={`relative z-50 border-b transition-colors duration-500 ${
          isDark
            ? "border-white/[0.07] bg-win-blue"
            : "border-slate-200/80 bg-white/80"
        } backdrop-blur-xl`}
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3"
            aria-label="Ir al inicio"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-[14px] border transition-all duration-300 group-hover:scale-105 ${
                isDark
                  ? "border-cyan-300/20 bg-cyan-300/[0.10]"
                  : "border-cyan-600/20 bg-cyan-500/[0.10]"
              }`}
            >
              <Wifi
                className={`h-5 w-5 ${
                  isDark ? "text-cyan-300" : "text-cyan-700"
                }`}
              />
            </div>

            <div className="text-left">
              <p
                className={`text-[15px] font-extrabold tracking-[0.22em] ${
                  isDark ? "text-white" : "text-win-text"
                }`}
              >
                WIN
              </p>
              <p
                className={`text-[9px] font-semibold tracking-[0.22em] ${
                  isDark ? "text-slate-500" : "text-slate-500"
                }`}
              >
                DETECT
              </p>
            </div>
          </button>

          {/* Navegación desktop */}
          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="/como-funciona"
              className={`text-sm font-bold transition-colors ${
                isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Cómo funciona
            </a>

            <a
              href="/beneficios"
              className={`text-sm font-bold transition-colors ${
                isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Beneficios
            </a>

            <button
              onClick={() => setShowHelp(true)}
              className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <CircleHelp className="h-4 w-4" />
              Ayuda
            </button>
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Menú móvil */}
            <button
              onClick={() => setMenuOpen((current) => !current)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border lg:hidden ${
                isDark
                  ? "border-white/10 text-slate-300"
                  : "border-slate-200 text-slate-600"
              }`}
              aria-label="Abrir menú"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav
            className={`border-t px-5 py-5 sm:px-8 ${
              isDark
                ? "border-white/[0.07] bg-win-blue"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-1">
              <a
                href="/como-funciona"
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-3.5 text-base font-bold ${
                  isDark
                    ? "text-slate-300 hover:bg-white/[0.05]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Cómo funciona
              </a>

              <a
                href="/beneficios"
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-3.5 text-base font-bold ${
                  isDark
                    ? "text-slate-300 hover:bg-white/[0.05]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Beneficios
              </a>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowHelp(true);
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-base font-bold ${
                  isDark
                    ? "text-slate-300 hover:bg-white/[0.05]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <CircleHelp className="h-5 w-5" />
                Ayuda
              </button>

            </div>
          </nav>
        </div>
      </header>

      {/* =====================================================
          HERO PRINCIPAL
      ====================================================== */}
      <section className="relative z-10">
        <div className="mx-auto grid min-h-0 max-w-7xl items-center gap-10 px-4 py-10 sm:px-8 sm:py-16 lg:min-h-[calc(100vh-76px)] lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-10 lg:py-16">
          {/* Columna izquierda */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className={`mb-7 inline-flex items-center gap-2 rounded-full border px-3.5 py-2.5 ${
                isDark
                  ? "border-cyan-300/20 bg-cyan-300/[0.07]"
                  : "border-cyan-600/20 bg-cyan-50"
              }`}
            >
              <Sparkles
                className={`h-4 w-4 ${
                  isDark ? "text-cyan-300" : "text-cyan-700"
                }`}
              />

              <span
                className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                  isDark ? "text-cyan-200" : "text-cyan-800"
                }`}
              >
                Diagnóstico inteligente de conectividad
              </span>
            </div>

            {/* Título */}
            <h1
              className={`text-[2.35rem] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[4.25rem] ${
                isDark ? "text-white" : "text-win-text"
              }`}
            >
              Descubre cómo funciona tu{" "}
              <span className="text-win-orange">
                WiFi
              </span>{" "}
              en tu hogar.
            </h1>

            {/* Descripción */}
            <p
              className={`mt-7 max-w-xl text-lg leading-8 sm:text-xl ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Recorre tu casa con tu celular y descubre dónde tu conexión
              funciona bien y dónde podría estar perdiendo calidad.
            </p>

            {/* Selector de espacio */}
            <div className="mt-8">
              <p
                className={`mb-3 text-sm font-semibold ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                ¿Qué espacio quieres revisar?
              </p>

              <div className="flex flex-wrap gap-2.5">
                {homeTypes.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedHome === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedHome(item.id)}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isSelected
                          ? isDark
                            ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200 shadow-lg shadow-cyan-500/20"
                            : "border-cyan-600/40 bg-cyan-50 text-cyan-800"
                          : isDark
                            ? "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>

              <p
                className={`mt-3 text-sm ${
                  isDark ? "text-slate-500" : "text-slate-500"
                }`}
              >
                {selectedHomeData.description}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button
                onClick={handleStart}
                disabled={isStarting}
                className="group flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-win-orange px-7 text-base font-extrabold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/30 active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 sm:w-auto"
              >
                {isStarting ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Preparando...
                  </>
                ) : (
                  <>
                    Iniciar diagnóstico
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <div
                className={`flex items-center gap-2 text-sm ${
                  isDark ? "text-slate-500" : "text-slate-500"
                }`}
              >
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                No necesitas instalar nada
              </div>
            </div>

            {/* Confianza */}
            <div
              className={`mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-7 ${
                isDark ? "border-white/[0.08]" : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isDark ? "bg-white/[0.06]" : "bg-slate-100"
                  }`}
                >
                  <Zap
                    className={`h-4 w-4 ${
                      isDark ? "text-cyan-300" : "text-cyan-700"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Fácil de usar
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isDark ? "bg-white/[0.06]" : "bg-slate-100"
                  }`}
                >
                  <Activity
                    className={`h-4 w-4 ${
                      isDark ? "text-cyan-300" : "text-cyan-700"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Resultados claros
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isDark ? "bg-white/[0.06]" : "bg-slate-100"
                  }`}
                >
                  <Home
                    className={`h-4 w-4 ${
                      isDark ? "text-cyan-300" : "text-cyan-700"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Pensado para tu hogar
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              VISUAL INTERACTIVO
          ================================================== */}
          <div className="relative flex min-h-[320px] items-center justify-center sm:min-h-[420px] lg:min-h-[570px]">
            {/* Glow */}
            <div
              className={`absolute h-72 w-72 rounded-full blur-[100px] ${
                isDark ? "bg-cyan-400/[0.12]" : "bg-cyan-400/[0.14]"
              }`}
            />

            {/* Anillos de conectividad */}
            <div
              className={`absolute h-[270px] w-[270px] animate-[spin_30s_linear_infinite] rounded-full border border-dashed sm:h-[340px] sm:w-[340px] ${
                isDark ? "border-cyan-300/[0.10]" : "border-cyan-700/[0.12]"
              }`}
            />

            <div
              className={`absolute h-[220px] w-[220px] rounded-full border sm:h-[270px] sm:w-[270px] ${
                isDark ? "border-cyan-300/[0.12]" : "border-cyan-700/[0.14]"
              }`}
            />

            <div
              className={`absolute h-[165px] w-[165px] rounded-full border sm:h-[200px] sm:w-[200px] ${
                isDark ? "border-cyan-300/[0.16]" : "border-cyan-700/[0.16]"
              }`}
            />

            {/* Líneas */}
            <div
              className={`absolute h-px w-[260px] rotate-45 sm:w-[340px] ${
                "bg-win-orange"
              }`}
            />

            <div
              className={`absolute h-px w-[260px] -rotate-45 sm:w-[340px] ${
                "bg-win-orange"
              }`}
            />

            {/* Tarjeta central */}
            <div
              className={`relative z-10 flex h-[230px] w-[230px] flex-col items-center justify-center rounded-[2.2rem] border shadow-2xl backdrop-blur-xl transition-all duration-500 ${
                isDark
                  ? "border-white/[0.13] bg-win-blue shadow-cyan-950/40"
                  : "border-slate-200 bg-white/95 shadow-slate-300/40"
              }`}
            >

              <div
                className={`relative mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border ${
                  isDark
                    ? "border-cyan-300/20 bg-cyan-300/10"
                    : "border-cyan-600/20 bg-cyan-50"
                }`}
              >
                <Wifi
                  className={`h-9 w-9 ${
                    isDark ? "text-cyan-300" : "text-cyan-700"
                  }`}
                />

                <span className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-win-blue bg-emerald-400" />
              </div>

              <p
                className={`relative text-xs font-bold uppercase tracking-[0.2em] ${
                  isDark ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Tu conexión
              </p>

              <p
                className={`relative mt-2 text-xl font-bold ${
                  isDark ? "text-white" : "text-win-text"
                }`}
              >
                Lista para medir
              </p>

              <p
                className={`relative mt-2 text-center text-xs ${
                  isDark ? "text-slate-500" : "text-slate-500"
                }`}
              >
                {selectedHomeData.label} seleccionada
              </p>
            </div>

            {/* Tarjeta: buena experiencia */}
            <div
              className={`absolute left-0 top-[14%] z-20 hidden items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-1 sm:flex ${
                isDark
                  ? "border-emerald-400/20 bg-win-blue shadow-emerald-950/20"
                  : "border-emerald-200 bg-white/95 shadow-emerald-100"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                <Check className="h-4 w-4 text-emerald-500" />
              </div>

              <div>
                <p
                  className={`text-xs font-bold ${
                    isDark ? "text-emerald-200" : "text-emerald-700"
                  }`}
                >
                  Buena experiencia
                </p>
                <p
                  className={`mt-0.5 text-[11px] ${
                    isDark ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Zona estable
                </p>
              </div>
            </div>

            {/* Tarjeta: medición */}
            <div
              className={`absolute right-0 top-[8%] z-20 hidden items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-1 sm:flex ${
                isDark
                  ? "border-blue-400/20 bg-win-blue shadow-blue-950/20"
                  : "border-blue-200 bg-white/95 shadow-blue-100"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                <Activity className="h-4 w-4 text-blue-500" />
              </div>

              <div>
                <p
                  className={`text-xs font-bold ${
                    isDark ? "text-blue-200" : "text-blue-700"
                  }`}
                >
                  Medición en vivo
                </p>
                <p
                  className={`mt-0.5 text-[11px] ${
                    isDark ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Mientras recorres
                </p>
              </div>
            </div>

            {/* Tarjeta: zona por revisar */}
            <div
              className={`absolute bottom-[14%] left-[2%] z-20 hidden items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-1 sm:flex ${
                isDark
                  ? "border-amber-400/20 bg-win-blue shadow-amber-950/20"
                  : "border-amber-200 bg-white/95 shadow-amber-100"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
                <Activity className="h-4 w-4 text-amber-500" />
              </div>

              <div>
                <p
                  className={`text-xs font-bold ${
                    isDark ? "text-amber-200" : "text-amber-700"
                  }`}
                >
                  Zona por revisar
                </p>
                <p
                  className={`mt-0.5 text-[11px] ${
                    isDark ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Detecta cambios
                </p>
              </div>
            </div>

            {/* Mini tarjeta inferior */}
            <div
              className={`absolute bottom-[8%] right-[0%] hidden rounded-2xl border p-4 shadow-xl backdrop-blur-md sm:block ${
                isDark
                  ? "border-white/[0.10] bg-win-blue"
                  : "border-slate-200 bg-white/95"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    isDark ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Experiencia del hogar
                </p>
              </div>

              <p
                className={`mt-2 text-2xl font-extrabold ${
                  isDark ? "text-white" : "text-win-text"
                }`}
              >
                360°
              </p>

              <p
                className={`mt-1 text-xs ${
                  isDark ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Una visión más completa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECCIÓN CÓMO FUNCIONA
      ====================================================== */}
      <section
        id="como-funciona"
        className={`relative z-10 border-t ${
          isDark
            ? "border-white/[0.07] bg-white/[0.015]"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className={`text-xs font-bold uppercase tracking-[0.2em] ${
                isDark ? "text-cyan-300" : "text-cyan-700"
              }`}
            >
              Así de sencillo
            </p>

            <h2
              className={`mt-4 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl ${
                isDark ? "text-white" : "text-win-text"
              }`}
            >
              Entender tu conexión no debería ser complicado.
            </h2>

            <p
              className={`mt-5 text-lg leading-8 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Te acompañamos paso a paso para que conozcas cómo se comporta
              tu internet en los espacios que más utilizas.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: Zap,
                title: "Inicia la medición",
                description:
                  "Presiona un botón y comienza. No necesitas instalar aplicaciones ni configurar equipos.",
              },
              {
                number: "02",
                icon: Home,
                title: "Recorre tu hogar",
                description:
                  "Camina por los espacios que quieras revisar mientras registramos la experiencia de conexión.",
              },
              {
                number: "03",
                icon: Activity,
                title: "Comprende el resultado",
                description:
                  "Recibe un diagnóstico visual, sencillo y útil para identificar las zonas que necesitan atención.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className={`group relative rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                    isDark
                      ? "border-white/[0.08] bg-win-blue hover:border-cyan-300/20"
                      : "border-slate-200 bg-white shadow-sm hover:border-cyan-300/50 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        isDark ? "bg-cyan-300/10" : "bg-cyan-50"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isDark ? "text-cyan-300" : "text-cyan-700"
                        }`}
                      />
                    </div>

                    <span
                      className={`text-sm font-bold ${
                        isDark ? "text-slate-700" : "text-slate-300"
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  <h3
                    className={`mt-7 text-xl font-bold ${
                      isDark ? "text-white" : "text-win-text"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p
                    className={`mt-3 text-base leading-7 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {step.description}
                  </p>

                  <div
                    className={`mt-7 flex items-center gap-2 text-sm font-bold ${
                      isDark ? "text-cyan-300" : "text-cyan-700"
                    }`}
                  >
                    Fácil y guiado
                    <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          BENEFICIOS
      ====================================================== */}
      <section
        id="beneficios"
        className={`relative z-10 ${
          isDark ? "bg-win-blue" : "bg-win-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-[0.2em] ${
                  isDark ? "text-cyan-300" : "text-cyan-700"
                }`}
              >
                Más que una prueba
              </p>

              <h2
                className={`mt-4 text-3xl font-extrabold leading-tight tracking-[-0.035em] sm:text-4xl ${
                  isDark ? "text-white" : "text-win-text"
                }`}
              >
                No se trata solo de ver números.
                <span
                  className={`block ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Se trata de entender tu hogar.
                </span>
              </h2>

              <p
                className={`mt-6 text-lg leading-8 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                WINDetect transforma los datos de conectividad en
                información que cualquier persona puede comprender.
              </p>

              <button
                onClick={handleStart}
                className={`group mt-8 flex items-center gap-3 rounded-xl border px-5 py-3.5 text-sm font-bold transition-all ${
                  isDark
                    ? "border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200 hover:border-cyan-300/40 hover:bg-cyan-300/10"
                    : "border-cyan-600/20 bg-cyan-50 text-cyan-800 hover:border-cyan-600/40 hover:bg-cyan-100"
                }`}
              >
                Conocer mi conexión
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Wifi,
                  title: "Información clara",
                  text: "Resultados explicados con palabras sencillas.",
                },
                {
                  icon: Network,
                  title: "Por espacios",
                  text: "Identifica cómo cambia la experiencia en tu hogar.",
                },
                {
                  icon: Activity,
                  title: "Recorrido real",
                  text: "Observa el comportamiento de la conexión mientras te mueves.",
                },
                {
                  icon: ShieldCheck,
                  title: "Sin complicaciones",
                  text: "Una experiencia pensada para cualquier usuario.",
                },
              ].map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className={`rounded-2xl border p-6 ${
                      isDark
                        ? "border-white/[0.08] bg-win-blue"
                        : "border-slate-200 bg-white shadow-sm"
                    }`}
                  >
                    <div
                      className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${
                        isDark ? "bg-cyan-300/10" : "bg-cyan-50"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isDark ? "text-cyan-300" : "text-cyan-700"
                        }`}
                      />
                    </div>

                    <h3
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-win-text"
                      }`}
                    >
                      {benefit.title}
                    </h3>

                    <p
                      className={`mt-2 text-sm leading-6 ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {benefit.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA FINAL
      ====================================================== */}
      <section className="relative z-10 px-5 py-12 sm:px-8 lg:px-10 lg:py-20">
        <div
          className={`relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border px-6 py-14 text-center sm:px-12 lg:py-20 ${
            isDark
              ? "border-cyan-300/15 bg-win-blue"
              : "border-cyan-200 bg-win-white"
          }`}
        >
          <div
            className={`pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full blur-[100px] ${
              isDark ? "bg-cyan-400/[0.10]" : "bg-cyan-400/[0.15]"
            }`}
          />

          <div className="relative">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
                isDark ? "bg-cyan-300/10" : "bg-cyan-100"
              }`}
            >
              <Wifi
                className={`h-7 w-7 ${
                  isDark ? "text-cyan-300" : "text-cyan-700"
                }`}
              />
            </div>

            <h2
              className={`mx-auto mt-7 max-w-2xl text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl ${
                isDark ? "text-white" : "text-win-text"
              }`}
            >
              Empieza a conocer la experiencia de tu WiFi.
            </h2>

            <p
              className={`mx-auto mt-5 max-w-xl text-lg leading-8 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Una medición sencilla para tomar mejores decisiones sobre tu
              conectividad.
            </p>

            <button
              onClick={handleStart}
              className="group mt-8 inline-flex min-h-[56px] items-center justify-center gap-3 rounded-2xl bg-win-orange px-7 text-base font-extrabold text-white shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              Iniciar diagnóstico
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer
        className={`relative z-10 border-t ${
          isDark
            ? "border-white/[0.07] bg-win-blue"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                isDark ? "bg-cyan-300/10" : "bg-cyan-50"
              }`}
            >
              <Wifi
                className={`h-4 w-4 ${
                  isDark ? "text-cyan-300" : "text-cyan-700"
                }`}
              />
            </div>

            <div>
              <p
                className={`text-xs font-bold tracking-[0.18em] ${
                  isDark ? "text-white" : "text-win-text"
                }`}
              >
                WINDetect
              </p>
              <p
                className={`mt-1 text-xs ${
                  isDark ? "text-slate-600" : "text-slate-500"
                }`}
              >
                Conectividad más fácil de entender.
              </p>
            </div>
          </div>

          <p
            className={`text-xs ${
              isDark ? "text-slate-600" : "text-slate-500"
            }`}
          >
            Herramienta de diagnóstico de experiencia de conectividad.
          </p>
        </div>
      </footer>

      {/* =====================================================
          MODAL DE AYUDA
      ====================================================== */}
      {showHelp && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-win-blue/60 px-5 backdrop-blur-sm"
          onClick={() => setShowHelp(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
            className={`w-full max-w-md rounded-3xl border p-7 shadow-2xl ${
              isDark
                ? "border-white/10 bg-win-blue"
                : "border-slate-200 bg-white"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
                    isDark ? "bg-cyan-300/10" : "bg-cyan-50"
                  }`}
                >
                  <CircleHelp
                    className={`h-6 w-6 ${
                      isDark ? "text-cyan-300" : "text-cyan-700"
                    }`}
                  />
                </div>

                <h2
                  id="help-title"
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-win-text"
                  }`}
                >
                  ¿Cómo funciona?
                </h2>
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className={`rounded-xl p-2 ${
                  isDark
                    ? "text-slate-400 hover:bg-white/5 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
                aria-label="Cerrar ayuda"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p
              className={`mt-5 text-base leading-7 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              WINDetect te permite evaluar la experiencia de conectividad
              desde tu navegador mientras recorres los espacios de tu hogar.
            </p>

            <div
              className={`mt-5 rounded-2xl p-4 ${
                isDark ? "bg-white/[0.04]" : "bg-slate-50"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                No necesitas conocimientos técnicos.
              </p>
              <p
                className={`mt-2 text-sm leading-6 ${
                  isDark ? "text-slate-500" : "text-slate-600"
                }`}
              >
                Solo inicia la prueba, sigue las indicaciones y revisa el
                resultado.
              </p>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-win-orange py-3.5 text-sm font-bold text-white"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
