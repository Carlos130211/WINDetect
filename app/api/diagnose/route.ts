// app/api/diagnose/route.ts
// Persona 3: genera el resumen en lenguaje natural con el LLM.
// Requiere la variable de entorno ANTHROPIC_API_KEY. Sin ella, responde con el resumen local.

import { localSummary } from "@/lib/classify";
import type { Report } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MODEL = "claude-haiku-4-5";
const ENDPOINT = "https://api.anthropic.com/v1/messages";

type TextBlock = { type: string; text?: string };

export async function POST(request: Request) {
  let report: Report;
  try {
    ({ report } = await request.json());
  } catch {
    return Response.json({ error: "Cuerpo invalido" }, { status: 400 });
  }
  if (!report?.zones) return Response.json({ error: "Reporte incompleto" }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return Response.json({ summary: localSummary(report), source: "local" });

  const zonesText = report.zones
    .map((zone) => `- ${zone.name}: ${zone.status}, ${zone.avgSpeed.toFixed(0)} Mbps, latencia pico ${zone.peakLatency.toFixed(0)} ms, pierde ${zone.lossVsBaseline}% vs router`)
    .join("\n");

  const prompt = `Datos de un recorrido de conectividad en un(a) ${report.session.spaceType.toLowerCase()}.
Router (referencia): ${report.session.baseline.speed.toFixed(0)} Mbps, ${report.session.baseline.latency.toFixed(0)} ms.
Zonas medidas:
${zonesText}

Escribe un resumen de 3 a 4 frases, en espanol, para una persona sin conocimientos tecnicos. Explica en que zonas la conexion llega bien y en cuales se degrada, y que problemas cotidianos podria notar. No afirmes que se mide la senal WiFi: habla de experiencia de conectividad. Solo texto corrido, sin vinetas ni titulos.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`API ${response.status}`);

    const data = (await response.json()) as { content?: TextBlock[] };
    const summary = (data.content ?? [])
      .filter((block) => block.type === "text" && block.text)
      .map((block) => block.text as string)
      .join("\n")
      .trim();

    return Response.json({ summary: summary || localSummary(report), source: summary ? "ai" : "local" });
  } catch {
    return Response.json({ summary: localSummary(report), source: "local" });
  }
}