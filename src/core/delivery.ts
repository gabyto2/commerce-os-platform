import type { DeliveryFeeBand } from "@/core/types";

export function calculateDeliveryFee(
  distanceKm: number,
  bands: DeliveryFeeBand[],
): number | null {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) return null;

  const orderedBands = [...bands].sort((a, b) => a.upToKm - b.upToKm);
  const matchingBand = orderedBands.find((band) => distanceKm <= band.upToKm);

  return matchingBand?.fee ?? null;
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
}
