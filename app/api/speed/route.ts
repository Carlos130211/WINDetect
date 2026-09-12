export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requested = Number(url.searchParams.get("bytes")) || 2_000_000;
  const bytes = Math.min(10_000_000, Math.max(50_000, requested));

  const payload = new Uint8Array(bytes);
  for (let offset = 0; offset < bytes; offset += 65536) {
    crypto.getRandomValues(payload.subarray(offset, Math.min(offset + 65536, bytes)));
  }

  return new Response(payload, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(bytes),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}