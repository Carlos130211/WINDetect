// lib/types.ts
// Contrato de datos compartido por todo el proyecto (Persona 4 lo mantiene).

export type SpaceType = "Casa" | "Departamento" | "Oficina";
export type ZoneStatus = "excelente" | "regular" | "critico";

export type Sample = { speed: number; latency: number; t: number };
export type Baseline = { speed: number; latency: number };

export type Leg = {
  from: string;
  to: string;
  avgSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  avgLatency: number;
  peakLatency: number;
  quality: number; // 0-100 relativo al router, calculado durante el recorrido
  samples: number;
};

export type Session = {
  id: string;
  createdAt: string; // ISO
  spaceType: SpaceType;
  rooms: string[];
  baseline: Baseline;
  legs: Leg[];
};

export type Zone = {
  name: string;
  from: string;
  status: ZoneStatus;
  quality: number;
  avgSpeed: number;
  minSpeed: number;
  peakLatency: number;
  lossVsBaseline: number; // % de rendimiento perdido respecto al router
  diagnosis: string;
  impacts: string[];
};

export type Report = {
  session: Session;
  zones: Zone[];
  counts: Record<ZoneStatus, number>;
  overallScore: number;
  overallStatus: ZoneStatus;
  worstZone: Zone | null;
  summary: string;
};