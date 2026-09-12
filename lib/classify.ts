// lib/classify.ts
// Persona 3: clasificacion y armado del reporte a partir de la sesion grabada.

import type { Baseline, Leg, Report, Session, Zone, ZoneStatus } from "./types";

const ROUTER = "Router";

export function statusFromQuality(quality: number): ZoneStatus {
  if (quality >= 80) return "excelente";
  if (quality >= 50) return "regular";
  return "critico";
}

export const statusStyles: Record<
  ZoneStatus,
  { label: string; dot: string; text: string; ring: string; badge: string }
> = {
  excelente: { label: "Excelente", dot: "bg-win-excellent", text: "text-emerald-600", ring: "border-emerald-200", badge: "bg-emerald-50 text-emerald-700" },
  regular: { label: "Regular", dot: "bg-win-regular", text: "text-amber-600", ring: "border-amber-200", badge: "bg-amber-50 text-amber-700" },
  critico: { label: "Critico", dot: "bg-win-poor", text: "text-rose-600", ring: "border-rose-200", badge: "bg-rose-50 text-rose-700" },
};

const impactsByStatus: Record<ZoneStatus, string[]> = {
  excelente: [],
  regular: ["Cargas mas lentas en momentos puntuales", "Posibles microcortes al ver streaming"],
  critico: ["Videos que se cortan o bajan de calidad", "Paginas que tardan en cargar", "Videollamadas inestables"],
};

function zoneDiagnosis(name: string, status: ZoneStatus, loss: number): string {
  if (status === "excelente") return `El internet llega bien a ${name}.`;
  if (status === "regular") return `${name} pierde aproximadamente ${loss}% de rendimiento respecto al router; la experiencia puede volverse irregular.`;
  return `Zona critica: ${name} pierde aproximadamente ${loss}% de rendimiento respecto al router.`;
}

export function classifyZone(leg: Leg, baseline: Baseline): Zone {
  const status = statusFromQuality(leg.quality);
  const lossVsBaseline = Math.max(0, Math.min(100, Math.round((1 - leg.avgSpeed / baseline.speed) * 100)));
  return {
    name: leg.to,
    from: leg.from,
    status,
    quality: leg.quality,
    avgSpeed: leg.avgSpeed,
    minSpeed: leg.minSpeed,
    peakLatency: leg.peakLatency,
    lossVsBaseline,
    diagnosis: zoneDiagnosis(leg.to, status, lossVsBaseline),
    impacts: impactsByStatus[status],
  };
}

export function buildReport(session: Session): Report {
  const zones = session.legs
    .filter((leg) => leg.to !== ROUTER)
    .map((leg) => classifyZone(leg, session.baseline));

  const counts: Record<ZoneStatus, number> = { excelente: 0, regular: 0, critico: 0 };
  for (const zone of zones) counts[zone.status] += 1;

  const overallScore = zones.length
    ? Math.round(zones.reduce((total, zone) => total + zone.quality, 0) / zones.length)
    : 100;

  let overallStatus = statusFromQuality(overallScore);
  if (counts.critico > 0 && overallStatus === "excelente") overallStatus = "regular";

  const worstZone = zones.length
    ? zones.reduce((worst, zone) => (zone.quality < worst.quality ? zone : worst))
    : null;

  return { session, zones, counts, overallScore, overallStatus, worstZone, summary: "" };
}

// Resumen determinista: se usa como fallback cuando la IA no esta disponible.
export function localSummary(report: Report): string {
  const { counts, worstZone, session } = report;
  const space = session.spaceType.toLowerCase();
  const total = report.zones.length;
  if (!total) return `Aun no hay zonas medidas en tu ${space}.`;

  const base = `En tu ${space} medimos ${total} zona${total === 1 ? "" : "s"}: ${counts.excelente} con buena cobertura`;
  if (worstZone && worstZone.status === "critico") {
    return `${base}. Encontramos una zona critica en ${worstZone.name}, donde la conexion pierde cerca de ${worstZone.lossVsBaseline}% de rendimiento respecto al router, lo que puede explicar cortes en videos o videollamadas.`;
  }
  if (worstZone && worstZone.status === "regular") {
    return `${base}. La cobertura es aceptable en general, con algunas variaciones en ${worstZone.name}.`;
  }
  return `${base}. La cobertura es buena en todo el recorrido.`;
}