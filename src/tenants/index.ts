import type { TenantConfig } from "@/core/types";
import { meltTenant } from "./melt";

const tenants: Record<string, TenantConfig> = { melt: meltTenant };

export function getTenant(): TenantConfig {
  const slug = process.env.NEXT_PUBLIC_TENANT_SLUG ?? "melt";
  return tenants[slug] ?? meltTenant;
}
