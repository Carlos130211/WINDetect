// app/api/send-report/route.ts
// Persona 4: recibe el reporte y confirma su recepcion.
// Aqui se integra el envio real a WIN (correo, base de datos o su API).

import type { Report } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  let report: Report;
  try {
    ({ report } = await request.json());
  } catch {
    return Response.json({ ok: false, error: "Cuerpo invalido" }, { status: 400 });
  }
  if (!report?.zones) return Response.json({ ok: false, error: "Reporte incompleto" }, { status: 400 });

  const ticket = `WIN-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const receivedAt = new Date().toISOString();

  // Punto de integracion: reemplazar por envio de correo o guardado en base de datos.
  console.log(`[WIN] ${ticket} | ${report.session.spaceType} | zonas=${report.zones.length} | estado=${report.overallStatus}`);

  return Response.json({ ok: true, ticket, receivedAt });
}